from sklearn.ensemble import IsolationForest, RandomForestClassifier
def rules(x):  # control-style checks: duplicates, missing keys, stale postings
    return ((x.dup_key_count>0)|(x.missing_entity==1)|(x.posting_lag_days>45)).astype(int)
def iforest(): return IsolationForest(n_estimators=250,contamination=0.04,random_state=5)
def supervised(): return RandomForestClassifier(n_estimators=250,max_depth=8,class_weight="balanced",random_state=5,n_jobs=-1)
