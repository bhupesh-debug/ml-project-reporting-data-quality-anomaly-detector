// Master Interactive Dashboard & Simulation Engine
// Author: Bhupesh Chandra Dimri (bhupesh7cd@gmail.com)

document.addEventListener("DOMContentLoaded", () => {
  initTabs();
  initQA();
  initProjectSimulators();
});

// 1. Tab Navigation Utility
function initTabs() {
  document.querySelectorAll(".tabs-nav").forEach(nav => {
    nav.querySelectorAll(".tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const targetId = btn.getAttribute("data-target");
        const container = nav.parentElement;
        
        nav.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
        container.querySelectorAll(".tab-pane").forEach(p => p.classList.remove("active"));
        
        btn.classList.add("active");
        const targetPane = container.querySelector(`#${targetId}`);
        if (targetPane) targetPane.classList.add("active");
      });
    });
  });
}

// 2. Collapsible Q&A Accordion
function initQA() {
  document.querySelectorAll(".qa-header").forEach(header => {
    header.addEventListener("click", () => {
      const item = header.parentElement;
      item.classList.toggle("open");
    });
  });
}

// 3. Project Simulator Initializers
function initProjectSimulators() {
  if (document.getElementById("sim-budget-form")) initBudgetOverrunSim();
  if (document.getElementById("sim-fpa-form")) initFPASim();
  if (document.getElementById("sim-liquidity-form")) initLiquiditySim();
  if (document.getElementById("sim-data-quality-form")) initDataQualitySim();
}

// ==========================================
// SIMULATOR 1: Budget Overrun Early Warning
// ==========================================
function initBudgetOverrunSim() {
  const inputs = ["p1-units", "p1-capacity", "p1-threshold", "p1-effectiveness", "p1-cost-intervention", "p1-cost-overrun", "p1-cost-fp"];
  inputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("input", runBudgetSim);
  });
  const dlBtn = document.getElementById("btn-p1-download");
  if (dlBtn) dlBtn.addEventListener("click", exportBudgetSimCSV);
  runBudgetSim();
}

function runBudgetSim() {
  const units = parseInt(document.getElementById("p1-units").value) || 3200;
  const capacityPct = parseFloat(document.getElementById("p1-capacity").value) || 20;
  const threshold = parseFloat(document.getElementById("p1-threshold").value) || 0.42;
  const effectiveness = parseFloat(document.getElementById("p1-effectiveness").value) || 60;
  const costIntervention = parseFloat(document.getElementById("p1-cost-intervention").value) || 4500;
  const avgOverrunCost = parseFloat(document.getElementById("p1-cost-overrun").value) || 52000;
  const costFP = parseFloat(document.getElementById("p1-cost-fp").value) || 650;

  document.getElementById("val-p1-units").textContent = units.toLocaleString();
  document.getElementById("val-p1-capacity").textContent = capacityPct + "%";
  document.getElementById("val-p1-threshold").textContent = threshold.toFixed(2);
  document.getElementById("val-p1-effectiveness").textContent = effectiveness + "%";

  // Modeled calculations based on verified logistic model distribution (25% prevalence)
  const totalOverruns = Math.round(units * 0.25);
  const maxReviews = Math.round(units * (capacityPct / 100));
  
  // Power curve model based on verified ROC-AUC 0.906
  // At 20% capacity, recall is 62.1%. At 30%, recall is 78.5%. At 10%, recall is 38.2%
  const recallFactor = Math.min(1.0, Math.pow(capacityPct / 100, 0.65) * 1.76);
  const detectedOverruns = Math.round(totalOverruns * recallFactor * (threshold <= 0.45 ? 1.0 : (0.9 - (threshold - 0.45) * 1.5)));
  const reviewedUnits = Math.min(maxReviews, Math.round(detectedOverruns / 0.62));
  const truePositives = Math.min(reviewedUnits, detectedOverruns);
  const falsePositives = Math.max(0, reviewedUnits - truePositives);
  const missedOverruns = totalOverruns - truePositives;
  
  const precision = reviewedUnits > 0 ? (truePositives / reviewedUnits) * 100 : 0;
  const recall = (truePositives / totalOverruns) * 100;
  
  const grossExposure = totalOverruns * avgOverrunCost;
  const mitigatedExposure = truePositives * avgOverrunCost * (effectiveness / 100);
  const interventionExpense = (truePositives * costIntervention) + (falsePositives * costFP);
  const netBenefit = mitigatedExposure - interventionExpense;

  document.getElementById("res-p1-flagged").textContent = reviewedUnits.toLocaleString();
  document.getElementById("res-p1-tp").textContent = truePositives.toLocaleString();
  document.getElementById("res-p1-fp").textContent = falsePositives.toLocaleString();
  document.getElementById("res-p1-recall").textContent = recall.toFixed(1) + "%";
  document.getElementById("res-p1-precision").textContent = precision.toFixed(1) + "%";
  document.getElementById("res-p1-avoided").textContent = "$" + (mitigatedExposure / 1e6).toFixed(2) + "M";
  document.getElementById("res-p1-net").textContent = "$" + (netBenefit / 1e6).toFixed(2) + "M";

  renderSVGBarChart("p1-chart-container", [
    { label: "Detected Overruns", value: truePositives, color: "#38BDF8" },
    { label: "False Alarms", value: falsePositives, color: "#F59E0B" },
    { label: "Missed Overruns", value: missedOverruns, color: "#F43F5E" }
  ]);
}

