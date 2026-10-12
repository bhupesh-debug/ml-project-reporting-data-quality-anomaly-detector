import pytest
import numpy as np
import pandas as pd
from src.data_pipeline import make_data
from src.feature_engineering import build_features, FEATS
from src.model import rules, iforest, supervised
from src.evaluate import prf, recall_by_type
from src.business_case import compute_business_case

def test_data_generation():
    df = make_data(n=2000, seed=42)
    assert len(df) == 2000
    assert "ref_id" in df.columns
    assert "amount" in df.columns
    assert "label" in df.columns
    assert "is_break" in df.columns
    assert df["is_break"].sum() > 0

def test_feature_engineering():
    df = make_data(n=1000, seed=42)
    x = build_features(df)
    for col in FEATS:
        assert col in x.columns
    assert x["dup_key_count"].min() >= 0
    assert "sign_vs_acct" in x.columns

def test_rules_and_metrics():
    df = make_data(n=1000, seed=42)
    x = build_features(df)
    r = rules(x).values
    res = prf(x.is_break.values, r)
    assert 0 <= res["precision"] <= 1
    assert 0 <= res["recall"] <= 1
    assert res["flagged"] > 0

def test_business_case_calculation():
    bc = compute_business_case()
    assert len(bc) == 3
    for row in bc:
        assert "Year1_Net_Benefit" in row
        assert "Three_Year_NPV" in row
