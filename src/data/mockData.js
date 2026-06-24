// ─── PMIS Mock Data Layer ────────────────────────────────────────────────────
// Replace these exports with API calls when backend is ready.

/* ── helpers ─────────────────────────────────────────────────────────────── */
const id = (prefix, n) => `${prefix}-${String(n).padStart(4, "0")}`;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const rand = (lo, hi) => +(lo + Math.random() * (hi - lo)).toFixed(2);

const DOMAINS = ["Aerospace", "Automotive", "Manufacturing"];
const SITES = {
  Aerospace: ["Hangar A", "Hangar B", "MRO-East"],
  Automotive: ["Plant-1", "Plant-2", "Line-7"],
  Manufacturing: ["Mill-A", "CNC-Bay", "Assembly-3"],
};
const FAULT_CLASSES = [
  "Bearing Wear",
  "Cavitation Risk",
  "Overheating",
  "Vibration Anomaly",
  "Electrical Fault",
  "Seal Degradation",
  "Normal",
];

/* ── ASSETS ──────────────────────────────────────────────────────────────── */
export const assets = Array.from({ length: 24 }, (_, i) => {
  const domain = DOMAINS[i % 3];
  const rul = rand(8, 500);
  const faultProb = rand(0.02, 0.95);
  const healthIndex = Math.max(0, Math.min(100, 100 - faultProb * 80 + rand(-10, 10)));
  const riskScore =
    rul < 50 ? "Critical" : rul < 150 ? "High" : rul < 300 ? "Medium" : "Low";
  return {
    id: id("AST", i + 1),
    name: `${domain.slice(0, 3).toUpperCase()}-${String(i + 1).padStart(2, "0")}`,
    domain,
    site: SITES[domain][i % SITES[domain].length],
    status: i % 7 === 0 ? "Offline" : "Online",
    healthIndex: +healthIndex.toFixed(1),
    rul: +rul.toFixed(0),
    faultProb: +faultProb.toFixed(3),
    faultClass: faultProb > 0.6 ? FAULT_CLASSES[i % 6] : "Normal",
    riskScore,
    lastUpdated: new Date(Date.now() - i * 3600000 * 2).toISOString(),
    modelVersion: i % 3 === 0 ? "v2.0" : "v1.0",
  };
});

/* ── ALERTS ──────────────────────────────────────────────────────────────── */
const ALERT_TYPES = [
  "RUL Below Threshold",
  "Fault Probability Exceeded",
  "Anomaly Burst",
  "Missing Telemetry",
];
const SEVERITIES = ["Critical", "High", "Medium", "Low"];
const ALERT_STATUSES = ["Open", "Acknowledged", "Closed"];

export const alerts = Array.from({ length: 18 }, (_, i) => ({
  id: id("ALR", i + 1),
  assetId: assets[i % assets.length].id,
  assetName: assets[i % assets.length].name,
  type: ALERT_TYPES[i % ALERT_TYPES.length],
  severity: SEVERITIES[i % SEVERITIES.length],
  status: ALERT_STATUSES[i % ALERT_STATUSES.length],
  createdAt: new Date(Date.now() - i * 7200000).toISOString(),
  triggerCondition:
    i % 2 === 0
      ? "RUL dropped below 40 hrs threshold"
      : "Fault probability exceeded 0.75",
  evidence: "Sensor vibration spike detected at 14:32 UTC",
  assignedTo: ["Ravi K.", "Sarah L.", "Tom M.", "Ana P."][i % 4],
  notes: i % 3 === 0 ? "Scheduled for next shift inspection." : "",
}));

