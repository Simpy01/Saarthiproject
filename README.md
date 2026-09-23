# Saarthi Business Analytics Dashboard

This is a Vite + React dashboard designed for the supplied assessment.

## Important data rule

The dashboard does **not** contain invented business numbers. The files in `public/data/` are JSON contracts and are intentionally empty until you export the matching BigQuery query results.

Workflow:

CSV → Python cleaning → BigQuery tables → BigQuery SQL → JSON exports → dashboard → Vercel

## 1. Install and run

```bash
npm install
npm run dev
```

Then open the local URL shown by Vite.

## 2. Set your BigQuery project

Open every SQL file in `sql/` and replace:

`PROJECT_ID`

with your actual Google Cloud project ID.

The dataset/table names are:

- `analytics.chat_events`
- `analytics.llm_costs`
- `analytics.meta_ads_daily`
- `analytics.transactions`

## 3. Run the queries in BigQuery

Run:

- `01_funnel.sql`
- `02_revenue_monthly.sql`
- `03_channels.sql`
- `04_retention.sql`
- `05_llm_costs.sql`
- `06_quality.sql`

The dashboard is designed around the returned column names.

In the BigQuery console, query results can be saved/downloaded as newline-delimited JSON. Put the exported files in `public/data/` and rename them:

- `funnel.json`
- `revenue_monthly.json`
- `channels.json`
- `retention.json`
- `llm_costs.json`
- `quality.json`

If your downloaded JSON is a raw array rather than `{ "rows": [...] }`, wrap it like:

```json
{
  "meta": { "period": "March–August 2026" },
  "rows": [ ... ]
}
```

## 4. LLM cost

Keep LLM cost in USD unless the data supplies an FX rate. Do not invent an INR conversion.

## 5. Recommendations tab

`public/data/actions.json` is a template. Replace the example row with at most three recommendations after reviewing the actual BigQuery outputs.

Every recommendation should include:

- recommendation
- number
- source table/query
- value if it works
- arithmetic
- condition that must be true
- assumption/limitation

Do not manufacture a recommendation before the BigQuery evidence is available.

## 6. Deploy to Vercel

Push this folder to GitHub, then import the repository into Vercel.

Build command:

```text
npm run build
```

Output directory:

```text
dist
```

No server-side BigQuery credentials are needed for this static-export approach.

## 7. Query history submission

Run `sql/07_query_history.sql` in BigQuery and export the result as CSV. Keep this CSV with the notebook and cleaning decisions.

## 8. Dashboard design

Tab 1:
- KPI cards
- funnel
- monthly net revenue
- acquisition funnel by channel
- retention cohort grid
- LLM cost
- data quality/limitations

Tab 2:
- up to three evidence-based actions
- explicit arithmetic
- conditions and assumptions
- what not to do / what cannot be determined

Every chart/table has a title and analysis period.
