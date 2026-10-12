import os
import pandas as pd

def compute_business_case():
    """
    Computes rigorous corporate finance business case for Reporting Data-Quality Anomaly Detector:
    - 3 Scenarios: Conservative, Base, Upside
    - Avoided regulatory penalties & audit restatement fees
    - Avoided close-cycle firefighting and emergency transaction tracing
    - Automated accounting analyst triage labor savings
    - Implementation costs, annual maintenance, Year-1 Net Benefit, 3-Year NPV, Payback Period
    """
    os.makedirs("reports", exist_ok=True)
    
    scenarios = {
        "Conservative": {
            "avoided_restatement_penalties": 950000,
            "avoided_close_firefighting": 350000,
            "analyst_hours_saved": 950,
            "hourly_rate": 100,
            "implementation_cost": 270000,
            "annual_maintenance_cost": 65000
        },
        "Base": {
            "avoided_restatement_penalties": 1850000,
            "avoided_close_firefighting": 520000,
            "analyst_hours_saved": 1400,
            "hourly_rate": 100,
            "implementation_cost": 250000,
            "annual_maintenance_cost": 60000
        },
        "Upside": {
            "avoided_restatement_penalties": 3000000,
            "avoided_close_firefighting": 780000,
            "analyst_hours_saved": 1800,
            "hourly_rate": 100,
            "implementation_cost": 230000,
            "annual_maintenance_cost": 55000
        }
    }
    
    rows = []
    discount_rate = 0.10
    
    for name, s in scenarios.items():
        labor_benefit = s["analyst_hours_saved"] * s["hourly_rate"]
        total_annual_benefit = s["avoided_restatement_penalties"] + s["avoided_close_firefighting"] + labor_benefit
        capex = s["implementation_cost"]
        opex = s["annual_maintenance_cost"]
        
        net_yr1 = total_annual_benefit - capex - opex
        net_yr2 = total_annual_benefit - opex
        net_yr3 = total_annual_benefit - opex
        
        npv_3yr = -capex + (net_yr1 + capex)/(1 + discount_rate) + net_yr2/((1 + discount_rate)**2) + net_yr3/((1 + discount_rate)**3)
        payback_months = (capex / (total_annual_benefit - opex)) * 12
        roi_3yr = (npv_3yr / capex) * 100
        
        rows.append({
            "Scenario": name,
            "Avoided_Restatement_Penalties": f"${s['avoided_restatement_penalties']:,.0f}",
            "Avoided_Close_Firefighting": f"${s['avoided_close_firefighting']:,.0f}",
            "Analyst_Labor_Savings": f"${labor_benefit:,.0f}",
            "Total_Annual_Benefit": f"${total_annual_benefit:,.0f}",
            "Implementation_Cost": f"${capex:,.0f}",
            "Annual_Maintenance_Cost": f"${opex:,.0f}",
            "Year1_Net_Benefit": f"${net_yr1:,.0f}",
            "Payback_Period_Months": round(payback_months, 1),
            "Three_Year_NPV": f"${npv_3yr:,.0f}",
            "ROI_3Year_Pct": f"{round(roi_3yr, 0)}%"
        })
        
    df_bc = pd.DataFrame(rows)
    df_bc.to_csv("reports/business_case_table.csv", index=False)
    return df_bc.to_dict(orient="records")
