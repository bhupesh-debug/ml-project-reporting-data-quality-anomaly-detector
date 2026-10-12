import numpy as np, pandas as pd
FEATS=["log_abs_amount","acct_z","ratio_to_median","sign_vs_acct","posting_lag_days","dup_key_count","missing_entity"]
def build_features(d):
    x=d.copy(); a=x.groupby("account").amount
    med=a.transform(lambda s:s.abs().median()); mu=a.transform("mean"); sd=a.transform("std").replace(0,1)
    x["log_abs_amount"]=np.log1p(x.amount.abs()); x["acct_z"]=((x.amount-mu)/sd).abs(); x["ratio_to_median"]=x.amount.abs()/med
    x["sign_vs_acct"]=(np.sign(x.amount)!=np.sign(a.transform("median"))).astype(int)
    x["dup_key_count"]=x.groupby(["ref_id","amount","account"]).ref_id.transform("count")-1
    x["missing_entity"]=x.entity.isna().astype(int); return x
