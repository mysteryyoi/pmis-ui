import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { ClipboardList, GitCommit, Calendar, Download } from "lucide-react";
import { runs } from "../data/mockData";
import StatusBadge from "../components/ui/StatusBadge";
import FilterBar from "../components/ui/FilterBar";
import Modal from "../components/ui/Modal";

export default function RunsPage() {
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState(null);

    const filtered = runs.filter((r) => {
        if (search && !r.id.toLowerCase().includes(search.toLowerCase()) && !r.modelName.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
    });

    return (
        <div className="space-y-6 animate-fade-in">
            <FilterBar searchPlaceholder="Search runs..." searchValue={search} onSearchChange={setSearch} filters={[]} />

            <div className="bg-panel rounded-xl border border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="text-left px-4 py-3.5 text-xs font-medium text-muted">Run ID</th>
                                <th className="text-left px-4 py-3.5 text-xs font-medium text-muted">Model</th>
                                <th className="text-left px-4 py-3.5 text-xs font-medium text-muted">Version</th>
                                <th className="text-left px-4 py-3.5 text-xs font-medium text-muted">Dataset</th>
                                <th className="text-center px-4 py-3.5 text-xs font-medium text-muted">Seed</th>
                                <th className="text-center px-4 py-3.5 text-xs font-medium text-muted">RMSE</th>
                                <th className="text-center px-4 py-3.5 text-xs font-medium text-muted">F1</th>
                                <th className="text-left px-4 py-3.5 text-xs font-medium text-muted">Git Hash</th>
                                <th className="text-left px-4 py-3.5 text-xs font-medium text-muted">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((r) => (
                                <tr key={r.id} onClick={() => setSelected(r)} className="border-b border-white/[0.03] hover:bg-white/[0.04] cursor-pointer transition-colors">
                                    <td className="px-4 py-3 font-mono text-xs text-primary">{r.id}</td>
                                    <td className="px-4 py-3 font-medium">{r.modelName}</td>
                                    <td className="px-4 py-3 text-gray-400">{r.modelVersion}</td>
                                    <td className="px-4 py-3 text-gray-400 text-xs">{r.dataset}</td>
                                    <td className="px-4 py-3 text-center font-mono text-gray-400">{r.seed}</td>
                                    <td className="px-4 py-3 text-center font-semibold">{r.metrics.rmse !== null ? <span className="text-blue-400">{r.metrics.rmse}</span> : <span className="text-gray-600">–</span>}</td>
                                    <td className="px-4 py-3 text-center font-semibold">{r.metrics.f1 !== null ? <span className="text-green-400">{r.metrics.f1}</span> : <span className="text-gray-600">–</span>}</td>
                                    <td className="px-4 py-3 font-mono text-xs text-gray-500 flex items-center gap-1"><GitCommit size={12} />{r.gitHash}</td>
                                    <td className="px-4 py-3 text-xs text-gray-500">{r.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="px-4 py-3 text-xs text-muted border-t border-white/5">{filtered.length} runs</div>
            </div>

            {/* Run Detail Modal */}
            <Modal open={!!selected} onClose={() => setSelected(null)} title={`Run ${selected?.id || ""}`} wide>
                {selected && <RunDetail run={selected} />}
            </Modal>
        </div>
    );
}

function RunDetail({ run }) {
    return (
        <div className="space-y-6">
            {/* Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <InfoBox label="Model" value={`${run.modelName} ${run.modelVersion}`} />
                <InfoBox label="Dataset" value={run.dataset} />
                <InfoBox label="Seed" value={run.seed} />
                <InfoBox label="Date" value={run.date} />
            </div>

            {/* Metrics */}
            <div>
                <h4 className="text-sm font-medium mb-3">Metrics</h4>
                <div className="grid grid-cols-4 gap-3">
                    {Object.entries(run.metrics).filter(([, v]) => v !== null).map(([k, v]) => (
                        <div key={k} className="bg-white/[0.03] rounded-lg p-3 border border-white/5 text-center">
                            <div className="text-xs text-muted uppercase">{k}</div>
                            <div className="text-xl font-bold text-primary mt-1">{v}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Loss Curve */}
            <div>
                <h4 className="text-sm font-medium mb-3">Loss Curve</h4>
                <ResponsiveContainer width="100%" height={260}>
                    <LineChart data={run.lossCurve}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="epoch" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} label={{ value: "Epoch", position: "insideBottom", offset: -5, fill: "#64748b", fontSize: 11 }} />
                        <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 13 }} itemStyle={{ color: "#e5e7eb" }} />
                        <Line type="monotone" dataKey="trainLoss" stroke="#3B82F6" strokeWidth={2} dot={false} name="Train Loss" />
                        <Line type="monotone" dataKey="valLoss" stroke="#f59e0b" strokeWidth={2} dot={false} name="Val Loss" />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Config */}
            <div>
                <h4 className="text-sm font-medium mb-3">Configuration</h4>
                <div className="bg-white/[0.03] rounded-lg p-4 border border-white/5 font-mono text-xs text-gray-300 overflow-x-auto">
                    <pre>{JSON.stringify(run.config, null, 2)}</pre>
                </div>
            </div>

            {/* Export */}
            <button className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                <Download size={16} />
                Export Report
            </button>
        </div>
    );
}

function InfoBox({ label, value }) {
    return (
        <div className="bg-white/[0.03] rounded-lg p-3 border border-white/5">
            <span className="text-xs text-muted">{label}</span>
            <p className="text-sm font-medium mt-0.5">{value}</p>
        </div>
    );
}
