# Model Governance, SOX Internal Controls & Anomaly Triage Operating Framework: Project 4

## 1. Governance & Regulatory Framework
This operating model aligns with Sarbanes-Oxley (SOX) Section 404 Internal Controls over Financial Reporting (ICFR), COSO Data Quality Framework, and BCBS 239 Risk Data Aggregation standards.

---

## 2. Multi-Tier Operational Triage Workflow

```
[Raw Ingestion Feed] ---> [Tier 1: Hard Gate] ---> [Tier 2: Contra-Account Gate] ---> [Tier 3: Isolation Forest] ---> [GL Ledger Post]
                           - Duplicate Key Block    - Normal Debit/Credit Check       - Non-linear magnitude x10       - Clean Transactions
                           - Missing Entity Block   - Flag Sign Flips (Amber)        - Flag Outliers (Amber)
```

### Action Protocols by Exception Tier
| Tier Level | Detection Logic | Action Protocol | Responsible Role | SLA Cut-Off |
|---|---|---|---|---|
| **Tier 1 (Hard Block)** | Duplicate Key count $>0$ or `entity` is NULL | Immediate rejection back to source feed; zero ledger entry | Data Engineering / ETL Ops | Immediate ($<5$ min) |
| **Tier 2 (High Priority)** | Sign discordance (`sign_vs_acct` $= 1$) | Route to Accounting Controller queue with account history | Senior GL Accountant | 4 Hours (Before close) |
| **Tier 3 (Medium Priority)**| Isolation Forest anomaly score $< -0.15$ | Review transaction documentation for decimal error | Financial Analyst | 8 Hours |
| **Tier 4 (Low Priority)** | Posting lag $> 45$ days | Confirm retroactive cutoff authorization | Operations Manager | 24 Hours |

---

## 3. Feedback Loop & Ongoing Monitoring
1. **Analyst Resolution Logging**: Analysts mark reviewed items as `CONFIRMED_DEFECT` or `FALSE_ALARM`.
2. **Weekly Supervised Retraining**: Verified labels feed into an incremental Random Forest retraining pipeline.
3. **Monthly Drift Controls**: If the monthly feed break rate deviates by $>3.0$ percentage points from baseline or Isolation Forest false positive rate exceeds 5.0%, trigger an MRM audit.