// ==========================================
// SIMULATOR 2: FP&A Rolling Forecast Engine
// ==========================================
function initFPASim() {
  const inputs = ["p2-horizon", "p2-hc-shock", "p2-mkt-shock", "p2-price-shock", "p2-blend-weight"];
  inputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("input", runFPASim);
  });
  const dlBtn = document.getElementById("btn-p2-download");
  if (dlBtn) dlBtn.addEventListener("click", exportFPASimCSV);
  runFPASim();
}

function runFPASim() {
  const horizon = parseInt(document.getElementById("p2-horizon").value) || 1;
  const hcShock = parseFloat(document.getElementById("p2-hc-shock").value) || 0;
  const mktShock = parseFloat(document.getElementById("p2-mkt-shock").value) || 0;
  const priceShock = parseFloat(document.getElementById("p2-price-shock").value) || 0;
  const blendWeight = parseFloat(document.getElementById("p2-blend-weight").value) || 80;

  document.getElementById("val-p2-hc").textContent = (hcShock > 0 ? "+" : "") + hcShock + "%";
  document.getElementById("val-p2-mkt").textContent = (mktShock > 0 ? "+" : "") + mktShock + "%";
  document.getElementById("val-p2-price").textContent = (priceShock > 0 ? "+" : "") + priceShock + "%";
  document.getElementById("val-p2-blend").textContent = blendWeight + "% ML / " + (100 - blendWeight) + "% Seasonal";

  // Base portfolio monthly revenue across 8 BUs: $247.62M
  const baseRevenue = 247.62;
  const seasonalBaseline = 221.80; // Negative biased baseline
  
  // Model driver elasticities from OLS and GBM regressions
  const hcDelta = (hcShock / 100) * 8.4;
  const mktDelta = (mktShock / 100) * 3.8;
  const priceDelta = (priceShock / 100) * 12.5;
  const driverAdjustedML = baseRevenue + hcDelta + mktDelta + priceDelta;
  
  const wGBM = blendWeight / 100;
  const finalForecast = (wGBM * driverAdjustedML) + ((1 - wGBM) * seasonalBaseline);
  
  // WAPE calculation curve based on horizon
  let expWape = 0.061;
  if (horizon === 2) expWape = 0.078;
  if (horizon === 3) expWape = (blendWeight === 40 ? 0.089 : (blendWeight > 60 ? 0.117 : 0.105));
  
  const downsideP05 = finalForecast * 0.977;
  const upsideP95 = finalForecast * 1.022;

  document.getElementById("res-p2-forecast").textContent = "$" + finalForecast.toFixed(2) + "M";
  document.getElementById("res-p2-baseline").textContent = "$" + seasonalBaseline.toFixed(2) + "M";
  document.getElementById("res-p2-wape").textContent = expWape.toFixed(3);
  document.getElementById("res-p2-p05").textContent = "$" + downsideP05.toFixed(2) + "M";
  document.getElementById("res-p2-p95").textContent = "$" + upsideP95.toFixed(2) + "M";

  renderSVGLineComparison("p2-chart-container", [
    { name: "Seasonal Baseline", value: seasonalBaseline, color: "#94A3B8" },
    { name: "P05 Downside Floor", value: downsideP05, color: "#F43F5E" },
    { name: "Final Hybrid Forecast", value: finalForecast, color: "#38BDF8" },
    { name: "P95 Upside Potential", value: upsideP95, color: "#10B981" }
  ]);
}

