-- Query 1: repaired event user IDs
SELECT
  'Event user IDs repaired from session_id' AS issue,
  CAST(COUNTIF(user_id_source = 'repaired_from_session_id') AS STRING) AS value,
  CONCAT('The cleaning notebook repaired these rows because session_id provided the canonical user mapping.') AS detail
FROM `PROJECT_ID.analytics.chat_events`;

-- Query 2: out-of-period transactions
SELECT
  'Transactions outside dashboard period' AS issue,
  CAST(COUNTIF(in_analysis_period = FALSE) AS STRING) AS value,
  'Retained in the source history; excluded from March–August dashboard calculations.' AS detail
FROM `PROJECT_ID.analytics.transactions`;

-- Query 3: transaction status aliases after cleaning
SELECT
  'Refund status aliases remaining' AS issue,
  CAST(COUNTIF(status = 'refund') AS STRING) AS value,
  'Expected to be zero after cleaning.' AS detail
FROM `PROJECT_ID.analytics.transactions`;