/* ── MODELS ──────────────────────────────────────────────────────────────── */
export const models = [
  {
    id: "MDL-001",
    name: "LSTM-RUL",
    version: "v1.0",
    domain: "Aerospace",
    task: "RUL",
    dataset: "C-MAPSS Baseline",
    metrics: { rmse: 22.4, nasaScore: 0.81, f1: null, auc: null },
    seedVariance: 1.8,
    active: false,
    hyperparams: { layers: 2, units: 64, dropout: 0.2, lr: 0.001, epochs: 80 },
    trainDataInfo: "FD001 – 100 engines, 21 sensors",
    multiSeedStats: { mean_rmse: 22.4, std_rmse: 1.8, seeds: [42, 123, 456, 789, 1024] },
    gitHash: "a3f7c1d",
    lastTrained: "2025-08-15",
  },
  {
    id: "MDL-002",
    name: "LSTM-RUL",
    version: "v2.0",
    domain: "Aerospace",
    task: "RUL",
    dataset: "C-MAPSS Realistic",
    metrics: { rmse: 18.4, nasaScore: 0.88, f1: null, auc: null },
    seedVariance: 1.2,
    active: true,
    hyperparams: { layers: 3, units: 128, dropout: 0.3, lr: 0.0005, epochs: 120 },
    trainDataInfo: "FD001+FD003 – 200 engines, 21 sensors, noise-augmented",
    multiSeedStats: { mean_rmse: 18.4, std_rmse: 1.2, seeds: [42, 123, 456, 789, 1024] },
    gitHash: "b5e9d2f",
    lastTrained: "2025-12-09",
  },
  {
    id: "MDL-003",
    name: "CNN-Fault",
    version: "v1.0",
    domain: "Automotive",
    task: "Fault",
    dataset: "CWRU Baseline",
    metrics: { rmse: null, nasaScore: null, f1: 0.91, auc: 0.94 },
    seedVariance: 0.03,
    active: false,
    hyperparams: { filters: [32, 64, 128], kernelSize: 3, lr: 0.001, epochs: 60 },
    trainDataInfo: "12kHz drive-end, 4 fault classes",
    multiSeedStats: { mean_f1: 0.91, std_f1: 0.03, seeds: [42, 123, 456] },
    gitHash: "c1a2b3e",
    lastTrained: "2025-07-20",
  },
  {
    id: "MDL-004",
    name: "CNN-Fault",
    version: "v2.0",
    domain: "Automotive",
    task: "Fault",
    dataset: "CWRU Realistic",
    metrics: { rmse: null, nasaScore: null, f1: 0.86, auc: 0.90 },
    seedVariance: 0.05,
    active: true,
    hyperparams: { filters: [32, 64, 128], kernelSize: 5, lr: 0.0005, epochs: 100 },
    trainDataInfo: "12kHz + 48kHz, 4 fault classes, variable load",
    multiSeedStats: { mean_f1: 0.86, std_f1: 0.05, seeds: [42, 123, 456] },
    gitHash: "d4e5f6a",
    lastTrained: "2025-11-03",
  },
  {
    id: "MDL-005",
    name: "Transformer-RUL",
    version: "v1.0",
    domain: "Manufacturing",
    task: "RUL",
    dataset: "PHM Milling Baseline",
    metrics: { rmse: 15.2, nasaScore: 0.85, f1: null, auc: null },
    seedVariance: 2.1,
    active: false,
    hyperparams: { heads: 4, dModel: 64, layers: 3, lr: 0.0003, epochs: 100 },
    trainDataInfo: "16 milling runs, 7 sensors, flank wear labels",
    multiSeedStats: { mean_rmse: 15.2, std_rmse: 2.1, seeds: [42, 123, 456, 789] },
    gitHash: "e7f8a9b",
    lastTrained: "2025-09-28",
  },
  {
    id: "MDL-006",
    name: "Transformer-RUL",
    version: "v2.0",
    domain: "Manufacturing",
    task: "RUL",
    dataset: "PHM Milling Realistic",
    metrics: { rmse: 13.8, nasaScore: 0.89, f1: null, auc: null },
    seedVariance: 1.5,
    active: true,
    hyperparams: { heads: 8, dModel: 128, layers: 4, lr: 0.0002, epochs: 150 },
    trainDataInfo: "16 milling runs + 10 augmented, 7 sensors, regime shifts",
    multiSeedStats: { mean_rmse: 13.8, std_rmse: 1.5, seeds: [42, 123, 456, 789] },
    gitHash: "f0a1b2c",
    lastTrained: "2025-12-20",
  },
];

/* ── DATASETS ────────────────────────────────────────────────────────────── */
export const datasets = [
  {
    id: "DS-001", name: "C-MAPSS FD001", domain: "Aerospace", type: "Baseline",
    sensors: 21, samplingFreq: "1 Hz", missingPct: 0, regimeDiversity: "Single",
    distributionShift: "None", truncationInfo: "End-of-life labeled",
  },
  {
    id: "DS-002", name: "C-MAPSS FD001 Realistic", domain: "Aerospace", type: "Realistic",
    sensors: 21, samplingFreq: "1 Hz", missingPct: 4.2, regimeDiversity: "Multi",
    distributionShift: "Noise injection + sensor dropout", truncationInfo: "Random right-censoring 15%",
  },
  {
    id: "DS-003", name: "CWRU Bearing", domain: "Automotive", type: "Baseline",
    sensors: 3, samplingFreq: "12 kHz", missingPct: 0, regimeDiversity: "Single load",
    distributionShift: "None", truncationInfo: "N/A",
  },
  {
    id: "DS-004", name: "CWRU Bearing Realistic", domain: "Automotive", type: "Realistic",
    sensors: 3, samplingFreq: "12 kHz + 48 kHz", missingPct: 2.1, regimeDiversity: "Variable load",
    distributionShift: "Speed variation + background noise", truncationInfo: "N/A",
  },
  {
    id: "DS-005", name: "PHM Milling", domain: "Manufacturing", type: "Baseline",
    sensors: 7, samplingFreq: "250 Hz", missingPct: 0, regimeDiversity: "Fixed regime",
    distributionShift: "None", truncationInfo: "Flank wear threshold",
  },
  {
    id: "DS-006", name: "PHM Milling Realistic", domain: "Manufacturing", type: "Realistic",
    sensors: 7, samplingFreq: "250 Hz", missingPct: 3.8, regimeDiversity: "Multi-regime",
    distributionShift: "Tool material variation", truncationInfo: "Mixed censoring",
  },
  {
    id: "DS-007", name: "NASA Bearing IMS", domain: "Manufacturing", type: "Baseline",
    sensors: 4, samplingFreq: "20 kHz", missingPct: 0, regimeDiversity: "Constant",
    distributionShift: "None", truncationInfo: "Run-to-failure",
  },
  {
    id: "DS-008", name: "NASA Bearing IMS Realistic", domain: "Manufacturing", type: "Realistic",
    sensors: 4, samplingFreq: "20 kHz", missingPct: 5.5, regimeDiversity: "Variable",
    distributionShift: "Lubrication changes", truncationInfo: "Interval sampling",
  },
];

