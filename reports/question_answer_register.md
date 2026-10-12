# Question-and-Answer Register: Reporting Data-Quality Anomaly Detector

## Overview
This register records every explicit business, statistical, and operational question formulated for Project 4, supported by empirical test metrics, simulation results, and verified calculations.

---

### Q-DQ-001: Which method catches the most anomalies?
- **Direct Answer**: The **Enhanced Rules + Isolation Forest** architecture catches the most anomalies, achieving an out-of-sample recall of **93.7%** (capturing 1,184 out of 1,264 corrupted rows on the test split). Among pure single models, Supervised Random Forest catches the most (84.1% recall), while original rules catch 54.6% and Isolation Forest catches 27.2%.
- **Supporting Analysis**: 40% held-out test split evaluation.
- **Status**: Answered with verified evidence.
- **Report Section**: `reports/model_report.md` Section 2.

---

### Q-DQ-002: Which method generates the fewest false alarms?
- **Direct Answer**: **Isolation Forest** generates the fewest false alarms in absolute terms (34 false positives out of 9,600 rows, achieving 91.0% precision). Supervised Logistic Regression also generates very few false positives (118 false positives, 87.1% precision).
- **Supporting Analysis**: Out-of-sample confusion matrix analysis.
- **Status**: Answered with verified evidence.
- **Report Section**: `reports/model_report.md` Section 2.

---

### Q-DQ-003: Which anomaly types are missed by rules?
- **Direct Answer**: Traditional business rules miss **100% of magnitude x10 decimal errors** and **100% of sign flips**. Rules only check structural properties (duplicate keys, null IDs, and posting latency), leaving numerical values unverified.
- **Supporting Analysis**: Type-specific recall analysis (`reports/results.json`).
- **Status**: Answered with verified evidence.
- **Report Section**: `reports/model_report.md` Section 3.

---

### Q-DQ-004: Which anomaly types are missed by Isolation Forest?
- **Direct Answer**: Isolation Forest misses **89.3% of duplicates**, **85.1% of missing entity IDs**, **88.9% of stale postings**, and **100% of sign flips**. Because it evaluates multivariate numerical density, it cannot detect structural metadata corruption.
- **Supporting Analysis**: Empirical recall-by-type breakdown.
- **Status**: Answered with verified evidence.
- **Report Section**: `reports/model_report.md` Section 3.

---

### Q-DQ-005: Does combining rules and machine learning improve performance?
- **Direct Answer**: Yes, decisively. Combining Rules and Isolation Forest lifts F1-score from 0.419 (IF alone) and 0.621 (Rules alone) to **0.768** on the test set, creating a comprehensive defense where rules catch structural breaks and ML catches numerical magnitude errors.
- **Supporting Analysis**: Hybrid test evaluation table.
- **Status**: Answered with verified evidence.
- **Report Section**: `reports/model_report.md` Section 2.

---

### Q-DQ-006: Why are sign flips difficult to identify using magnitude alone?
- **Direct Answer**: A sign flip in an aggregated GL feed produces a legitimate numerical amount (e.g., -$25,000 instead of +$25,000). Because financial ledgers routinely contain valid negative entries (credit balances, reversals, discounts), an amount-only model sees a perfectly ordinary distribution. Catching sign flips requires **contextual account knowledge**—specifically verifying whether the sign violates the GL account's normal debit/credit posture (`sign_vs_acct`).
- **Supporting Analysis**: Logistic regression odds ratio (4.44x for `sign_vs_acct`, $p < 0.0001$) and contra-account rule benchmark (lifting recall from 0% to 80.9%).
- **Status**: Answered with verified evidence.
- **Report Section**: `reports/regression_analysis.md` Section 3.

---

### Q-DQ-007: What review capacity is needed?
- **Direct Answer**: An analyst triage capacity of **3,000 reviews per month** (approximately 100-139 reviews per business day) is required. This capacity clears 99.1% of all flagged anomalies, capturing 2,294 defective rows while capping monthly review expenditure at $105,000.
- **Supporting Analysis**: Review capacity simulation and 5,000-run Monte Carlo queue model.
- **Status**: Answered with verified evidence.
- **Report Section**: `reports/simulation_report.md` Section 3 & 4.

---

### Q-DQ-008: Which controls should be implemented upstream?
- **Direct Answer**:
  1. Strict primary-key deduplication at ETL ingestion to block duplicate transaction reference IDs before staging.
  2. Database NOT NULL constraints on mandatory entity and legal entity foreign keys.
  3. Pre-posting posting date validation rejecting transactions with latency $>45$ days without managerial override.
  4. Account normal-sign validation blocking opposite-sign journal postings without a designated reversal transaction code.
- **Supporting Analysis**: Upstream architecture and SOX control matrix.
- **Status**: Answered with verified evidence.
- **Report Section**: `docs/governance_controls.md` Section 2.

---

### Q-DQ-009: What additional labels are needed for reliable supervised learning?
- **Direct Answer**:
  1. Production user-confirmed resolution feedback (distinguishing true business reversals from genuine posting errors).
  2. Transaction reversal pairing links (matching credit/debit adjustment pairs).
  3. Root-cause defect taxonomy tags from source ERP systems.
- **Supporting Analysis**: Data limitations review.
- **Status**: Answered with verified evidence.
- **Report Section**: `reports/limitations.md`.
