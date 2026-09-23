WITH first_chat AS (
  SELECT user_id, DATE_TRUNC(DATE(MIN(event_ts)), MONTH) AS cohort_month
  FROM `saarthi.chat`
  WHERE event_name = 'chat_started'
  GROUP BY user_id
  HAVING DATE(MIN(event_ts)) BETWEEN '2026-03-01' AND '2026-08-31'
),
activity AS (
  SELECT DISTINCT user_id, DATE_TRUNC(DATE(event_ts), MONTH) AS activity_month
  FROM `saarthi.chat`
  WHERE DATE(event_ts) BETWEEN '2026-03-01' AND '2026-08-31'
),
cohort_activity AS (
  SELECT f.cohort_month, a.activity_month, COUNT(DISTINCT a.user_id) AS active_users
  FROM first_chat f JOIN activity a USING (user_id)
  GROUP BY f.cohort_month, a.activity_month
),
cohort_sizes AS (
  SELECT cohort_month, COUNT(*) AS cohort_users
  FROM first_chat GROUP BY cohort_month
)
SELECT
  ca.cohort_month,
  ca.activity_month,
  DATE_DIFF(ca.activity_month, ca.cohort_month, MONTH) AS months_since_acquisition,
  ca.active_users,
  cs.cohort_users,
  SAFE_DIVIDE(ca.active_users, cs.cohort_users) AS retention_rate
FROM cohort_activity ca JOIN cohort_sizes cs USING (cohort_month)
WHERE ca.activity_month >= ca.cohort_month
ORDER BY ca.cohort_month, ca.activity_month;