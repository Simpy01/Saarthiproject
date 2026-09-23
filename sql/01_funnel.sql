-- Replace PROJECT_ID before running.
WITH funnel AS (
  SELECT
    COUNT(DISTINCT IF(event_name = 'chat_started', user_id, NULL)) AS chat_started,
    COUNT(DISTINCT IF(event_name = 'profile_started', user_id, NULL)) AS profile_started,
    COUNT(DISTINCT IF(event_name = 'profile_completed', user_id, NULL)) AS profile_completed,
    COUNT(DISTINCT IF(event_name = 'paywall_shown', user_id, NULL)) AS paywall_shown,
    COUNT(DISTINCT IF(event_name = 'payment_initiated', user_id, NULL)) AS payment_initiated,
    COUNT(DISTINCT IF(event_name = 'payment_success', user_id, NULL)) AS payment_success
  FROM `PROJECT_ID.analytics.chat_events`
  WHERE DATE(event_ts) BETWEEN '2026-03-01' AND '2026-08-31'
)
SELECT 'Chat started' AS stage, chat_started AS users, 1.0 AS conversion_from_previous FROM funnel
UNION ALL SELECT 'Profile started', profile_started, SAFE_DIVIDE(profile_started, chat_started) FROM funnel
UNION ALL SELECT 'Profile completed', profile_completed, SAFE_DIVIDE(profile_completed, profile_started) FROM funnel
UNION ALL SELECT 'Paywall shown', paywall_shown, SAFE_DIVIDE(paywall_shown, profile_completed) FROM funnel
UNION ALL SELECT 'Payment initiated', payment_initiated, SAFE_DIVIDE(payment_initiated, paywall_shown) FROM funnel
UNION ALL SELECT 'Payment success', payment_success, SAFE_DIVIDE(payment_success, payment_initiated) FROM funnel
ORDER BY CASE stage
  WHEN 'Chat started' THEN 1 WHEN 'Profile started' THEN 2 WHEN 'Profile completed' THEN 3
  WHEN 'Paywall shown' THEN 4 WHEN 'Payment initiated' THEN 5 WHEN 'Payment success' THEN 6 END;