# Data Dictionary: Reporting Data-Quality Anomaly Detector

## 1. Overview
This data dictionary details the schema, operational definitions, data lineage, and anomaly taxonomy for the aggregated reporting feed dataset (`data/synthetic/reporting_feed.csv`).

## 2. Dataset Architecture
- **Record Volume**: 24,000 transaction rows.
- **Reporting Period End**: `2026-06-30`.
- **Source Systems**: 5 distinct reporting originators (`ERP_A`, `ERP_B`, `SUBLEDGER`, `TREASURY`, `MANUAL`).
- **Defect Prevalence**: 3,120 broken rows (13.0% injected stress prevalence).

---

## 3. Schema Specifications

| Column Name | Data Type | Nullable | Business Definition | Typical Values / Range |
|---|---|---|---|---|
| `ref_id` | Integer | No | Transaction unique sequence identifier. | 0 to 23,999 |
| `source` | String (Categorical) | No | Originating ledger / subledger system feed. | `ERP_A`, `ERP_B`, `SUBLEDGER`, `TREASURY`, `MANUAL` |
| `account` | Integer (Categorical) | No | General Ledger chart of accounts identifier. | 100 to 159 (60 accounts) |
| `entity` | String (Categorical) | Yes (when broken) | Legal operating entity code. | `E01` to `E12`, or `NULL` |
| `amount` | Float | No | Monetary journal entry amount in USD. | -$1.2M to +$4.5M |
| `period_end` | Timestamp | No | Reporting fiscal period cut-off date. | `2026-06-30` |
| `posting_lag_days` | Float | No | Number of elapsed days between transaction effective date and ledger posting. | 0 to 120 days |
| `label` | String (Categorical) | No | Ground-truth defect classification label. | `ok`, `duplicate`, `sign_flip`, `magnitude_x10`, `stale_posting`, `missing_entity` |
| `is_break` | Binary (0/1) | No | Binary flag indicating any corrupt / broken row ($1 = \text{break}, 0 = \text{clean}$). | 0 or 1 |

---

## 4. Derived Feature Matrix Lineage

| Feature Symbol | Definition | Mathematical Derivation | Anomaly Target |
|---|---|---|---|
| `log_abs_amount` | Log absolute magnitude | $\log(1 + |\text{amount}|)$ | Outlier scale |
| `acct_z` | Account-level standard score | $\left|\frac{\text{amount} - \mu_{\text{acct}}}{\sigma_{\text{acct}}}\right|$ | Outlier magnitude |
| `ratio_to_median` | Ratio to account median | $\frac{|\text{amount}|}{\text{Median}_{\text{acct}}(|\text{amount}|)}$ | Magnitude x10 errors |
| `sign_vs_acct` | Discordance with normal account sign | $\text{sign}(\text{amount}) \neq \text{sign}(\text{Median}_{\text{acct}}(\text{amount}))$ | **Sign flips & contra-account entries** |
| `dup_key_count` | Duplicate key occurrence count | $\text{Count}_{(\text{ref\_id}, \text{amount}, \text{account})} - 1$ | Duplicate transactions |
| `missing_entity` | Null entity indicator | $\mathbb{I}(\text{entity is NULL})$ | Missing entity metadata |
| `posting_lag_days` | Posting latency | Raw posting latency in calendar days | Stale postings (>45 days) |
