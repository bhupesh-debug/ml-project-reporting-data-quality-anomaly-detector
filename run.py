import os
import json
import joblib
import numpy as np
import pandas as pd
from src.data_pipeline import make_data
from src.feature_engineering import build_features, FEATS
from src.model import rules, iforest, supervised
from src.evaluate import prf, recall_by_type, chart
from src.regression_analysis import run_regression_and_benchmarks
from src.simulation import run_anomaly_simulations
from src.business_case import compute_business_case
from slides.generate_deck import create_presentation

def main():
    os.makedirs("data/synthetic", exist_ok=True)
    os.makedirs("reports", exist_ok=True)
    os.makedirs("models", exist_ok=True)
    os.makedirs("slides", exist_ok=True)

    # 1. Data generation & feature engineering
    d = make_data()
    d.to_csv("data/synthetic/reporting_feed.csv", index=False)
    x = build_features(d)
    y = x.is_break.values

    # 2. Original Baseline Evaluation on Full Feed
    r = rules(x).values
    iso = iforest().fit(x[FEATS])
    i = (iso.predict(x[FEATS]) == -1).astype(int)
    comb = ((r == 1) | (i == 1)).astype(int)

    # Supervised holdout split (60/40)
    tr = x.sample(frac=0.6, random_state=5).index
    te = x.index.difference(tr)
    rf = supervised().fit(x.loc[tr, FEATS], y[tr])
    s = rf.predict(x.loc[te, FEATS])

    res = {
        "rows": len(x),
        "break_rate": round(float(y.mean()), 3),
        "rules": prf(y, r),
        "isolation_forest": prf(y, i),
        "rules_plus_isolation_forest": prf(y, comb),
        "supervised_rf_holdout": prf(y[te], s)
    }

    by = {
        "Rules": recall_by_type(x.label, r),
        "IsolationForest": recall_by_type(x.label, i),
        "Rules+IF": recall_by_type(x.label, comb)
    }
    res["recall_by_break_type"] = by
    chart(by, "reports/recall_by_break_type.png")
    joblib.dump(rf, "models/best_model.pkl")

    # 3. Econometric Regression & Enhanced Controls (Contra-Account Check)
    reg_benchmarks = run_regression_and_benchmarks(d)
    res["regression_and_enhanced_benchmarks"] = reg_benchmarks

    # 4. Stress Simulations & 5,000-Run Monte Carlo
    sim_res = run_anomaly_simulations(d, n_mc_runs=5000, seed=42)
    res["simulations"] = sim_res

    # 5. Financial Business Case
    bc_res = compute_business_case()
    res["business_case"] = bc_res

    # 6. Generate Executive Slide Deck
    create_presentation()

    # 7. Write Results JSON
    with open("reports/results.json", "w") as f_out:
        json.dump(res, f_out, indent=2)

    print("Project 4 pipeline executed successfully.")
    print("Results written to reports/results.json")

if __name__ == "__main__":
    main()
