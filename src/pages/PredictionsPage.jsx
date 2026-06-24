import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LineChart, Line, CartesianGrid, ScatterChart, Scatter, ZAxis } from "recharts";
import { TrendingUp, AlertTriangle } from "lucide-react";
import { assets, confusionMatrix } from "../data/mockData";
import Tabs from "../components/ui/Tabs";
import StatusBadge from "../components/ui/StatusBadge";

export default function PredictionsPage() {
    const [tab, setTab] = useState("RUL Predictions");

    return (
        <div className="space-y-6 animate-fade-in">
            <Tabs tabs={["RUL Predictions", "Fault Diagnosis"]} defaultTab={tab} onChange={setTab} />
            {tab === "RUL Predictions" ? <RULTab /> : <FaultTab />}
        </div>
    );
}

/* ── RUL Tab ─────────────────────────────────────────────────────────── */
function RULTab() {
    const sorted = [...assets].sort((a, b) => a.rul - b.rul);
    const histBuckets = [
        { range: "0–50", count: assets.filter((a) => a.rul <= 50).length },
        { range: "50–100", count: assets.filter((a) => a.rul > 50 && a.rul <= 100).length },
        { range: "100–200", count: assets.filter((a) => a.rul > 100 && a.rul <= 200).length },
        { range: "200–300", count: assets.filter((a) => a.rul > 200 && a.rul <= 300).length },
        { range: "300–400", count: assets.filter((a) => a.rul > 300 && a.rul <= 400).length },
        { range: "400+", count: assets.filter((a) => a.rul > 400).length },
    ];
    const histColors = ["#ef4444", "#f97316", "#f59e0b", "#eab308", "#84cc16", "#22c55e"];

    const modelCompare = sorted.slice(0, 10).map((a) => ({
        name: a.name,
        v1: Math.max(0, a.rul * 1.15 + Math.random() * 20 - 10),
        v2: a.rul,
    }));

    return (
        <div className="space-y-6">
            {/* Top assets by lowest RUL */}
            <div className="bg-panel rounded-xl p-5 border border-white/5">
                <h3 className="font-medium mb-4 flex items-center gap-2"><TrendingUp size={16} className="text-primary" /> Asset Ranking by RUL</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead><tr className="border-b border-white/5 text-xs text-muted">
                            <th className="text-left py-3 px-4">#</th>
                            <th className="text-left py-3 px-4">Asset</th>
                            <th className="text-left py-3 px-4">Domain</th>
                            <th className="text-left py-3 px-4">RUL (hrs)</th>
                            <th className="text-left py-3 px-4">Fault %</th>
                            <th className="text-left py-3 px-4">Risk</th>
                            <th className="text-left py-3 px-4">Model</th>
                        </tr></thead>
                        <tbody>
                            {sorted.slice(0, 12).map((a, i) => (
                                <tr key={a.id} className="border-b border-white/[0.03] hover:bg-white/[0.04] transition-colors">
                                    <td className="px-4 py-3 text-muted">{i + 1}</td>
                                    <td className="px-4 py-3 font-medium">{a.name}</td>
                                    <td className="px-4 py-3 text-gray-400">{a.domain}</td>
                                    <td className="px-4 py-3 font-semibold" style={{ color: a.rul < 50 ? "#ef4444" : a.rul < 150 ? "#f59e0b" : "#e5e7eb" }}>{a.rul}</td>
                                    <td className="px-4 py-3">{(a.faultProb * 100).toFixed(1)}%</td>
                                    <td className="px-4 py-3"><StatusBadge value={a.riskScore} /></td>
                                    <td className="px-4 py-3 text-gray-400">{a.modelVersion}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* RUL Histogram */}
                <div className="bg-panel rounded-xl p-5 border border-white/5">
                    <h3 className="font-medium mb-4">RUL Distribution</h3>
                    <ResponsiveContainer width="100%" height={240}>
                        <BarChart data={histBuckets}>
                            <XAxis dataKey="range" tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                            <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 13 }} itemStyle={{ color: "#e5e7eb" }} />
                            <Bar dataKey="count" name="Assets" radius={[6, 6, 0, 0]}>
                                {histBuckets.map((_, i) => <Cell key={i} fill={histColors[i]} />)}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Model Comparison */}
                <div className="bg-panel rounded-xl p-5 border border-white/5">
                    <h3 className="font-medium mb-4">Model Comparison (v1 vs v2)</h3>
                    <ResponsiveContainer width="100%" height={240}>
                        <BarChart data={modelCompare}>
                            <XAxis dataKey="name" tick={{ fill: "#94A3B8", fontSize: 10 }} axisLine={false} tickLine={false} angle={-20} textAnchor="end" height={50} />
                            <YAxis tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 13 }} itemStyle={{ color: "#e5e7eb" }} />
                            <Bar dataKey="v1" name="v1.0" fill="#64748b" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="v2" name="v2.0" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