// ==========================================
// SIMULATOR 3: Liquidity Stress Forecaster
// ==========================================
function initLiquiditySim() {
  const inputs = ["p3-buffer", "p3-scenario", "p3-stress-mult", "p3-duration"];
  inputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("input", runLiquiditySim);
  });
  const dlBtn = document.getElementById("btn-p3-download");
  if (dlBtn) dlBtn.addEventListener("click", exportLiquiditySimCSV);
  runLiquiditySim();
}

function runLiquiditySim() {
  const buffer = parseFloat(document.getElementById("p3-buffer").value) || 2886.2;
  const scenario = document.getElementById("p3-scenario").value;
  const stressMult = parseFloat(document.getElementById("p3-stress-mult").value) || 1.25;
  const duration = parseInt(document.getElementById("p3-duration").value) || 10;

  document.getElementById("val-p3-buffer").textContent = buffer.toLocaleString() + " units";
  document.getElementById("val-p3-mult").textContent = stressMult.toFixed(2) + "x";
  document.getElementById("val-p3-duration").textContent = duration + " days";

  // Simulate 30-day forward outflow trajectory
  // Base daily outflow mean ~98.4 with weekday and month-end seasonality
  const horizon = 30;
  let cumOutflow = 0;
  let survivalDays = 31;
  let minCoverage = 999;
  
  const dailyPath = [];
  const bufferRemaining = [];
  
  for (let d = 1; d <= horizon; d++) {
    let dayRate = 98.4;
    // Weekday effect (lower on weekends)
    if (d % 7 === 6 || d % 7 === 0) dayRate *= 0.35;
    else dayRate *= 1.12;
    // Month-end surge
    if (d >= 28 && d <= 30) dayRate += 31.9;
    
    // Apply stress
    if (d <= duration) {
      if (scenario === "severe") dayRate = dayRate * 1.25 * stressMult;
      else if (scenario === "mild") dayRate *= stressMult;
    }
    
    cumOutflow += dayRate;
    const rem = buffer - cumOutflow;
    dailyPath.push(dayRate);
    bufferRemaining.push(rem);
    
    if (rem < 0 && survivalDays > horizon) {
      survivalDays = d;
    }
  }
  
  const coverageRatio = buffer / cumOutflow;
  const breached = cumOutflow > buffer;

  document.getElementById("res-p3-cum").textContent = cumOutflow.toFixed(1);
  document.getElementById("res-p3-cov").textContent = coverageRatio.toFixed(2);
  document.getElementById("res-p3-surv").textContent = survivalDays <= 30 ? survivalDays + " Days" : "30+ Days (Full)";
  document.getElementById("res-p3-status").textContent = breached ? "BREACHED" : "SURVIVED";
  document.getElementById("res-p3-status").className = breached ? "val text-danger" : "val text-success";
  
  renderSVGLiquidityCurve("p3-chart-container", bufferRemaining, buffer);
}

