WITH spend AS (
  SELECT campaign_name AS utm_campaign, SUM(spend_inr) AS spend_inr
  FROM `saarthi.meta`
  WHERE date BETWEEN '2026-03-01' AND '2026-08-31'
  GROUP BY campaign_name
),
signups AS (
  SELECT utm_campaign, COUNT(*) AS signups
  FROM `saarthi.users`
  WHERE DATE(first_seen_at) BETWEEN '2026-03-01' AND '2026-08-31'
  GROUP BY utm_campaign
),
paying AS (
  SELECT u.utm_campaign, COUNT(DISTINCT t.user_id) AS paying_users
  FROM `saarthi.transaction` t
  JOIN `saarthi.users` u USING (user_id)
  WHERE t.status = 'success'
    AND DATE(t.created_at) BETWEEN '2026-03-01' AND '2026-08-31'
  GROUP BY u.utm_campaign
)
SELECT
  s.utm_campaign,
  s.spend_inr,
  su.signups,
  COALESCE(p.paying_users, 0) AS paying_users,
  ROUND(SAFE_DIVIDE(s.spend_inr, su.signups), 2) AS cac_per_signup_inr,
  ROUND(SAFE_DIVIDE(s.spend_inr, p.paying_users), 2) AS cac_per_paying_user_inr
FROM spend s
JOIN signups su USING (utm_campaign)
LEFT JOIN paying p USING (utm_campaign)
ORDER BY s.spend_inr DESC;