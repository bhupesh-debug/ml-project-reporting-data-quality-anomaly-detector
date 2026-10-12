# Data Quality & Anomaly Profiling Report: Project 4

## 1. Feed Profiling & Schema Audit
The synthetic reporting feed (`data/synthetic/reporting_feed.csv`) was generated and verified through extensive data quality checks:

| Dimension | Verification Test | Result | Status |
|---|---|---|---|
| **Feed Volume** | Total transaction rows | Exactly 24,000 rows | PASS |
| **Injected Defect Rate** | Total broken transactions | 3,120 rows (13.0% prevalence) | PASS |
| **Source System Balance** | 5 source feeds | ERP_A (30%), ERP_B (25%), Subledger (25%), Treasury (15%), Manual (5%) | PASS |
| **Account Distribution** | Chart of accounts | 60 accounts (100 to 159) lognormal scale | PASS |
| **Posting Latency Range** | Gamma distributed lag | Mean 5.2 days, Max 120 days (stale postings) | PASS |

---

## 2. Injected Anomaly Breakdown
- **Duplicate Records**: 720 rows (3.0% of feed)
- **Magnitude x10 Errors**: 720 rows (3.0% of feed)
- **Sign Flips**: 720 rows (3.0% of feed)
- **Stale Postings (>45 days)**: 720 rows (3.0% of feed)
- **Missing Entity Keys**: 240 rows (1.0% of feed)
- **Total Injected Defects**: 3,120 rows (13.0%)
- **Clean Transactions**: 20,880 rows (87.0%)
