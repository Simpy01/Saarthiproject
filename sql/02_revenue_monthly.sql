SELECT
  u.utm_campaign,
  SUM(IF(t.status = 'success', t.amount, 0)) AS gross_revenue_inr,
  SUM(IF(t.status = 'refund', t.amount, 0)) AS refunded_inr,
  SUM(IF(t.status = 'success', t.amount, 0))
    - SUM(IF(t.status = 'refund', t.amount, 0)) AS net_revenue_inr
FROM `saarthi.transaction` t
JOIN `saarthi.users` u USING (user_id)
WHERE DATE(t.created_at) BETWEEN '2026-03-01' AND '2026-08-31'
GROUP BY u.utm_campaign
ORDER BY net_revenue_inr DESC;