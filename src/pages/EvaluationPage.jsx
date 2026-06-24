import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import { FlaskConical, TrendingDown, TrendingUp, Minus } from "lucide-react";
import { evaluationResults } from "../data/mockData";
import Tabs from "../components/ui/Tabs";
import StatusBadge from "../components/ui/StatusBadge";

export default function EvaluationPage() {
    const [tab, setTab] = useState("Baseline");

    return (
        <div className="space-y-6 animate-fade-in">
            <Tabs tabs={["Baseline", "Realistic", "Gap Analysis"]} defaultTab={tab} onChange={setTab} />
            {tab === "Baseline" && <DatasetTab dataset="Baseline" />}
            {tab === "Realistic" && <DatasetTab dataset="Realistic" />}
            {tab === "Gap Analysis" && <GapTab />}
        </div>
    );
}

function DatasetTab({ dataset }) {
    const rows = evaluationResults.filter((r) => r.dataset === dataset);

    const rmseData = rows.filter((r) => r.rmse !== "-").map((r) => ({ name: `${r.model}`, rmse: r.rmse, domain: r.domain }));
    const f1Data = rows.filter((r) => r.f1 !== "-").map((r) => ({ name: `${r.model}`, f1: r.f1, domain: r.domain }));

    return (
        <div className="space-y-6">
            {/* Metrics Table */}
            <div className="bg-panel rounded-xl p-5 border border-white/5">
                <h3 className="font-medium mb-4 flex items-center gap-2">
                    <FlaskConical size={16} className="text-primary" />
                    {dataset} Dataset Results
                </h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="text-left px-4 py-3 text-xs text-muted font-medium">Model</th>
                                <th className="text-left px-4 py-3 text-xs text-muted font-medium">Domain</th>
                                <th className="text-center px-4 py-3 text-xs text-muted font-medium">RMSE</th>
                                <th className="text-center px-4 py-3 text-xs text-muted font-medium">NASA Score</th>
                                <th className="text-center px-4 py-3 text-xs text-muted font-medium">F1</th>
                                <th className="text-center px-4 py-3 text-xs text-muted font-medium">AUC</th>
                                <th className="text-center px-4 py-3 text-xs text-muted font-medium">Robustness</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((r, i) => (
                                <tr key={i} className="border-b border-white/[0.03] hover:bg-white/[0.04] transition-colors">
                                    <td className="px-4 py-3 font-medium">{r.model}</td>
                                    <td className="px-4 py-3 text-gray-400">{r.domain}</td>
                                    <td className="px-4 py-3 text-center font-semibold">{r.rmse !== "-" ? <span className="text-blue-400">{r.rmse}</span> : <span className="text-gray-600">–</span>}</td>
                                    <td className="px-4 py-3 text-center font-semibold">{r.nasa !== "-" ? <span className="text-cyan-400">{r.nasa}</span> : <span className="text-gray-600">–</span>}</td>
                                    <td className="px-4 py-3 text-center font-semibold">{r.f1 !== "-" ? <span className="text-green-400">{r.f1}</span> : <span className="text-gray-600">–</span>}</td>
                                    <td className="px-4 py-3 text-center font-semibold">{r.auc !== "-" ? <span className="text-purple-400">{r.auc}</span> : <span className="text-gray-600">–</span>}</td>
                                    <td className="px-4 py-3 text-center"><StatusBadge value={r.robustness} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {rmseData.length > 0 && (
                    <div className="bg-panel rounded-xl p-5 border border-white/5">
                        <h3 className="font-medium mb-4">RMSE Comparison</h3>
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={rmseData}>
                                <XAxis dataKey="name" tick={{ fill: "#94A3B8", fontSize: 10 }} axisLine={false} tickLine={false} angle={-15} textAnchor="end" height={50} />
                                <YAxis tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 13 }} itemStyle={{ color: "#e5e7eb" }} />
                                <Bar dataKey="rmse" name="RMSE" radius={[6, 6, 0, 0]}>
                                    {rmseData.map((d, i) => (
                                        <Cell key={i} fill={d.domain === "Aerospace" ? "#3b82f6" : d.domain === "Manufacturing" ? "#8b5cf6" : "#f59e0b"} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}
                {f1Data.length > 0 && (
                    <div className="bg-panel rounded-xl p-5 border border-white/5">
                        <h3 className="font-medium mb-4">F1 Score Comparison</h3>
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={f1Data}>
                                <XAxis dataKey="name" tick={{ fill: "#94A3B8", fontSize: 10 }} axisLine={false} tickLine={false} angle={-15} textAnchor="end" height={50} />
                                <YAxis tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 1]} />
                                <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 13 }} itemStyle={{ color: "#e5e7eb" }} />
                                <Bar dataKey="f1" name="F1" radius={[6, 6, 0, 0]}>
                                    {f1Data.map((_, i) => <Cell key={i} fill="#22c55e" />)}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>
        </div>
    );
}

function GapTab() {
    const baselineMap = {};
    const realisticMap = {};
    evaluationResults.forEach((r) => {
        const key = `${r.model}|${r.domain}`;
        if (r.dataset === "Baseline") baselineMap[key] = r;
        else realisticMap[key] = r;
    });

    const gaps = Object.keys(baselineMap).map((key) => {
        const b = baselineMap[key];
        const r = realisticMap[key];
        if (!r) return null;
        const rmseDelta = b.rmse !== "-" && r.rmse !== "-" ? +(r.rmse - b.rmse).toFixed(1) : null;
        const nasaDelta = b.nasa !== "-" && r.nasa !== "-" ? +(r.nasa - b.nasa).toFixed(2) : null;
        const f1Delta = b.f1 !== "-" && r.f1 !== "-" ? +(r.f1 - b.f1).toFixed(2) : null;
        const aucDelta = b.auc !== "-" && r.auc !== "-" ? +(r.auc - b.auc).toFixed(2) : null;
        return { model: b.model, domain: b.domain, baseRmse: b.rmse, realRmse: r.rmse, rmseDelta, baseNasa: b.nasa, realNasa: r.nasa, nasaDelta, baseF1: b.f1, realF1: r.f1, f1Delta, baseAuc: b.auc, realAuc: r.auc, aucDelta, robBase: b.robustness, robReal: r.robustness };
    }).filter(Boolean);

    return (
        <div className="space-y-6">
            <div className="bg-panel rounded-xl p-5 border border-white/5">
                <h3 className="font-medium mb-4 flex items-center gap-2">
                    <FlaskConical size={16} className="text-primary" />
                    Baseline vs Realistic Gap Analysis
                </h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/5 text-xs text-muted">
                                <th className="text-left px-3 py-3 font-medium">Model</th>
                                <th className="text-left px-3 py-3 font-medium">Domain</th>
                                <th className="text-center px-3 py-3 font-medium">RMSE (B→R)</th>
                                <th className="text-center px-3 py-3 font-medium">Δ RMSE</th>
                                <th className="text-center px-3 py-3 font-medium">NASA (B→R)</th>
                                <th className="text-center px-3 py-3 font-medium">Δ NASA</th>
                                <th className="text-center px-3 py-3 font-medium">F1 (B→R)</th>
                                <th className="text-center px-3 py-3 font-medium">Δ F1</th>
                                <th className="text-center px-3 py-3 font-medium">Robustness</th>
                            </tr>
                        </thead>
                        <tbody>
                            {gaps.map((g, i) => (
                                <tr key={i} className="border-b border-white/[0.03] hover:bg-white/[0.04] transition-colors">
                                    <td className="px-3 py-3 font-medium">{g.model}</td>
                                    <td className="px-3 py-3 text-gray-400">{g.domain}</td>
                                    <td className="px-3 py-3 text-center text-gray-300">
                                        {g.baseRmse !== "-" ? `${g.baseRmse} → ${g.realRmse}` : "–"}
                                    </td>
                                    <td className="px-3 py-3 text-center">
                                        {g.rmseDelta !== null ? <DeltaBadge value={g.rmseDelta} invert /> : "–"}
                                    </td>
                                    <td className="px-3 py-3 text-center text-gray-300">
                                        {g.baseNasa !== "-" ? `${g.baseNasa} → ${g.realNasa}` : "–"}
                                    </td>
                                    <td className="px-3 py-3 text-center">
                                        {g.nasaDelta !== null ? <DeltaBadge value={g.nasaDelta} /> : "–"}
                                    </td>
                                    <td className="px-3 py-3 text-center text-gray-300">
                                        {g.baseF1 !== "-" ? `${g.baseF1} → ${g.realF1}` : "–"}
                                    </td>
                                    <td className="px-3 py-3 text-center">
                                        {g.f1Delta !== null ? <DeltaBadge value={g.f1Delta} /> : "–"}
                                    </td>
                                    <td className="px-3 py-3 text-center"><StatusBadge value={g.robReal} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Robustness Score Chart */}
            <div className="bg-panel rounded-xl p-5 border border-white/5">
                <h3 className="font-medium mb-4">Performance Gap Visualization</h3>
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={gaps.filter((g) => g.rmseDelta !== null).map((g) => ({ name: g.model, gap: Math.abs(g.rmseDelta), domain: g.domain }))}>
                        <XAxis dataKey="name" tick={{ fill: "#94A3B8", fontSize: 10 }} axisLine={false} tickLine={false} angle={-15} textAnchor="end" height={50} />
                        <YAxis tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={false} tickLine={false} label={{ value: "RMSE Gap", angle: -90, position: "insideLeft", fill: "#64748b", fontSize: 11 }} />
                        <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 13 }} itemStyle={{ color: "#e5e7eb" }} />
                        <Bar dataKey="gap" name="RMSE Δ" radius={[6, 6, 0, 0]}>
                            {gaps.filter((g) => g.rmseDelta !== null).map((g, i) => (
                                <Cell key={i} fill={Math.abs(g.rmseDelta) > 5 ? "#ef4444" : Math.abs(g.rmseDelta) > 3 ? "#f59e0b" : "#22c55e"} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

function DeltaBadge({ value, invert = false }) {
    const isGood = invert ? value <= 0 : value >= 0;
    const color = isGood ? "text-green-400" : "text-red-400";
    const Icon = value > 0 ? TrendingUp : value < 0 ? TrendingDown : Minus;
    return (
        <span className={`inline-flex items-center gap-0.5 text-xs font-semibold ${color}`}>
            <Icon size={12} />
            {value > 0 ? "+" : ""}{value}
        </span>
    );
}
