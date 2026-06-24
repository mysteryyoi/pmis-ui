import { useParams, Link } from "react-router-dom";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { ArrowLeft, Wrench, AlertTriangle, Activity, Brain, Clock, Shield, TrendingUp } from "lucide-react";
import { assets, generateHealthTimeline, generateRulForecast, generateAnomalyEvents } from "../data/mockData";
import StatusBadge from "../components/ui/StatusBadge";

export default function AssetDetailPage() {
    const { id } = useParams();
    const asset = assets.find((a) => a.id === id) || assets[0];
    const healthData = generateHealthTimeline(asset.id);
    const rulForecast = generateRulForecast(asset.id);
    const anomalies = generateAnomalyEvents(asset.id);

    const faultBreakdown = [
        { name: "Bearing Wear", value: 32 },
        { name: "Overheating", value: 24 },
        { name: "Vibration", value: 18 },
        { name: "Electrical", value: 14 },
        { name: "Normal", value: 12 },
    ];
    const faultColors = ["#ef4444", "#f59e0b", "#8b5cf6", "#3b82f6", "#22c55e"];

    const priorityScore = Math.min(1, (1 - asset.rul / 500) * 0.6 + asset.faultProb * 0.4).toFixed(2);
    const daysUntilMaint = Math.max(1, Math.floor(asset.rul / 24));

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Back + Header */}
            <Link to="/assets" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-primary transition-colors">
                <ArrowLeft size={16} /> Back to Assets
            </Link>

            <div className="bg-panel rounded-xl p-6 border border-white/5">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <h2 className="text-2xl font-bold">{asset.name}</h2>
                            <StatusBadge value={asset.status} />
                            <StatusBadge value={asset.riskScore} />
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-2 text-sm">
                            <InfoRow label="Asset ID" value={asset.id} />
                            <InfoRow label="Domain" value={asset.domain} />
                            <InfoRow label="Site" value={asset.site} />
                            <InfoRow label="Model Version" value={asset.modelVersion} />
                            <InfoRow label="Fault Class" value={asset.faultClass} />
                            <InfoRow label="Last Updated" value={new Date(asset.lastUpdated).toLocaleString()} />
                        </div>
                    </div>

                    <div className="flex gap-4 shrink-0">
                        <MetricBox icon={Activity} label="Health Index" value={asset.healthIndex} color={asset.healthIndex > 70 ? "text-green-400" : asset.healthIndex > 40 ? "text-amber-400" : "text-red-400"} />
                        <MetricBox icon={Clock} label="RUL" value={`${asset.rul}h`} color={asset.rul < 50 ? "text-red-400" : asset.rul < 150 ? "text-amber-400" : "text-green-400"} />
                        <MetricBox icon={AlertTriangle} label="Fault Prob" value={`${(asset.faultProb * 100).toFixed(0)}%`} color={asset.faultProb > 0.6 ? "text-red-400" : "text-amber-400"} />
                    </div>
                </div>
            </div>

            {/* Health Timeline */}
            <div className="bg-panel rounded-xl p-5 border border-white/5">
                <h3 className="font-medium mb-4 flex items-center gap-2">
                    <Activity size={16} className="text-primary" />
                    Health Timeline
                </h3>
                <ResponsiveContainer width="100%" height={280}>
                    <AreaChart data={healthData}>
                        <defs>
                            <linearGradient id="gradH" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.3} />
                                <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="time" tickFormatter={(t) => new Date(t).toLocaleTimeString([], { hour: "2-digit" })} tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis domain={[0, 100]} tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 13 }} itemStyle={{ color: "#e5e7eb" }} labelFormatter={(t) => new Date(t).toLocaleString()} />
                        <Area type="monotone" dataKey="healthIndex" stroke="#3B82F6" fill="url(#gradH)" strokeWidth={2} name="Health Index" />
                        <Line type="monotone" dataKey="vibration" stroke="#f59e0b" strokeWidth={1.5} dot={false} name="Vibration" />
                        <Line type="monotone" dataKey="temperature" stroke="#ef4444" strokeWidth={1.5} dot={false} name="Temperature" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* RUL Forecast + Fault Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* RUL Forecast */}
                <div className="bg-panel rounded-xl p-5 border border-white/5">
                    <h3 className="font-medium mb-4 flex items-center gap-2">
                        <TrendingUp size={16} className="text-primary" />
                        RUL Forecast (v1 vs v2)
                    </h3>
                    <ResponsiveContainer width="100%" height={240}>
                        <AreaChart data={rulForecast}>
                            <defs>
                                <linearGradient id="conf" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.1} />
                                    <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="day" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} label={{ value: "Days", position: "insideBottom", offset: -5, fill: "#64748b", fontSize: 11 }} />
                            <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 13 }} itemStyle={{ color: "#e5e7eb" }} />
                            <Area type="monotone" dataKey="upper" stroke="none" fill="url(#conf)" name="Upper CI" />
                            <Area type="monotone" dataKey="lower" stroke="none" fill="transparent" name="Lower CI" />
                            <Line type="monotone" dataKey="v1" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="5 5" dot={false} name="v1.0" />
                            <Line type="monotone" dataKey="v2" stroke="#3B82F6" strokeWidth={2} dot={false} name="v2.0" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Fault Analysis */}
                <div className="bg-panel rounded-xl p-5 border border-white/5">
                    <h3 className="font-medium mb-4 flex items-center gap-2">
                        <AlertTriangle size={16} className="text-amber-400" />
                        Fault Class Breakdown
                    </h3>
                    <ResponsiveContainer width="100%" height={240}>
                        <BarChart data={faultBreakdown} layout="vertical">
                            <XAxis type="number" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                            <YAxis type="category" dataKey="name" tick={{ fill: "#94A3B8", fontSize: 12 }} axisLine={false} tickLine={false} width={100} />
                            <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 13 }} itemStyle={{ color: "#e5e7eb" }} />
                            <Bar dataKey="value" name="Probability %" radius={[0, 6, 6, 0]}>
                                {faultBreakdown.map((_, i) => <Cell key={i} fill={faultColors[i]} />)}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Anomaly Events */}
            <div className="bg-panel rounded-xl p-5 border border-white/5">
                <h3 className="font-medium mb-4">Anomaly Events</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead><tr className="border-b border-white/5 text-xs text-muted">
                            <th className="text-left py-3 px-4">Time</th>
                            <th className="text-left py-3 px-4">Type</th>
                            <th className="text-left py-3 px-4">Severity</th>
                            <th className="text-left py-3 px-4">Vibration</th>
                            <th className="text-left py-3 px-4">Temp</th>
                            <th className="text-left py-3 px-4">Pressure</th>
                        </tr></thead>
                        <tbody>
                            {anomalies.map((ev) => (
                                <tr key={ev.id} className="border-b border-white/[0.03] hover:bg-white/[0.03] transition-colors">
                                    <td className="py-3 px-4 text-xs text-gray-500">{new Date(ev.timestamp).toLocaleString()}</td>
                                    <td className="py-3 px-4 font-medium">{ev.type}</td>
                                    <td className="py-3 px-4"><StatusBadge value={ev.severity} /></td>
                                    <td className="py-3 px-4 text-gray-400">{ev.sensorContribution.vibration.toFixed(2)}</td>
                                    <td className="py-3 px-4 text-gray-400">{ev.sensorContribution.temperature.toFixed(2)}</td>
                                    <td className="py-3 px-4 text-gray-400">{ev.sensorContribution.pressure.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Decision Layer */}
            <div className="bg-panel rounded-xl p-6 border border-white/5">
                <h3 className="font-medium mb-5 flex items-center gap-2">
                    <Shield size={16} className="text-primary" />
                    Decision Layer Output
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="space-y-1">
                        <p className="text-xs text-muted">Maintenance Priority Score</p>
                        <p className="text-3xl font-bold text-primary">{priorityScore}</p>
                        <div className="w-full h-2 rounded-full bg-white/10 mt-2">
                            <div className="h-full rounded-full bg-gradient-to-r from-green-500 via-amber-500 to-red-500" style={{ width: `${priorityScore * 100}%` }} />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="text-xs text-muted">Threshold</p>
                        <p className="text-lg font-semibold">RUL &lt; 40h OR Fault &gt; 75%</p>
                        <p className="text-xs text-gray-500">Based on domain-specific thresholds</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-xs text-muted">Suggested Maintenance Window</p>
                        <p className="text-lg font-semibold text-amber-400">Within {daysUntilMaint} days</p>
                        <p className="text-xs text-gray-500">Based on RUL forecast trajectory</p>
                    </div>
                    <div className="flex items-end">
                        <button className="w-full px-4 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                            <Wrench size={16} />
                            Generate Work Order
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function InfoRow({ label, value }) {
    return (
        <div>
            <span className="text-xs text-muted">{label}</span>
            <p className="text-sm text-gray-200 font-medium">{value}</p>
        </div>
    );
}

function MetricBox({ icon: Icon, label, value, color }) {
    return (
        <div className="bg-white/[0.03] rounded-xl p-4 border border-white/5 text-center min-w-[110px]">
            <Icon size={20} className={`mx-auto mb-1 ${color}`} />
            <div className={`text-2xl font-bold ${color}`}>{value}</div>
            <div className="text-[11px] text-muted mt-0.5">{label}</div>
        </div>
    );
}
