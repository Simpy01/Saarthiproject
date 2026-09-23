import React, { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  CircleDollarSign,
  Smartphone,
  Users,
  WalletCards,
} from "lucide-react";

const empty = { rows: [], meta: {} };
async function load(name) {
  const response = await fetch(`/data/${name}.json`);
  if (!response.ok) throw Error(`Missing ${name}.json`);
  const value = await response.json();
  return Array.isArray(value) ? { meta: {}, rows: value } : value;
}
const money = (n) =>
  n == null
    ? "—"
    : new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(Number(n));
const lakh = (n) => (n == null ? "—" : `₹${(Number(n) / 100000).toFixed(1)}L`);
const crore = (n) =>
  n == null ? "—" : `₹${(Number(n) / 10000000).toFixed(2)} Cr`;
const number = (n) =>
  n == null ? "—" : new Intl.NumberFormat("en-IN").format(Number(n));
const percent = (n) => `${Number(n).toFixed(2)}%`;
const segmentData = {
  device: [
    ["iOS", 6489, 637, 9.82],
    ["Desktop", 4500, 304, 6.76],
    ["Android", 39011, 2291, 5.87],
  ],
  city: [
    ["Delhi", 8516, 647, 7.6],
    ["Bengaluru", 5379, 406, 7.55],
    ["Mumbai", 7105, 509, 7.16],
    ["Pune", 4510, 322, 7.14],
    ["Patna", 3928, 234, 5.96],
    ["Kanpur", 4027, 227, 5.64],
  ],
  language: [
    ["Hinglish", 29170, 2152, 7.38],
    ["Hindi", 15520, 883, 5.69],
    ["English", 5310, 197, 3.71],
  ],
};
function Section({ title, eyebrow, children, className = "" }) {
  return (
    <section className={`section ${className}`}>
      <div className="section-head">
        <div>
          <div className="section-eyebrow">{eyebrow}</div>
          <h2>{title}</h2>
        </div>
      </div>
      {children}
    </section>
  );
}
function Empty({
  text = "Run the matching BigQuery query and export its result as JSON.",
}) {
  return (
    <div className="empty">
      <AlertTriangle size={18} />
      <span>{text}</span>
    </div>
  );
}
function Kpi({ icon: Icon, label, value, note, tone = "ink" }) {
  return (
    <div className={`kpi ${tone}`}>
      <div className="kpi-icon">
        <Icon size={18} />
      </div>
      <div>
        <div className="kpi-label">{label}</div>
        <div className="kpi-value">{value}</div>
        <div className="kpi-note">{note}</div>
      </div>
    </div>
  );
}
function SegmentTable({ title, rows }) {
  return (
    <div className="segment">
      <h3>{title}</h3>
      <div className="segment-list">
        {rows.map(([name, signups, payers, rate]) => (
          <div className="segment-row" key={name}>
            <span>{name}</span>
            <span>{number(signups)}</span>
            <strong>{percent(rate)}</strong>
          </div>
        ))}
      </div>
      <div className="segment-labels">
        <span>Segment</span>
        <span>Signups</span>
        <span>Paid conversion</span>
      </div>
    </div>
  );
}