/* ── EVALUATION RESULTS ──────────────────────────────────────────────────── */
export const evaluationResults = [
  { model: "LSTM-RUL v1.0", dataset: "Baseline", domain: "Aerospace", rmse: 22.4, nasa: 0.81, f1: "-", auc: "-", robustness: "Low" },
  { model: "LSTM-RUL v2.0", dataset: "Baseline", domain: "Aerospace", rmse: 18.4, nasa: 0.88, f1: "-", auc: "-", robustness: "High" },
  { model: "LSTM-RUL v1.0", dataset: "Realistic", domain: "Aerospace", rmse: 28.1, nasa: 0.72, f1: "-", auc: "-", robustness: "Low" },
  { model: "LSTM-RUL v2.0", dataset: "Realistic", domain: "Aerospace", rmse: 20.9, nasa: 0.84, f1: "-", auc: "-", robustness: "High" },
  { model: "CNN-Fault v1.0", dataset: "Baseline", domain: "Automotive", rmse: "-", nasa: "-", f1: 0.91, auc: 0.94, robustness: "Medium" },
  { model: "CNN-Fault v2.0", dataset: "Baseline", domain: "Automotive", rmse: "-", nasa: "-", f1: 0.88, auc: 0.92, robustness: "High" },
  { model: "CNN-Fault v1.0", dataset: "Realistic", domain: "Automotive", rmse: "-", nasa: "-", f1: 0.82, auc: 0.86, robustness: "Low" },
  { model: "CNN-Fault v2.0", dataset: "Realistic", domain: "Automotive", rmse: "-", nasa: "-", f1: 0.86, auc: 0.90, robustness: "High" },
  { model: "Transformer-RUL v1.0", dataset: "Baseline", domain: "Manufacturing", rmse: 15.2, nasa: 0.85, f1: "-", auc: "-", robustness: "Medium" },
  { model: "Transformer-RUL v2.0", dataset: "Baseline", domain: "Manufacturing", rmse: 13.8, nasa: 0.89, f1: "-", auc: "-", robustness: "High" },
  { model: "Transformer-RUL v1.0", dataset: "Realistic", domain: "Manufacturing", rmse: 19.5, nasa: 0.78, f1: "-", auc: "-", robustness: "Low" },
  { model: "Transformer-RUL v2.0", dataset: "Realistic", domain: "Manufacturing", rmse: 15.1, nasa: 0.86, f1: "-", auc: "-", robustness: "High" },
];

/* ── RUNS / EXPERIMENTS ──────────────────────────────────────────────────── */
export const runs = Array.from({ length: 12 }, (_, i) => {
  const modelIdx = i % models.length;
  const m = models[modelIdx];
  return {
    id: id("RUN", i + 1),
    modelName: m.name,
    modelVersion: m.version,
    dataset: m.dataset,
    seed: [42, 123, 456, 789, 1024][i % 5],
    metrics: { ...m.metrics },
    gitHash: m.gitHash,
    date: new Date(2025, 6 + (i % 6), 1 + i * 2).toISOString().split("T")[0],
    lossCurve: Array.from({ length: 20 }, (_, j) => ({
      epoch: j + 1,
      trainLoss: +(2.5 * Math.exp(-0.15 * j) + rand(0, 0.1)).toFixed(4),
      valLoss: +(2.8 * Math.exp(-0.13 * j) + rand(0, 0.15)).toFixed(4),
    })),
    config: m.hyperparams,
  };
});

