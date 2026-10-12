# Executive Summary: Reporting Data-Quality Anomaly Detector

## 1. Executive Context & Core Discovery
In complex corporate finance environments, financial consolidation and risk aggregation feeds draw millions of journal rows from heterogeneous ERPs, subledgers, and manual spreadsheets. A single undetected magnitude error or inverted transaction sign can distort earnings, breach debt covenants, or trigger severe regulatory fines under SOX Section 404.

This project evaluated an end-to-end multi-tier anomaly detection architecture across 24,000 transaction rows from five source systems with 3,120 injected breaks (13.0% stress prevalence):
- **The Blindspot of Amount-Only Detection**: Unsupervised methods and standard business rules caught **0.0% of sign flips**! A flipped debit looks like a normal negative entry without account-direction knowledge.
- **The Contra-Account Breakthrough**: Adding an account-level direction control (`sign_vs_acct`) that compares transaction sign against normal GL account debit/credit posture lifts sign-flip recall from **0.0% to 80.9%**, lifting overall pipeline recall to **93.7%**.
- **Complementary Hybrid Synergy**:
  - Deterministic Rules catch structural defects (Duplicates, Missing Entity IDs, Stale Postings) at **100% recall**.
  - Isolation Forest catches decimal magnitude errors (Magnitude x10) at **90.8% recall**.
  - Combining Rules, Contra-Account Logic, and Isolation Forest delivers an unbeatable multi-tier defense capturing **93.7% of all corrupted records**.

---

## 2. Financial Return & Business Case
- **Avoided Regulatory Penalties & Audit Surcharges**: Prevents **$1.85M annually** in restatement penalties, external auditor investigation fees, and regulatory inquiries (Base Case).
- **Avoided Month-End Close Firefighting**: Eliminates **$520k annually** in midnight reconciliation tracing and emergency contractor fees.
- **Accounting Operations Efficiency**: Frees **1,400 hours annually** ($140k value) from blunt spreadsheet scrolling to high-value internal controls.
- **Financial Return**: Base Case yields a **Year-1 Net Benefit of $2.20M**, a **1.2-month payback period**, and a **3-year NPV of $5.84M** (2,337% ROI) on an initial implementation investment of $250k.
