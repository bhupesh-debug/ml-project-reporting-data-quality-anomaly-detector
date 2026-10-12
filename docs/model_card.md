# Model Card: Multi-Tier Reporting Data-Quality Anomaly Detector

## 1. Model Details
- **Model Name**: Hybrid Control-Rule & Isolation Forest Anomaly Engine with Contra-Account Logic
- **Architecture**:
  - Deterministic Control Layer: Key duplication check, null foreign-key validator, posting latency rule (>45 days).
  - Contra-Account Direction Layer: GL normal debit/credit posture discordance validator (`sign_vs_acct`).
  - Unsupervised Density Estimator: `IsolationForest(n_estimators=250, contamination=0.04, random_state=5)`.
  - Supervised Holdout Baseline: `RandomForestClassifier(n_estimators=250, max_depth=8, class_weight="balanced")` & `LogisticRegression(class_weight="balanced")`.
- **Developer / Maintainer**: Bhupesh Chandra Dimri (`bhupesh7cd@gmail.com`).

---

## 2. Intended Domain & Use Cases
- **Intended Domain**: Automated financial reporting data ingestion gates, monthly GL balance consolidation, regulatory risk feed pre-flight validation.
- **Decision Context**: Automatically partitioning incoming feed rows into:
  - Green (Auto-post to GL).
  - Amber (Route to prioritized analyst triage queue).
  - Red (Immediate ingestion block for duplicate keys & missing mandatory metadata).
- **Out of Scope**: Real-time high-frequency credit card consumer fraud, insider trading surveillance.

---

## 3. Evaluation & Defect Coverage Summary
Evaluated on a 40% held-out test partition ($N=9,600$):
- **Original Rules**: Precision = 0.720, Recall = 0.546, F1 = 0.621 (Misses 100% of magnitude and sign flips).
- **Isolation Forest**: Precision = 0.910, Recall = 0.272, F1 = 0.419 (Catches 90.8% of magnitude x10, misses structural breaks and sign flips).
- **Original Hybrid (Rules + IF)**: Precision = 0.780, Recall = 0.756, F1 = 0.768 (Misses sign flips at 0% recall).
- **Enhanced Rules (Contra-Account)**: Lifts sign flip recall from 0.0% to **80.9%**.
- **Enhanced Hybrid (Rules + Contra + IF)**: Precision = 0.387, **Recall = 0.937 (93.7% overall defect capture)**.
- **Supervised RF (Holdout)**: Precision = 0.565, Recall = 0.841, F1 = 0.676 (ROC-AUC 0.945, PR-AUC 0.841).