/* ── WORK ORDERS ─────────────────────────────────────────────────────────── */
const WO_STATUSES = ["Open", "In Progress", "Completed"];
const ENGINEERS = ["Ravi K.", "Sarah L.", "Tom M.", "Ana P.", "Mike D."];

export const workOrders = Array.from({ length: 10 }, (_, i) => ({
  id: id("WO", i + 1),
  assetId: assets[i % assets.length].id,
  assetName: assets[i % assets.length].name,
  priority: SEVERITIES[i % SEVERITIES.length],
  dueDate: new Date(Date.now() + (i + 1) * 86400000 * 2).toISOString().split("T")[0],
  status: WO_STATUSES[i % WO_STATUSES.length],
  assignedTo: ENGINEERS[i % ENGINEERS.length],
  linkedAlertId: alerts[i % alerts.length]?.id || null,
  decisionScore: rand(0.5, 1.0),
  description: `Preventive maintenance triggered by predictive model for ${assets[i % assets.length].name}`,
}));

/* ── PREDICTIONS (per-asset time series) ─────────────────────────────────── */
export const generateHealthTimeline = (assetId) => {
  const asset = assets.find((a) => a.id === assetId) || assets[0];
  const points = 60;
  const base = asset.healthIndex;
  return Array.from({ length: points }, (_, i) => ({
    time: new Date(Date.now() - (points - i) * 3600000).toISOString(),
    healthIndex: Math.max(0, Math.min(100, base + Math.sin(i / 5) * 8 + rand(-3, 3) - i * 0.3)),
    temperature: rand(55, 95),
    vibration: rand(0.5, 4.5),
    pressure: rand(28, 42),
  }));
};

export const generateRulForecast = (assetId) => {
  const asset = assets.find((a) => a.id === assetId) || assets[0];
  const currentRul = asset.rul;
  return Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    v1: Math.max(0, currentRul * 1.1 - i * (currentRul / 35) + rand(-5, 5)),
    v2: Math.max(0, currentRul - i * (currentRul / 30) + rand(-3, 3)),
    upper: Math.max(0, currentRul * 1.15 - i * (currentRul / 32)),
    lower: Math.max(0, currentRul * 0.85 - i * (currentRul / 28)),
  }));
};

export const generateAnomalyEvents = (assetId) => {
  return Array.from({ length: 6 }, (_, i) => ({
    id: `ANM-${assetId}-${i + 1}`,
    timestamp: new Date(Date.now() - i * 14400000).toISOString(),
    type: ["Vibration Spike", "Temp Surge", "Pressure Drop", "Current Fluctuation", "Noise Burst", "Phase Imbalance"][i],
    severity: SEVERITIES[i % 4],
    sensorContribution: { vibration: rand(0.1, 1), temperature: rand(0.1, 1), pressure: rand(0.1, 1) },
  }));
};

/* ── FAULT DIAGNOSIS DATA ────────────────────────────────────────────────── */
export const confusionMatrix = {
  labels: ["Normal", "Bearing", "Overheating", "Electrical", "Cavitation"],
  matrix: [
    [48, 2, 0, 1, 0],
    [1, 42, 3, 0, 1],
    [0, 2, 39, 2, 0],
    [1, 0, 1, 44, 1],
    [0, 1, 0, 2, 41],
  ],
};

/* ── KPI SUMMARIES ───────────────────────────────────────────────────────── */
export const getKpis = (domainFilter = "All") => {
  const filtered = domainFilter === "All" ? assets : assets.filter((a) => a.domain === domainFilter);
  const total = filtered.length;
  const critical = filtered.filter((a) => a.riskScore === "Critical" || a.riskScore === "High").length;
  const avgRul = +(filtered.reduce((s, a) => s + a.rul, 0) / total).toFixed(0);
  const activeModel = models.find((m) => m.active && (domainFilter === "All" || m.domain === domainFilter));
  return {
    totalAssets: total,
    criticalRisk: critical,
    avgRul,
    activeModelVersion: activeModel?.version || "v2.0",
    activeModelName: activeModel?.name || "LSTM-RUL",
    modelRmse: activeModel?.metrics?.rmse ?? "–",
    datasetSource: activeModel?.dataset || "–",
  };
};

export const getFleetRiskDistribution = (domainFilter = "All") => {
  const filtered = domainFilter === "All" ? assets : assets.filter((a) => a.domain === domainFilter);
  const green = filtered.filter((a) => a.riskScore === "Low").length;
  const amber = filtered.filter((a) => a.riskScore === "Medium" || a.riskScore === "High").length;
  const red = filtered.filter((a) => a.riskScore === "Critical").length;
  return [
    { name: "Healthy", value: green, color: "#22c55e" },
    { name: "Degrading", value: amber, color: "#f59e0b" },
    { name: "Critical", value: red, color: "#ef4444" },
  ];
};
