WITH monthly AS (
  SELECT
    DATE_TRUNC(DATE(created_at), MONTH) AS month,
    SUM(IF(status = 'success', amount, 0)) AS gross_revenue_inr,
    SUM(IF(status = 'refunded', refund_amount, 0)) AS refunds_inr
  FROM `PROJECT_ID.analytics.transactions`
  WHERE DATE(created_at) BETWEEN '2026-03-01' AND '2026-08-31'
  GROUP BY month
)
SELECT month, gross_revenue_inr, refunds_inr,
       gross_revenue_inr - refunds_inr AS net_revenue_inr
FROM monthly ORDER BY month;