// ==========================================
// SIMULATOR 4: Reporting Data Quality
// ==========================================
function initDataQualitySim() {
  const inputs = ["p4-volume", "p4-prevalence", "p4-capacity", "p4-contra", "p4-cost-review"];
  inputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("input", runDataQualitySim);
  });
  const dlBtn = document.getElementById("btn-p4-download");
  if (dlBtn) dlBtn.addEventListener("click", exportDataQualitySimCSV);
  runDataQualitySim();
}

function runDataQualitySim() {
  const volume = parseInt(document.getElementById("p4-volume").value) || 24000;
  const prevalence = parseFloat(document.getElementById("p4-prevalence").value) || 13;
  const capacity = parseInt(document.getElementById("p4-capacity").value) || 3000;
  const useContra = document.getElementById("p4-contra").checked;
  const costPerReview = parseFloat(document.getElementById("p4-cost-review").value) || 35;

  document.getElementById("val-p4-vol").textContent = volume.toLocaleString() + " rows";
  document.getElementById("val-p4-prev").textContent = prevalence + "%";
  document.getElementById("val-p4-cap").textContent = capacity.toLocaleString() + " reviews";

  const totalBreaks = Math.round(volume * (prevalence / 100));
  // Modeled recall: without contra, overall recall is ~74% (sign flips at 0%). With contra, recall is 93.7%
  const recallRate = useContra ? 0.937 : 0.742;
  const signFlipRecall = useContra ? 80.9 : 0.0;
  
  const expectedFlagged = Math.round(totalBreaks * 0.98); // Includes false positives
  const reviewed = Math.min(capacity, expectedFlagged);
  const unreviewedBacklog = Math.max(0, expectedFlagged - capacity);
  const capturedBreaks = Math.round(totalBreaks * recallRate * (reviewed / expectedFlagged));
  const escapedBreaks = totalBreaks - capturedBreaks;
  const triageExpense = reviewed * costPerReview;

  document.getElementById("res-p4-flagged").textContent = expectedFlagged.toLocaleString();
  document.getElementById("res-p4-captured").textContent = capturedBreaks.toLocaleString();
  document.getElementById("res-p4-escaped").textContent = escapedBreaks.toLocaleString();
  document.getElementById("res-p4-sign-recall").textContent = signFlipRecall.toFixed(1) + "%";
  document.getElementById("res-p4-cost").textContent = "$" + triageExpense.toLocaleString();

  renderSVGBarChart("p4-chart-container", [
    { label: "Captured Defects", value: capturedBreaks, color: "#10B981" },
    { label: "Escaped Defects", value: escapedBreaks, color: "#F43F5E" },
    { label: "Unreviewed Backlog", value: unreviewedBacklog, color: "#F59E0B" }
  ]);
}

// ==========================================
// Lightweight Native SVG Chart Renderers
// ==========================================
function renderSVGBarChart(containerId, data) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const maxVal = Math.max(...data.map(d => d.value), 1);
  const width = container.clientWidth || 400;
  const height = 220;
  const barWidth = Math.min(60, (width - 80) / data.length - 20);
  
  let barsHTML = "";
  data.forEach((d, i) => {
    const barHeight = (d.value / maxVal) * 140;
    const x = 50 + i * (barWidth + 30);
    const y = 170 - barHeight;
    barsHTML += `
      <rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" fill="${d.color}" rx="4" />
      <text x="${x + barWidth/2}" y="${y - 8}" text-anchor="middle" fill="#F8FAFC" font-size="12" font-weight="700">${d.value.toLocaleString()}</text>
      <text x="${x + barWidth/2}" y="190" text-anchor="middle" fill="#94A3B8" font-size="10">${d.label}</text>
    `;
  });

  container.innerHTML = `
    <svg width="100%" height="${height}" viewBox="0 0 ${width} ${height}">
      <line x1="30" y1="170" x2="${width - 20}" y2="170" stroke="rgba(255,255,255,0.1)" stroke-width="1" />
      ${barsHTML}
    </svg>
  `;
}

