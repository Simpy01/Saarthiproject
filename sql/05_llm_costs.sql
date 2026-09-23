SELECT
  u.utm_campaign,
  COUNT(DISTINCT l.user_id) AS users_with_llm_cost,
  ROUND(SUM(l.cost_usd), 2) AS total_llm_cost_usd,
  ROUND(AVG(l.cost_usd), 4) AS avg_cost_per_session_usd
FROM `saarthi.llm` l
JOIN `saarthi.users` u USING (user_id)
WHERE DATE(l.date) BETWEEN '2026-03-01' AND '2026-08-31'
GROUP BY u.utm_campaign
ORDER BY total_llm_cost_usd DESC;