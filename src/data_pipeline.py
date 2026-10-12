import numpy as np, pandas as pd
def make_data(n=24000, seed=5):
    """Synthetic aggregated reporting feed with injected breaks (labels known for evaluation)."""
    r=np.random.default_rng(seed)
    d=pd.DataFrame({"ref_id":np.arange(n),"source":r.choice(["ERP_A","ERP_B","SUBLEDGER","TREASURY","MANUAL"],n,p=[.3,.25,.25,.15,.05]),
        "account":r.integers(100,160,n),"entity":r.choice([f"E{i:02d}" for i in range(1,13)],n)})
    scale=pd.Series(r.lognormal(9,1.0,60),index=range(100,160)); d["amount"]=(d.account.map(scale)*r.lognormal(0,.35,n)*r.choice([1,-1],n,p=[.8,.2])).round(2)
    d["period_end"]=pd.Timestamp("2026-06-30"); d["posting_lag_days"]=np.clip(r.gamma(2,2.5,n),0,40).round(0)
    d["label"]="ok"; k=int(n*.03); rows=r.choice(n,k*4,replace=False)
    for name,idx in zip(["duplicate","sign_flip","magnitude_x10","stale_posting"],np.array_split(rows,4)):
        d.loc[idx,"label"]=name
    dup=d.label=="duplicate"; src=r.choice(d.index[d.label=="ok"],dup.sum(),replace=False)
    d.loc[dup,["ref_id","amount","account","entity"]]=d.loc[src,["ref_id","amount","account","entity"]].values
    s=d.label=="sign_flip"; d.loc[s,"amount"]*=-1
    m=d.label=="magnitude_x10"; d.loc[m,"amount"]*=10
    st=d.label=="stale_posting"; d.loc[st,"posting_lag_days"]=r.integers(46,120,st.sum())
    miss=r.choice(d.index[d.label=="ok"],int(n*.01),replace=False); d.loc[miss,"entity"]=None; d.loc[miss,"label"]="missing_entity"
    d["is_break"]=(d.label!="ok").astype(int); return d
