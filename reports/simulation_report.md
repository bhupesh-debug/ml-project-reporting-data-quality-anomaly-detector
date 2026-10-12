# Data Quality Stress Simulations & Capacity Planning Report: Project 4

## 1. Multi-Scenario Stress Testing Architecture
We conducted extensive scenario simulations across four operational dimensions:
1. **Prevalence Stress**: Assessing false positive stability across 3%, 13%, and 25% anomaly injection rates.
2. **Magnitude Error Sizing**: Measuring Isolation Forest sensitivity across x2, x5, x10, and x50 decimal displacements.
3. **Contamination Parameter Tuning**: Optimizing unsupervised score thresholding ($c \in [0.01, 0.10]$).
4. **Analyst Review Capacity Constraints**: Modeling queue clearance and escaped defects at 1,000, 2,000, 3,000, and 4,000 monthly reviews.
5. **5,000-Run Monte Carlo Simulation**: Modeling daily exception queue arrivals, triage cost, and peak SLA loading.

---

## 2. Magnitude Error Sizing Sensitivity

| Error Multiplier | Injected Test Volume | Isolation Forest Recall | Detection Probability |
|---|---|---|---|
| **x2.0 Error** | 720 rows | **18.2%** | Poor (blends into normal lognormal tails) |
| **x5.0 Error** | 720 rows | **54.6%** | Moderate |
| **x10.0 Error** | 720 rows | **88.2%** | High |
| **x50.0 Error** | 720 rows | **99.4%** | Near-Certainty |

*Finding*: Isolation Forest requires at least a 5x displacement to achieve >50% recall. For subtler errors (e.g. 15%-50% variance), deterministic budget tolerance checks must supplement the model.

---

## 3. Analyst Review Capacity Sizing ($35/Review Triage Cost)

| Monthly Review Capacity | Total Flagged Queue | Reviewed Volume | Unreviewed Backlog | Captured Breaks | Escaped Breaks in Backlog | Monthly Triage Cost |
|---|---|---|---|---|---|---|
| **1,000 Reviews** | 3,027 | 1,000 | 2,027 | 764 | **1,551 (67% Escaped)**| $35,000 |
| **2,000 Reviews** | 3,027 | 2,000 | 1,027 | 1,529 | **786 (34% Escaped)** | $70,000 |
| **3,000 Reviews** | 3,027 | 3,000 | 27 | 2,294 | **21 (<1% Escaped)** | $105,000 |
| **4,000 Reviews** | 3,027 | 3,027 | 0 | 2,315 | **0 (0% Escaped)** | $105,945 |

*Sizing Recommendation*: Staffing to **3,000 reviews/month** clears 99.1% of all flagged anomalies, capturing 2,294 defective rows while capping monthly triage expense at $105,000.

---

## 4. 5,000-Run Monte Carlo Queue Simulation

![Monte Carlo Exception Distribution](anomaly_detection_simulation.png)

- **Mean Daily Flagged Rows**: **101.7 rows/day**
- **Median Daily Load (P50)**: **100.0 rows/day**
- **5th Percentile Trough (P05)**: **69.0 rows/day**
- **95th Percentile Peak SLA Load (P95)**: **139.0 rows/day**
- **Mean Daily Triage Cost**: **$3,559.18**
- **P95 Peak Daily Triage Cost**: **$4,865.00**

*Operating Takeaway*: The exception management team must design automated routing workflows capable of handling up to **139 exceptions per day** during peak month-end settlement surges.
