import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { AlertTriangle, Clock, User, FileText } from "lucide-react";
import { alerts, assets, generateHealthTimeline } from "../data/mockData";
import StatusBadge from "../components/ui/StatusBadge";
import FilterBar from "../components/ui/FilterBar";
import Modal from "../components/ui/Modal";

export default function AlertsPage() {
    const [search, setSearch] = useState("");
    const [sevFilter, setSevFilter] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [selected, setSelected] = useState(null);

    const filtered = alerts.filter((a) => {
        if (search && !a.assetName.toLowerCase().includes(search.toLowerCase()) && !a.id.toLowerCase().includes(search.toLowerCase())) return false;
        if (sevFilter && a.severity !== sevFilter) return false;
        if (typeFilter && a.type !== typeFilter) return false;
        if (statusFilter && a.status !== statusFilter) return false;
        return true;
    });

    return (
        <div className="space-y-6 animate-fade-in">
            <FilterBar
                searchPlaceholder="Search alerts..."
                searchValue={search}
                onSearchChange={setSearch}
                filters={[
                    { label: "All Severity", value: sevFilter, options: ["Critical", "High", "Medium", "Low"], onChange: setSevFilter },
                    { label: "All Types", value: typeFilter, options: ["RUL Below Threshold", "Fault Probability Exceeded", "Anomaly Burst", "Missing Telemetry"], onChange: setTypeFilter },
                    { label: "All Status", value: statusFilter, options: ["Open", "Acknowledged", "Closed"], onChange: setStatusFilter },
                ]}
            />

            <div className="bg-panel rounded-xl border border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="text-left px-4 py-3.5 text-xs font-medium text-muted">Alert ID</th>
                                <th className="text-left px-4 py-3.5 text-xs font-medium text-muted">Asset</th>
                                <th className="text-left px-4 py-3.5 text-xs font-medium text-muted">Type</th>
                                <th className="text-left px-4 py-3.5 text-xs font-medium text-muted">Severity</th>
                                <th className="text-left px-4 py-3.5 text-xs font-medium text-muted">Created</th>
                                <th className="text-left px-4 py-3.5 text-xs font-medium text-muted">Status</th>
                                <th className="text-left px-4 py-3.5 text-xs font-medium text-muted">Assigned</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((al) => (
                                <tr
                                    key={al.id}
                                    onClick={() => setSelected(al)}
                                    className="border-b border-white/[0.03] hover:bg-white/[0.04] cursor-pointer transition-colors"
                                >
                                    <td className="px-4 py-3 text-gray-400 font-mono text-xs">{al.id}</td>
                                    <td className="px-4 py-3 font-medium">{al.assetName}</td>
                                    <td className="px-4 py-3 text-gray-400 text-xs">{al.type}</td>
                                    <td className="px-4 py-3"><StatusBadge value={al.severity} /></td>
                                    <td className="px-4 py-3 text-xs text-gray-500">{new Date(al.createdAt).toLocaleString()}</td>
                                    <td className="px-4 py-3"><StatusBadge value={al.status} /></td>
                                    <td className="px-4 py-3 text-gray-400 text-sm">{al.assignedTo}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="px-4 py-3 text-xs text-muted border-t border-white/5">
                    {filtered.length} alerts
                </div>
            </div>

            {/* Alert Detail Modal */}
            <Modal open={!!selected} onClose={() => setSelected(null)} title={`Alert ${selected?.id || ""}`} wide>
                {selected && <AlertDetail alert={selected} />}
            </Modal>
        </div>
    );
}

function AlertDetail({ alert }) {
    const asset = assets.find((a) => a.id === alert.assetId) || assets[0];
    const healthData = generateHealthTimeline(asset.id).slice(-20);

    return (
        <div className="space-y-6">
            {/* Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <InfoCard icon={AlertTriangle} label="Severity" value={alert.severity} badge />
                <InfoCard icon={Clock} label="Created" value={new Date(alert.createdAt).toLocaleString()} />
                <InfoCard icon={User} label="Assigned To" value={alert.assignedTo} />
                <InfoCard icon={FileText} label="Status" value={alert.status} badge />
            </div>

            {/* Trigger */}
            <div className="bg-white/[0.03] rounded-lg p-4 border border-white/5">
                <p className="text-xs text-muted mb-1">Trigger Condition</p>
                <p className="text-sm">{alert.triggerCondition}</p>
            </div>
            <div className="bg-white/[0.03] rounded-lg p-4 border border-white/5">
                <p className="text-xs text-muted mb-1">Evidence Snapshot</p>
                <p className="text-sm">{alert.evidence}</p>
            </div>

            {/* Chart at trigger time */}
            <div>
                <h4 className="text-sm font-medium mb-3">Health at Trigger Time</h4>
                <ResponsiveContainer width="100%" height={180}>
                    <AreaChart data={healthData}>
                        <defs>
                            <linearGradient id="gradAlert" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#ef4444" stopOpacity={0.3} />
                                <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="time" tickFormatter={(t) => new Date(t).toLocaleTimeString([], { hour: "2-digit" })} tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
                        <YAxis domain={[0, 100]} tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} itemStyle={{ color: "#e5e7eb" }} labelFormatter={(t) => new Date(t).toLocaleString()} />
                        <Area type="monotone" dataKey="healthIndex" stroke="#ef4444" fill="url(#gradAlert)" strokeWidth={2} name="Health" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Notes */}
            {alert.notes && (
                <div className="bg-white/[0.03] rounded-lg p-4 border border-white/5">
                    <p className="text-xs text-muted mb-1">Notes</p>
                    <p className="text-sm">{alert.notes}</p>
                </div>
            )}
        </div>
    );
}

function InfoCard({ icon: Icon, label, value, badge }) {
    return (
        <div className="bg-white/[0.03] rounded-lg p-3 border border-white/5">
            <div className="flex items-center gap-1.5 mb-1">
                <Icon size={14} className="text-gray-500" />
                <span className="text-xs text-muted">{label}</span>
            </div>
            {badge ? <StatusBadge value={value} /> : <p className="text-sm font-medium">{value}</p>}
        </div>
    );
}