function renderSVGLineComparison(containerId, items) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const width = container.clientWidth || 400;
  const height = 220;
  
  let html = `<div style="display:flex; flex-direction:column; gap:0.75rem; width:100%; padding:1rem;">`;
  const maxVal = Math.max(...items.map(it => it.value));
  items.forEach(it => {
    const pct = Math.min(100, Math.max(10, (it.value / maxVal) * 100));
    html += `
      <div>
        <div style="display:flex; justify-content:space-between; font-size:0.8rem; margin-bottom:0.25rem;">
          <span style="color:#94A3B8">${it.name}</span>
          <span style="color:${it.color}; font-weight:700;">$${it.value.toFixed(2)}M</span>
        </div>
        <div style="background:rgba(255,255,255,0.06); height:10px; border-radius:5px; overflow:hidden;">
          <div style="width:${pct}%; height:100%; background:${it.color}; border-radius:5px;"></div>
        </div>
      </div>
    `;
  });
  html += `</div>`;
  container.innerHTML = html;
}

function renderSVGLiquidityCurve(containerId, bufferRemaining, initialBuffer) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const width = container.clientWidth || 400;
  const height = 220;
  const pts = bufferRemaining.length;
  
  const minVal = Math.min(...bufferRemaining, 0);
  const maxVal = Math.max(initialBuffer, ...bufferRemaining);
  const range = maxVal - minVal || 1;
  
  let pathD = `M 40,${180 - ((bufferRemaining[0] - minVal) / range) * 150}`;
  bufferRemaining.forEach((val, idx) => {
    const x = 40 + (idx / (pts - 1)) * (width - 70);
    const y = 180 - ((val - minVal) / range) * 150;
    pathD += ` L ${x},${y}`;
  });
  
  const zeroY = 180 - ((0 - minVal) / range) * 150;

  container.innerHTML = `
    <svg width="100%" height="${height}" viewBox="0 0 ${width} ${height}">
      <line x1="30" y1="${zeroY}" x2="${width - 20}" y2="${zeroY}" stroke="#DC2626" stroke-width="1.5" stroke-dasharray="4,4" />
      <text x="${width - 15}" y="${zeroY - 4}" text-anchor="end" fill="#DC2626" font-size="10">Buffer Breach (0)</text>
      <path d="${pathD}" fill="none" stroke="#38BDF8" stroke-width="2.5" />
      <text x="40" y="25" fill="#94A3B8" font-size="11">Day 1: ${bufferRemaining[0].toFixed(0)} units</text>
      <text x="${width - 30}" y="25" text-anchor="end" fill="#38BDF8" font-size="11">Day 30: ${bufferRemaining[pts-1].toFixed(0)} units</text>
    </svg>
  `;
}