/* ── Fault Diagnosis Tab ─────────────────────────────────────────────── */
function FaultTab() {
    const faultAssets = assets.filter((a) => a.faultClass !== "Normal").map((a) => ({
        name: a.name,
        fault: a.faultClass,
        prob: (a.faultProb * 100).toFixed(1),
        domain: a.domain,
    }));

    const { labels, matrix } = confusionMatrix;

    // Heatmap data for scatter
    const heatData = [];
    matrix.forEach((row, ri) => {
        row.forEach((val, ci) => {
            heatData.push({ x: ci, y: ri, z: val, actual: labels[ri], predicted: labels[ci] });
        });
    });

    return (
        <div className="space-y-6">
            {/* Classification Output */}
            <div className="bg-panel rounded-xl p-5 border border-white/5">
                <h3 className="font-medium mb-4 flex items-center gap-2"><AlertTriangle size={16} className="text-amber-400" /> Fault Classification Output</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead><tr className="border-b border-white/5 text-xs text-muted">
                            <th className="text-left py-3 px-4">Asset</th>
                            <th className="text-left py-3 px-4">Domain</th>
                            <th className="text-left py-3 px-4">Predicted Fault</th>
                            <th className="text-left py-3 px-4">Probability</th>
                        </tr></thead>
                        <tbody>
                            {faultAssets.map((a, i) => (
                                <tr key={i} className="border-b border-white/[0.03] hover:bg-white/[0.04] transition-colors">
                                    <td className="px-4 py-3 font-medium">{a.name}</td>
                                    <td className="px-4 py-3 text-gray-400">{a.domain}</td>
                                    <td className="px-4 py-3"><StatusBadge value={a.fault} /></td>
                                    <td className="px-4 py-3 font-semibold text-amber-400">{a.prob}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Confusion Matrix */}
            <div className="bg-panel rounded-xl p-5 border border-white/5">
                <h3 className="font-medium mb-4">Confusion Matrix</h3>
                <div className="overflow-x-auto">
                    <table className="text-sm">
                        <thead>
                            <tr>
                                <th className="px-3 py-2 text-xs text-muted"></th>
                                {labels.map((l) => (
                                    <th key={l} className="px-3 py-2 text-xs text-muted font-medium text-center">{l}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {matrix.map((row, ri) => (
                                <tr key={ri}>
                                    <td className="px-3 py-2 text-xs text-muted font-medium">{labels[ri]}</td>
                                    {row.map((val, ci) => {
                                        const isDiag = ri === ci;
                                        const maxVal = Math.max(...matrix.flat());
                                        const intensity = val / maxVal;
                                        return (
                                            <td key={ci} className="px-3 py-2 text-center">
                                                <div
                                                    className={`w-14 h-10 rounded-lg flex items-center justify-center text-sm font-semibold mx-auto ${isDiag ? "text-white" : "text-gray-400"
                                                        }`}
                                                    style={{
                                                        background: isDiag
                                                            ? `rgba(59, 130, 246, ${0.3 + intensity * 0.6})`
                                                            : `rgba(255, 255, 255, ${intensity * 0.08})`,
                                                    }}
                                                >
                                                    {val}
                                                </div>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="mt-3 flex items-center gap-4 text-xs text-muted">
                        <span>Rows: Actual</span>
                        <span>Columns: Predicted</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