function App() {
  const [tab, setTab] = useState("overview");
  const [data, setData] = useState({
    channels: empty,
    funnel: empty,
    revenue_monthly: empty,
    daily_trend: empty,
    retention: empty,
    llm_costs: empty,
    quality: empty,
    actions: empty,
  });
  const [error, setError] = useState("");
  useEffect(() => {
    Promise.all(Object.keys(data).map(async (key) => [key, await load(key)]))
      .then((entries) => setData(Object.fromEntries(entries)))
      .catch((e) => setError(e.message));
  }, []);
  const period = "1 Mar – 31 Aug 2026";
  const channels = data.channels.rows || [],
    funnel = data.funnel.rows || [],
    revenue = data.revenue_monthly.rows || [],
    daily = (data.daily_trend.rows || []).filter(
      (row) => !String(row.day).startsWith("2026-09"),
    );
  const totals = useMemo(
    () => ({
      spend: channels.reduce((sum, row) => sum + Number(row.spend_inr || 0), 0),
      signups: channels.reduce((sum, row) => sum + Number(row.signups || 0), 0),
      paying: channels.reduce(
        (sum, row) => sum + Number(row.paying_users || 0),
        0,
      ),
      gross: revenue.reduce(
        (sum, row) => sum + Number(row.gross_revenue_inr || 0),
        0,
      ),
      refunds: revenue.reduce(
        (sum, row) => sum + Number(row.refunded_inr || 0),
        0,
      ),
      net: revenue.reduce(
        (sum, row) => sum + Number(row.net_revenue_inr || 0),
        0,
      ),
    }),
    [channels, revenue],
  );
  const refundRate = totals.gross ? (totals.refunds / totals.gross) * 100 : 0;
  const displayCampaign = (name) =>
    name
      .replace("TA_", "")
      .replace("_Broad_WA", "")
      .replace("_Lookalike", "")
      .replace("_Retarget_Web", "")
      .replace("_Interest_Web", "")
      .replace("_Push_App", "")
      .replace("_Generic", "")
      .replaceAll("_", " ");
  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-inner">
          <div>
            <div className="eyebrow">SAARTHI / GROWTH & REVENUE REVIEW</div>
            <h1>Where growth turns into money.</h1>
            <p>
              Acquisition, conversion, monetization and the evidence behind the
              next move.
            </p>
          </div>
        </div>
      </header>
      <nav className="tabs">
        <div className="tabs-inner">
          <button
            className={tab === "overview" ? "active" : ""}
            onClick={() => setTab("overview")}
          >
            <BarChart3 size={17} /> Dashboard
          </button>
          <button
            className={tab === "actions" ? "active" : ""}
            onClick={() => setTab("actions")}
          >
            <ArrowRight size={17} /> What I’d do about it
          </button>
          <span className="nav-period">{period}</span>
        </div>
      </nav>
      {error && (
        <div className="error">
          <AlertTriangle size={18} /> {error}
        </div>
      )}
      {tab === "overview" ? (
        <main>
          <div className="hero-row">
            <div>
              <div className="section-eyebrow">EXECUTIVE OVERVIEW</div>
              <h2 className="page-title">
                The business is buying attention cheaply. The leak is after
                intent.
              </h2>
              <p className="page-subtitle">
                Six campaigns · 50,000 signups · the most important questions
                are conversion quality, refunds and the June revenue unit
                change.
              </p>
            </div>
            <div className="status-pill">
              <span /> Data quality / review required
            </div>
          </div>
          <div className="notice">
            <AlertTriangle size={18} />
            <div>
              <strong>Revenue is provisional from June onward.</strong> ₹25,100
              / ₹49,900 payments appear alongside the old ₹251 / ₹499 prices
              around the Razorpay → PayU switch. Validate with PayU or finance
              before using absolute revenue or ROAS for planning.
            </div>
          </div>
          <div className="kpi-grid">
            <Kpi
              icon={Users}
              label="Total signups"
              value={number(totals.signups)}
              note="6 campaigns"
            />
            <Kpi
              icon={CheckCircle2}
              label="Paid conversion"
              value={percent((totals.paying / totals.signups) * 100)}
              note={`${number(totals.paying)} paying users`}
              tone="teal"
            />
            <Kpi
              icon={CircleDollarSign}
              label="Ad spend"
              value={lakh(totals.spend)}
              note="Meta, all campaigns"
              tone="amber"
            />
            <Kpi
              icon={WalletCards}
              label="Net revenue"
              value={crore(totals.net)}
              note={`${lakh(totals.refunds)} refunded · ${percent(refundRate)} of gross`}
              tone="coral"
            />
          </div>
          <div className="dashboard-grid">
            <Section title="Signup to paid" eyebrow="01 / FUNNEL">
              <div className="funnel">
                <div className="funnel-intro">
                  <strong>46,510</strong>
                  <span>chat-start users</span>
                  <p>
                    Payment-success users are event-based; the headline payer
                    KPI uses deduplicated successful transactions.
                  </p>
                </div>
                {[
                  ["Chat started", 46510],
                  ["Profile started", 33002],
                  ["Profile completed", 18652],
                  ["Paywall shown", 16549],
                  ["Payment started", 4466],
                  ["Payment success", 3146],
                ].map(([label, value], index) => (
                  <div className="funnel-step" key={label}>
                    <div
                      className="funnel-bar"
                      style={{
                        width: `${Math.max(12, (value / 46510) * 100)}%`,
                      }}
                    >
                      <span>{label}</span>
                      <strong>{number(value)}</strong>
                    </div>
                    {index < 5 && (
                      <small>
                        −
                        {index === 0
                          ? 29
                          : index === 1
                            ? 43
                            : index === 2
                              ? 11
                              : index === 3
                                ? 73
                                : 30}
                        %
                      </small>
                    )}
                  </div>
                ))}
              </div>
            </Section>
            <Section
              title="Spend vs reported revenue"
              eyebrow="02 / MONTHLY TREND"
            >
              <div className="chart-note">
                June onward is provisional · ad spend is in INR and reported
                revenue follows the source export.
              </div>
              <div className="chart">
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={daily}>
                    <defs>
                      <linearGradient
                        id="revenueFill"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#f5a03c"
                          stopOpacity=".36"
                        />
                        <stop
                          offset="100%"
                          stopColor="#f5a03c"
                          stopOpacity=".03"
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="day" hide />
                    <YAxis
                      tickFormatter={(value) =>
                        value > 100000
                          ? `${Math.round(value / 100000)}L`
                          : `${Math.round(value / 1000)}k`
                      }
                    />
                    <Tooltip
                      formatter={(value, name) => [
                        name === "signups" ? number(value) : money(value),
                        name,
                      ]}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue_inr"
                      name="Reported revenue"
                      stroke="#f5a03c"
                      fill="url(#revenueFill)"
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="spend_inr"
                      name="Spend"
                      stroke="#176b68"
                      fill="none"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Section>
          </div>
          <Section title="Campaign economics" eyebrow="03 / CHANNELS">
            <p className="section-lede">
              Rows in red have a refund rate above 10%. Teal marks the lowest
              CAC per paying user. Reported revenue is provisional.
            </p>
            {channels.length ? (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Campaign</th>
                      <th>Spend</th>
                      <th>Signups</th>
                      <th>Paying</th>
                      <th>Paid conv.</th>
                      <th>Gross revenue</th>
                      <th>Refund rate</th>
                      <th>CAC / payer</th>
                    </tr>
                  </thead>
                  <tbody>
                    {channels.map((row) => {
                      const rev = revenue.find(
                        (item) => item.utm_campaign === row.utm_campaign,
                      );
                      const rate = rev
                        ? (Number(rev.refunded_inr) /
                            Number(rev.gross_revenue_inr)) *
                          100
                        : 0;
                      return (
                        <tr
                          className={rate > 10 ? "danger-row" : ""}
                          key={row.utm_campaign}
                        >
                          <td className="strong">
                            {displayCampaign(row.utm_campaign)}
                          </td>
                          <td>{money(row.spend_inr)}</td>
                          <td>{number(row.signups)}</td>
                          <td>{number(row.paying_users)}</td>
                          <td>
                            {percent(
                              (Number(row.paying_users) / Number(row.signups)) *
                                100,
                            )}
                          </td>
                          <td>{money(rev?.gross_revenue_inr)}</td>
                          <td>
                            <strong>{percent(rate)}</strong>
                          </td>
                          <td
                            className={
                              row.utm_campaign === "TA_Love_Retarget_Web"
                                ? "best-value"
                                : ""
                            }
                          >
                            {money(row.cac_per_paying_user_inr)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <Empty />
            )}
          </Section>
          <div className="two-col">
            <Section title="Limited retention signal" eyebrow="04 / RETENTION">
              <div className="retention-stat">
                <strong>98.3%</strong>
                <span>one-session users</span>
              </div>
              <p>
                There is no meaningful week-1 / week-4 cohort curve here. Of the
                796 users who came back for a second session, 80.5% went on to
                buy again.
              </p>
              <div className="retention-callout">
                <strong>Returners who repurchased</strong>
                <span>80.5%</span>
              </div>
            </Section>
            <Section title="Who converts" eyebrow="05 / SEGMENTS">
              <div className="segments">
                <SegmentTable title="By device" rows={segmentData.device} />
                <SegmentTable title="By language" rows={segmentData.language} />
              </div>
            </Section>
          </div>
          <Section title="City conversion" eyebrow="05 / SEGMENTS">
            <div className="city-grid">
              {segmentData.city.map(([name, signups, payers, rate]) => (
                <div className="city-row" key={name}>
                  <span>{name}</span>
                  <div className="city-track">
                    <i style={{ width: `${(rate / 8) * 100}%` }} />
                  </div>
                  <strong>{percent(rate)}</strong>
                </div>
              ))}
            </div>
          </Section>
          <Section
            title="Data quality and definitions"
            eyebrow="06 / READ THIS BEFORE PLANNING"
          >
            <div className="quality-grid">
              {(data.quality.rows || []).map((row, index) => (
                <div className="quality" key={index}>
                  <AlertTriangle size={17} />
                  <div>
                    <strong>{row.issue}</strong>
                    <p>{row.detail}</p>
                  </div>
                </div>
              ))}
              <div className="quality">
                <Smartphone size={17} />
                <div>
                  <strong>Android needs an audit</strong>
                  <p>
                    Android is 78% of signups but converts at 5.87% versus iOS
                    at 9.82%. The gap is an opportunity, not yet a causal
                    diagnosis.
                  </p>
                </div>
              </div>
            </div>
          </Section>
        </main>
      ) : (
        <main>
          <div className="hero-row">
            <div>
              <div className="section-eyebrow">DECISION SUPPORT</div>
              <h2 className="page-title">What I’d do about it</h2>
              <p className="page-subtitle">
                Three moves ranked by confidence, not by rupee size. Each is a
                testable hypothesis.
              </p>
            </div>
          </div>
          <div className="action-list">
            {(data.actions.rows || []).slice(0, 3).map((action, index) => (
              <article className="action-card" key={index}>
                <div className="action-number">0{index + 1}</div>
                <div className="action-body">
                  <div className="action-kicker">
                    {index === 0
                      ? "Highest confidence"
                      : index === 1
                        ? "Medium confidence"
                        : "Investigation first"}
                  </div>
                  <h3>{action.recommendation}</h3>
                  <div className="action-grid">
                    <div>
                      <span>Evidence</span>
                      <strong>{action.number}</strong>
                      <p>{action.source_table}</p>
                    </div>
                    <div>
                      <span>What's worth</span>
                      <strong>{action.value_if_works}</strong>
                      <p>{action.arithmetic}</p>
                    </div>
                    <div>
                      <span>Needs to be true</span>
                      <strong>{action.condition}</strong>
                    </div>
                    <div>
                      <span>Limitation</span>
                      <strong>{action.assumption}</strong>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div className="do-not">
            <div className="section-eyebrow">A NOTE ON RETENTION</div>
            <h3>Do not build a win-back campaign yet.</h3>
            <p>
              98.3% of users take exactly one session. That is a product or
              expectation question before it is a push-notification problem. The
              80.5% repurchase rate among returners says the payoff is real if
              they come back; it does not tell us how to make them return.
            </p>
          </div>
          <div className="open-question">
            <AlertTriangle size={20} />
            <div>
              <strong>The one question that changes every rupee number</strong>
              <p>
                Is the June step-change a real premium tier launch, or a
                paise/rupee unit-logging bug from the PayU migration? Check PayU
                and finance records before using absolute revenue, ROAS or
                money-at-stake scenarios.
              </p>
            </div>
          </div>
        </main>
      )}
      <footer>
        Analysis period: {period} · Source: cleaned Saarthi tables / BigQuery
        logic
      </footer>
    </div>
  );
}
export default App;