// ==========================================
// Dynamic CSV Export Utilities
// ==========================================
function triggerCSVDownload(filename, csvText) {
  const blob = new Blob([csvText], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function exportBudgetSimCSV() {
  const units = document.getElementById("p1-units").value;
  const cap = document.getElementById("p1-capacity").value;
  const th = document.getElementById("p1-threshold").value;
  const eff = document.getElementById("p1-effectiveness").value;
  const flagged = document.getElementById("res-p1-flagged").textContent;
  const tp = document.getElementById("res-p1-tp").textContent;
  const fp = document.getElementById("res-p1-fp").textContent;
  const recall = document.getElementById("res-p1-recall").textContent;
  const prec = document.getElementById("res-p1-precision").textContent;
  const avoided = document.getElementById("res-p1-avoided").textContent;
  const net = document.getElementById("res-p1-net").textContent;

  const csv = "Metric,Value\n" +
    `Units Monitored,${units}\n` +
    `Review Capacity Pct,${cap}%\n` +
    `Probability Threshold,${th}\n` +
    `Intervention Effectiveness,${eff}%\n` +
    `Lines Flagged & Reviewed,${flagged}\n` +
    `True Overruns Caught,${tp}\n` +
    `False Alarms,${fp}\n` +
    `Capture Rate (Recall),${recall}\n` +
    `Review Precision,${prec}\n` +
    `Mitigated Overrun Loss,${avoided}\n` +
    `Net Realized Benefit,${net}\n`;

  triggerCSVDownload("budget_overrun_simulation_export.csv", csv);
}

function exportFPASimCSV() {
  const hor = document.getElementById("p2-horizon").value;
  const hc = document.getElementById("p2-hc-shock").value;
  const mkt = document.getElementById("p2-mkt-shock").value;
  const pr = document.getElementById("p2-price-shock").value;
  const blend = document.getElementById("p2-blend-weight").value;
  const fcast = document.getElementById("res-p2-forecast").textContent;
  const base = document.getElementById("res-p2-baseline").textContent;
  const wape = document.getElementById("res-p2-wape").textContent;
  const p05 = document.getElementById("res-p2-p05").textContent;
  const p95 = document.getElementById("res-p2-p95").textContent;

  const csv = "Parameter,Value\n" +
    `Forecast Horizon (Months),${hor}\n` +
    `Sales Headcount Shock Pct,${hc}%\n` +
    `Marketing Spend Shock Pct,${mkt}%\n` +
    `Price Index Shock Pct,${pr}%\n` +
    `ML Blending Weight Pct,${blend}%\n` +
    `Adjusted Monthly Forecast,${fcast}\n` +
    `Seasonal Naive Baseline,${base}\n` +
    `Expected Horizon WAPE,${wape}\n` +
    `P05 Downside Floor,${p05}\n` +
    `P95 Upside Potential,${p95}\n`;

  triggerCSVDownload("fpa_rolling_forecast_simulation_export.csv", csv);
}

function exportLiquiditySimCSV() {
  const buffer = parseFloat(document.getElementById("p3-buffer").value) || 2886.2;
  const scenario = document.getElementById("p3-scenario").value;
  const stressMult = parseFloat(document.getElementById("p3-stress-mult").value) || 1.25;
  const duration = parseInt(document.getElementById("p3-duration").value) || 10;

  let csv = "Day,Daily_Outflow_Units,Cumulative_Outflow_Units,Remaining_Buffer_Units,Buffer_Status\n";
  let cum = 0;
  for (let d = 1; d <= 30; d++) {
    let rate = 98.4;
    if (d % 7 === 6 || d % 7 === 0) rate *= 0.35;
    else rate *= 1.12;
    if (d >= 28 && d <= 30) rate += 31.9;
    if (d <= duration) {
      if (scenario === "severe") rate = rate * 1.25 * stressMult;
      else if (scenario === "mild") rate *= stressMult;
    }
    cum += rate;
    const rem = buffer - cum;
    const status = rem >= 0 ? "SURVIVED" : "BREACHED";
    csv += `${d},${rate.toFixed(2)},${cum.toFixed(2)},${rem.toFixed(2)},${status}\n`;
  }

  triggerCSVDownload("liquidity_stress_30day_simulation_export.csv", csv);
}

function exportDataQualitySimCSV() {
  const vol = document.getElementById("p4-volume").value;
  const prev = document.getElementById("p4-prevalence").value;
  const cap = document.getElementById("p4-capacity").value;
  const contra = document.getElementById("p4-contra").checked;
  const flagged = document.getElementById("res-p4-flagged").textContent;
  const captured = document.getElementById("res-p4-captured").textContent;
  const escaped = document.getElementById("res-p4-escaped").textContent;
  const signRec = document.getElementById("res-p4-sign-recall").textContent;
  const cost = document.getElementById("res-p4-cost").textContent;

  const csv = "Metric,Value\n" +
    `Monthly Transaction Volume,${vol}\n` +
    `Defect Prevalence Pct,${prev}%\n` +
    `Audit Review Capacity,${cap}\n` +
    `Contra-Account Check Enabled,${contra}\n` +
    `Exception Queue Flagged,${flagged}\n` +
    `Captured Reporting Defects,${captured}\n` +
    `Escaped Reporting Defects,${escaped}\n` +
    `Sign-Flip Recall Rate,${signRec}\n` +
    `Monthly Triage Cost,${cost}\n`;

  triggerCSVDownload("reporting_data_quality_simulation_export.csv", csv);
}

