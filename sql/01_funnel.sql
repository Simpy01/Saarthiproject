SELECT
  u.utm_campaign,
  COUNT(DISTINCT CASE WHEN e.event_name = 'chat_started' THEN e.user_id END) AS chat_started,
  COUNT(DISTINCT CASE WHEN e.event_name = 'profile_started' THEN e.user_id END) AS profile_started,
  COUNT(DISTINCT CASE WHEN e.event_name = 'profile_completed' THEN e.user_id END) AS profile_completed,
  COUNT(DISTINCT CASE WHEN e.event_name = 'paywall_shown' THEN e.user_id END) AS paywall_shown,
  COUNT(DISTINCT CASE WHEN e.event_name = 'payment_initiated' THEN e.user_id END) AS payment_initiated,
  COUNT(DISTINCT CASE WHEN e.event_name = 'payment_success' THEN e.user_id END) AS payment_success,
  ROUND(SAFE_DIVIDE(
    COUNT(DISTINCT CASE WHEN e.event_name = 'payment_success' THEN e.user_id END),
    COUNT(DISTINCT CASE WHEN e.event_name = 'chat_started' THEN e.user_id END)) * 100, 2) AS overall_conv_pct
FROM `saarthi.chat` e
JOIN `saarthi.users` u USING (user_id)
WHERE DATE(e.event_ts) BETWEEN '2026-03-01' AND '2026-08-31'
GROUP BY u.utm_campaign
ORDER BY chat_started DESC;