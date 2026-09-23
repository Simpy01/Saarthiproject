SELECT
  date,
  SUM(cost_usd) AS cost_usd,
  SUM(input_tokens) AS input_tokens,
  SUM(output_tokens) AS output_tokens,
  COUNT(DISTINCT user_id) AS users
FROM `PROJECT_ID.analytics.llm_costs`
WHERE date BETWEEN '2026-03-01' AND '2026-08-31'
GROUP BY date
ORDER BY date;