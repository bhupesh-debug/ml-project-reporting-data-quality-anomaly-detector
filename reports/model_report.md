# Model Evaluation & Benchmark Report: Reporting Data-Quality Anomaly Detector

## 1. Evaluation Methodology & Holdout Split
The dataset consists of 24,000 transaction rows with 3,120 injected anomalies (13.0% break rate). Supervised models were evaluated strictly on a 40% held-out test partition ($N=9,600$), with parameters fitted on the 60% training partition ($N=14,400$).

---

## 2. Comprehensive Test Benchmark Table ($N=9,600$)

| Method Architecture | Precision | Recall | F1-Score | Flagged Rows | False Positives | False Negatives | ROC-AUC | PR-AUC |
|---|---|---|---|---|---|---|---|---|
| **Original Rules** | 0.720 | 0.546 | 0.621 | 960 | 269 | 574 | N/A | N/A |
| **Isolation Forest** | 0.910 | 0.272 | 0.419 | 378 | 34 | 921 | 0.940 | 0.791 |
| **Original Rules + IF** | **0.780** | **0.756** | **0.768** | **1,226** | **270** | **309** | N/A | N/A |
| **Enhanced Rules (Contra)**| 0.342 | 0.772 | 0.474 | 2,856 | 1,880 | 289 | N/A | N/A |
| **Enhanced Rules + IF** | **0.387** | **0.937** | **0.547** | **3,065** | **1,880** | **80** | N/A | N/A |
| **Supervised Logistic Reg**| 0.871 | 0.628 | 0.730 | 913 | 118 | 470 | 0.948 | 0.845 |
| **Supervised Random Forest**| 0.565 | 0.841 | 0.676 | 1,882 | 818 | 201 | 0.945 | 0.841 |

---

## 3. Recall Performance by Defect Type

| Defect Category | Test Injected Count | Original Rules | Isolation Forest | Rules + IF | Enhanced Rules (Contra) | Enhanced Rules + IF | Supervised RF |
|---|---|---|---|---|---|---|---|
| **Duplicate** | 289 | **100.0%** | 10.7% | **100.0%** | **100.0%** | **100.0%** | 99.3% |
| **Magnitude x10** | 294 | 0.0% | **90.8%** | **90.8%** | 19.5% | **91.1%** | **100.0%** |
| **Missing Entity** | 94 | **100.0%** | 14.9% | **100.0%** | **100.0%** | **100.0%** | **100.0%** |
| **Sign Flip** | 293 | **0.0%** | **0.0%** | **0.0%** | **80.9%** | **80.9%** | 29.4% |
| **Stale Posting** | 294 | **100.0%** | 11.1% | **100.0%** | **100.0%** | **100.0%** | **100.0%** |

### Critical Takeaway on Detection Complementarity
- Rules alone miss all magnitude errors and sign flips (45.4% false negative rate).
- Isolation Forest alone misses duplicates, missing keys, stale postings, and sign flips (72.8% false negative rate).
- **The Enhanced Rules + IF architecture captures 93.7% of all anomalies**, missing only 80 out of 1,264 corrupted transactions!
