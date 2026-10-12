# Limitations & Risk Register: Reporting Data-Quality Anomaly Detector

## 1. High Evaluation Anomaly Prevalence Disclaimer
- **Injected Prevalence (13.0%)**: In real-world enterprise production General Ledgers, transaction anomaly rates are typically between 0.05% and 0.5% (5 to 50 defects per 10,000 transactions).
- **Limitation**: The 13.0% synthetic prevalence was deliberately chosen to ensure statistical stability during model evaluation. In real deployments with low prevalence, precision will naturally compress due to the base-rate fallacy unless upstream hard rejection gates are strictly maintained.

---

## 2. Supervised Label Availability Risk
- **Unlabeled Feed Reality**: Production reporting environments rarely possess comprehensive ground-truth anomaly labels.
- **Limitation**: Supervised Random Forest results represent an idealized ceiling. Real deployments must rely on unsupervised Isolation Forest and deterministic business rules, gradually building a labeled training corpus through analyst triage feedback.

---

## 3. Account Normal Balance Mapping Dependency
- **Contra-Account Context**: Detecting sign flips relies on accurate mapping of normal account debit/credit conventions. If a new GL account is created without proper sign metadata, the system may generate false alarms on legitimate contra-entries.
