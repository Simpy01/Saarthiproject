WITH session_channel AS (
  SELECT session_id, ANY_VALUE(channel) AS channel
  FROM `PROJECT_ID.analytics.chat_events`
  WHERE DATE(event_ts) BETWEEN '2026-03-01' AND '2026-08-31'
  GROUP BY session_id
),
event_funnel AS (
  SELECT
    channel,
    COUNT(DISTINCT IF(event_name = 'chat_started', user_id, NULL)) AS started,
    COUNT(DISTINCT IF(event_name = 'profile_completed', user_id, NULL)) AS completed_profile,
    COUNT(DISTINCT IF(event_name = 'payment_success', user_id, NULL)) AS paid
  FROM `PROJECT_ID.analytics.chat_events`
  WHERE DATE(event_ts) BETWEEN '2026-03-01' AND '2026-08-31'
  GROUP BY channel
),
revenue AS (
  SELECT
    t.session_id,
    SUM(IF(t.status = 'success', t.amount, 0))
      - SUM(IF(t.status = 'refunded', t.refund_amount, 0)) AS net_revenue_inr
  FROM `PROJECT_ID.analytics.transactions` t
  WHERE DATE(t.created_at) BETWEEN '2026-03-01' AND '2026-08-31'
  GROUP BY t.session_id
),
revenue_by_channel AS (
  SELECT sc.channel, SUM(r.net_revenue_inr) AS net_revenue_inr
  FROM revenue r JOIN session_channel sc USING (session_id)
  GROUP BY sc.channel
)
SELECT
  e.channel, e.started, e.completed_profile, e.paid,
  SAFE_DIVIDE(e.paid, e.started) AS start_to_paid_conversion,
  COALESCE(r.net_revenue_inr, 0) AS net_revenue_inr
FROM event_funnel e
LEFT JOIN revenue_by_channel r USING (channel)
ORDER BY net_revenue_inr DESC;