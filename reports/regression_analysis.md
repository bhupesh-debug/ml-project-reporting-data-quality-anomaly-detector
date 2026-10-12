# Econometric & Classification Regression Analysis: Reporting Data-Quality Anomaly Detector

## 1. Econometric Logit Specification
To quantify the statistical relationship between transaction features and the probability of data corruption, we estimated a Logistic Regression specification on the training set ($N=14,400$):

$$\text{logit}(P(\text{is\_break} = 1)) = \beta_0 + \beta_1 \text{log\_abs\_amount} + \beta_2 \text{acct\_z} + \beta_3 \text{ratio\_to\_median} + \beta_4 \text{sign\_vs\_acct} + \beta_5 \text{posting\_lag\_days} + \beta_6 \text{dup\_key\_count} + \beta_7 \text{missing\_entity}$$

---

## 2. Parameter Estimates, Odds Ratios & Statistical Inference

| Variable | Coef | Odds Ratio | Std. Error | z-Statistic | p-Value | 95% Confidence Interval | VIF |
|---|---|---|---|---|---|---|---|
| **Intercept** | -4.8209 | 0.0081 | 0.3358 | -14.36 | $< 0.0001$ | [-5.4790, -4.1628] | N/A |
| **`log_abs_amount`** | -0.0910 | 0.9130 | 0.0368 | -2.47 | 0.0134 | [-0.1632, -0.0189] | 1.18 |
| **`acct_z`** | +0.4808 | 1.6174 | 0.2807 | +1.71 | 0.0867 | [-0.0693, +1.0310] | 28.47 |
| **`ratio_to_median`**| +0.8525 | 2.3456 | 0.1431 | +5.96 | $< 0.0001$ | [+0.5721, +1.1330] | 25.66 |
| **`sign_vs_acct`** | **+1.4898** | **4.4362** | 0.2214 | +6.73 | $< 0.0001$ | [+1.0558, +1.9238] | 4.30 |
| **`posting_lag_days`**| **+0.1121**| **1.1187** | 0.0045 | +24.91 | $< 0.0001$ | [+0.1033, +0.1210] | 1.00 |
| **`dup_key_count`** | **+3.7372** | **41.9798**| 0.0985 | +37.95 | $< 0.0001$ | [+3.5442, +3.9302] | 1.01 |
| **`missing_entity`** | **+6.9933** | **1,089.31**| 0.3978 | +17.58 | $< 0.0001$ | [+6.2136, +7.7730] | 1.00 |

---

## 3. Financial Interpretation of Findings
1. **The Extreme Odds of Structural Breaches**:
   - `missing_entity` increases the odds of corruption by over **1,089x** ($p < 0.0001$).
   - `dup_key_count` increases the odds of defect by **42x** ($p < 0.0001$).
2. **Posting Latency Friction**: Each additional 10 days of posting lag compounds corruption risk by $(1.1187)^{10} \approx 3.07\text{x}$ ($p < 0.0001$), confirming that stale transactions are operational red flags.
3. **The Statistical Power of Account Discordance**: `sign_vs_acct` yields an Odds Ratio of **4.44x** ($p < 0.0001$), proving mathematically that comparing transaction sign to account normal balance provides strong empirical separation.
