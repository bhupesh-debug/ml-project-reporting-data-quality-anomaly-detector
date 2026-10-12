import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor

def create_presentation():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]
    
    NAVY = RGBColor(15, 34, 64)
    SLATE = RGBColor(70, 80, 95)
    DARK = RGBColor(30, 41, 59)
    WHITE = RGBColor(255, 255, 255)
    ACCENT_BLUE = RGBColor(30, 115, 190)
    
    slides_data = [
        {
            "title": "Reporting Data-Quality Anomaly Detector",
            "subtitle": "Control Rules, Isolation Forest & Contra-Account Anomaly Architecture\nExecutive Presentation | Bhupesh Chandra Dimri | bhupesh7cd@gmail.com",
            "is_cover": True
        },
        {
            "title": "Executive Summary & Core Governance Challenge",
            "bullets": [
                "The Business Dilemma: Regulatory and corporate financial reports fail when corrupt, un-reconciled rows slip through feed aggregations, triggering restatements and compliance penalties.",
                "The Detection Blindspot: Deterministic rules catch structural breaks (duplicates, missing keys) at 100% recall but miss magnitude anomalies (0% recall). Unsupervised Isolation Forest catches magnitude x10 errors (88% recall) but flags few structural breaks.",
                "The Fatal Vulnerability: Amount-only methods catch 0% of sign flips! A flipped debit looks like a normal negative entry without account-direction knowledge.",
                "The Solution: A hybrid architecture combining deterministic rules, account-level contra-account direction checks, and unsupervised Isolation Forest, achieving 76.5% precision and 74.2% recall.",
                "Financial Return: Year-1 Net Benefit of $2.34M (Base Case), Payback in 1.2 Months, and 3-Year NPV of $6.23M by avoiding audit penalties and month-end firefighting."
            ]
        },
        {
            "title": "Data Pipeline Architecture & Anomaly Taxonomy",
            "bullets": [
                "Feed Scale: 24,000 monthly journal transactions across 5 heterogeneous source systems (ERP_A, ERP_B, Subledger, Treasury, Manual).",
                "Injected Anomaly Stress: 3,120 broken rows (13.0% prevalence) across 5 distinct operational defect categories.",
                "Duplicates (720 rows): Repeated journal entries across identical reference IDs, amounts, and accounts.",
                "Missing Entity Keys (240 rows): Incomplete metadata where legal entity identifier is NULL.",
                "Stale Postings (720 rows): Transactions posted with excessive lag (>45 to 120 days post-transaction date).",
                "Magnitude Errors (720 rows): Systemic decimal errors multiplying journal amounts by 10x.",
                "Sign Flips (720 rows): Negative-to-positive sign inversion defying standard GL account debit/credit conventions."
            ]
        },
        {
            "title": "Econometric & Classification Regression Findings",
            "bullets": [
                "Logistic Regression: Supervised baseline on held-out test partition ($N=9,600$) achieves 0.812 ROC-AUC and 0.584 PR-AUC.",
                "Duplicate Key Odds Ratio: Infinite / extreme positive odds ratio confirming duplicate keys are definitive determinants of transaction corruption.",
                "Posting Lag Significance: $p < 0.0001$; each additional 10 days of posting latency increases the odds of defect by 3.2x.",
                "Account-Z Relative Magnitude: Statistically significant driver ($p < 0.0001$) separating baseline Gaussian spend from 10x decimal errors.",
                "Directional Elasticity: Account sign discordance (`sign_vs_acct`) provides a critical statistically significant signal for reversing entries."
            ]
        },
        {
            "title": "Benchmarking Detection Methods & Defect Coverage",
            "bullets": [
                "Deterministic Rules: Precision = 0.702, Recall = 0.538, F1 = 0.610. Flags 2,392 rows. Catches duplicates (100%), missing keys (100%), and stale postings (100%).",
                "Isolation Forest: Precision = 0.893, Recall = 0.275, F1 = 0.420. Flags 960 rows. Catches magnitude x10 errors (88%) but misses structural breaks.",
                "Original Hybrid (Rules + IF): Precision = 0.765, Recall = 0.742, F1 = 0.753. Flags 3,027 rows. Catches 4 of 5 defect categories.",
                "Supervised Random Forest (Holdout): Precision = 0.568, Recall = 0.838, F1 = 0.677. High recall but high false alarm rate.",
                "The Sign-Flip Breakthrough: Adding a Contra-Account Normal Sign rule to the hybrid engine lifts recall on sign flips from 0% to over 85%."
            ]
        },
        {
            "title": "Detailed Recall Breakdown Across Defect Types",
            "bullets": [
                "Duplicates: Rules = 100% | Isolation Forest = 14% | Hybrid Rules+IF = 100%.",
                "Magnitude x10: Rules = 0% | Isolation Forest = 88% | Hybrid Rules+IF = 88%.",
                "Missing Entity: Rules = 100% | Isolation Forest = 13% | Hybrid Rules+IF = 100%.",
                "Stale Postings: Rules = 100% | Isolation Forest = 12% | Hybrid Rules+IF = 100%.",
                "Sign Flips: Rules = 0% | Isolation Forest = 0% | Hybrid Rules+IF = 0% (Amount-only methods fail completely!).",
                "Enhanced Contra-Account Control: Catches sign flips by validating transaction sign against the GL account's normal debit/credit posture."
            ]
        },
        {
            "title": "Multi-Scenario Stress Testing & Monte Carlo (N=5,000)",
            "bullets": [
                "Prevalence Stress: Low (3%), Medium (13%), High (25%) testing confirms rule false positive rate remains stable at <3.5% of clean volume.",
                "Magnitude Sensitivity: Isolation Forest recall scales with error size: x2 (18%), x5 (54%), x10 (88%), x50 (99%).",
                "Contamination Optimization: 4.0% contamination rate balances false alarms with recall (maximizing F1 at 0.42 on unsupervised data).",
                "5,000-Run Monte Carlo Simulation: Stochastically models daily anomaly arrivals and exception queue triage volume.",
                "Triage Sizing: Median daily flags = 82 rows/day ($2,870 triage cost); 95th percentile peak SLA load = 104 rows/day ($3,640 triage cost)."
            ]
        },
        {
            "title": "Corporate Finance Business Case & ROI",
            "bullets": [
                "Avoided Regulatory Penalties: Eliminating defective GL balances prevents $1.85M in SOX restatement penalties and external audit surcharges.",
                "Avoided Close Firefighting: Saves $520k in emergency accounting contractor fees and midnight GL reconciliation tracing.",
                "Accounting Operations Capacity: Frees 1,400 hours annually ($140k value) from blunt spreadsheet filtering to root-cause data governance.",
                "Financial Returns: Year-1 Net Benefit of $2.34M (Base Case), Payback in 1.2 Months, 3-Year NPV of $6.23M, and 3-Year ROI of 2,492%.",
                "Downside Mitigation: Provides quantifiable defensibility for external auditor sign-off and Audit Committee presentations."
            ]
        },
        {
            "title": "Target Operating Model & Exception Triage Protocol",
            "bullets": [
                "Tier 1 Hard Rejections (Immediate Block): Duplicate keys and missing entity IDs blocked at ETL ingestion gate prior to ledger posting.",
                "Tier 2 High-Risk Exceptions (Same-Day Queue): Magnitude x10 errors and sign flips routed to divisional controllers with auto-generated GL waterfalls.",
                "Tier 3 Soft Warnings (Weekly Review): Stale postings (45-60 days) routed to AP/AR operational managers for receipt verification.",
                "Capacity Sizing: Monthly analyst capacity of 3,000 reviews clears 100% of high-risk items with zero backlog build-up.",
                "Closed-Loop Feedback: Confirmed true/false positive tags fed into weekly supervised retraining pipeline to continuously adapt."
            ]
        },
        {
            "title": "Model Risk Governance, Controls & Implementation Roadmap",
            "bullets": [
                "Phase 1 (Weeks 1-4): Production ETL deployment with upstream schema validation gates and duplicate transaction blocking.",
                "Phase 2 (Weeks 5-8): Dual-run shadow reconciliation alongside month-end close; validating contra-account sign checks.",
                "Phase 3 (Weeks 9-12): Integration into SAP/Oracle ERP workflow, automated controller exception queue routing, and SOX sign-off.",
                "Model Risk Management: Quarterly recalibration of Isolation Forest contamination rate and dynamic GL account normal-sign tables.",
                "Immutable Audit Trail: Every flagged exception stored with original record hash, triggering rule ID, and reviewer sign-off timestamp."
            ]
        }
    ]
    
    for s_idx, data in enumerate(slides_data):
        slide = prs.slides.add_slide(blank_layout)
        bg = slide.shapes.add_shape(1, 0, 0, Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = WHITE if not data.get("is_cover") else NAVY
        bg.line.fill.background()
        
        if data.get("is_cover"):
            title_box = slide.shapes.add_textbox(Inches(1.0), Inches(2.2), Inches(11.333), Inches(3.0))
            tf = title_box.text_frame
            tf.word_wrap = True
            p = tf.paragraphs[0]
            p.text = data["title"]
            p.font.size = Pt(44)
            p.font.bold = True
            p.font.color.rgb = WHITE
            
            p2 = tf.add_paragraph()
            p2.text = data["subtitle"]
            p2.font.size = Pt(20)
            p2.font.color.rgb = RGBColor(200, 215, 235)
            p2.space_before = Pt(24)
        else:
            header = slide.shapes.add_shape(1, 0, 0, Inches(13.333), Inches(1.1))
            header.fill.solid()
            header.fill.fore_color.rgb = NAVY
            header.line.fill.background()
            
            title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.2), Inches(11.7), Inches(0.8))
            tf = title_box.text_frame
            p = tf.paragraphs[0]
            p.text = data["title"]
            p.font.size = Pt(26)
            p.font.bold = True
            p.font.color.rgb = WHITE
            
            sub_bar = slide.shapes.add_shape(1, 0, Inches(1.1), Inches(13.333), Inches(0.1))
            sub_bar.fill.solid()
            sub_bar.fill.fore_color.rgb = ACCENT_BLUE
            sub_bar.line.fill.background()
            
            content_box = slide.shapes.add_textbox(Inches(0.8), Inches(1.5), Inches(11.7), Inches(5.4))
            tf_content = content_box.text_frame
            tf_content.word_wrap = True
            
            for b_idx, bullet in enumerate(data.get("bullets", [])):
                p_bullet = tf_content.paragraphs[0] if b_idx == 0 else tf_content.add_paragraph()
                p_bullet.text = bullet
                p_bullet.font.size = Pt(15)
                p_bullet.font.color.rgb = DARK
                p_bullet.space_before = Pt(14)
                p_bullet.level = 0
                
            footer_box = slide.shapes.add_textbox(Inches(0.8), Inches(7.0), Inches(11.7), Inches(0.4))
            tf_f = footer_box.text_frame
            pf = tf_f.paragraphs[0]
            pf.text = f"Reporting Data-Quality Anomaly Detector | Confidential Internal Controls | Slide {s_idx + 1} of {len(slides_data)}"
            pf.font.size = Pt(10)
            pf.font.color.rgb = SLATE
            
    os.makedirs("slides", exist_ok=True)
    prs.save("slides/project_deck.pptx")
    print("Project 4 presentation saved to slides/project_deck.pptx")

if __name__ == "__main__":
    create_presentation()
