import { useState } from "react";
import { Wrench, Link2, AlertTriangle, Calendar, User, CheckCircle } from "lucide-react";
import { workOrders } from "../data/mockData";
import StatusBadge from "../components/ui/StatusBadge";
import FilterBar from "../components/ui/FilterBar";

export default function WorkOrdersPage() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [priorityFilter, setPriorityFilter] = useState("");

    const filtered = workOrders.filter((wo) => {
        if (search && !wo.id.toLowerCase().includes(search.toLowerCase()) && !wo.assetName.toLowerCase().includes(search.toLowerCase())) return false;
        if (statusFilter && wo.status !== statusFilter) return false;
        if (priorityFilter && wo.priority !== priorityFilter) return false;
        return true;
    });

    const stats = {
        total: workOrders.length,
        open: workOrders.filter((w) => w.status === "Open").length,
        inProgress: workOrders.filter((w) => w.status === "In Progress").length,
        completed: workOrders.filter((w) => w.status === "Completed").length,
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
                <StatCard label="Total Work Orders" value={stats.total} color="text-primary" />
                <StatCard label="Open" value={stats.open} color="text-blue-400" />
                <StatCard label="In Progress" value={stats.inProgress} color="text-amber-400" />
                <StatCard label="Completed" value={stats.completed} color="text-green-400" />
            </div>

            <FilterBar
                searchPlaceholder="Search work orders..."
                searchValue={search}
                onSearchChange={setSearch}
                filters={[
                    { label: "All Status", value: statusFilter, options: ["Open", "In Progress", "Completed"], onChange: setStatusFilter },
                    { label: "All Priority", value: priorityFilter, options: ["Critical", "High", "Medium", "Low"], onChange: setPriorityFilter },
                ]}
            />

            <div className="bg-panel rounded-xl border border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="text-left px-4 py-3.5 text-xs font-medium text-muted">WO ID</th>
                                <th className="text-left px-4 py-3.5 text-xs font-medium text-muted">Asset</th>
                                <th className="text-left px-4 py-3.5 text-xs font-medium text-muted">Priority</th>
                                <th className="text-left px-4 py-3.5 text-xs font-medium text-muted">Due Date</th>
                                <th className="text-left px-4 py-3.5 text-xs font-medium text-muted">Status</th>
                                <th className="text-left px-4 py-3.5 text-xs font-medium text-muted">Assigned</th>
                                <th className="text-left px-4 py-3.5 text-xs font-medium text-muted">Linked Alert</th>
                                <th className="text-center px-4 py-3.5 text-xs font-medium text-muted">Decision Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((wo) => {
                                const isDue = new Date(wo.dueDate) < new Date(Date.now() + 86400000 * 3);
                                return (
                                    <tr key={wo.id} className="border-b border-white/[0.03] hover:bg-white/[0.04] transition-colors">
                                        <td className="px-4 py-3 font-mono text-xs text-primary">{wo.id}</td>
                                        <td className="px-4 py-3 font-medium">{wo.assetName}</td>
                                        <td className="px-4 py-3"><StatusBadge value={wo.priority} /></td>
                                        <td className="px-4 py-3">
                                            <span className={`text-sm ${isDue ? "text-red-400 font-semibold" : "text-gray-300"}`}>
                                                {wo.dueDate}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3"><StatusBadge value={wo.status} /></td>
                                        <td className="px-4 py-3 text-gray-400 flex items-center gap-1.5">
                                            <User size={14} className="text-gray-600" />
                                            {wo.assignedTo}
                                        </td>
                                        <td className="px-4 py-3">
                                            {wo.linkedAlertId ? (
                                                <span className="text-xs text-primary font-mono flex items-center gap-1">
                                                    <Link2 size={12} /> {wo.linkedAlertId}
                                                </span>
                                            ) : (
                                                <span className="text-gray-600 text-xs">–</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <div className="inline-flex items-center gap-2">
                                                <div className="w-16 h-1.5 rounded-full bg-white/10 overflow-hidden">
                                                    <div
                                                        className="h-full rounded-full"
                                                        style={{
                                                            width: `${wo.decisionScore * 100}%`,
                                                            background: wo.decisionScore > 0.8 ? "#ef4444" : wo.decisionScore > 0.6 ? "#f59e0b" : "#22c55e",
                                                        }}
                                                    />
                                                </div>
                                                <span className="text-xs font-semibold text-gray-300">{wo.decisionScore.toFixed(2)}</span>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <div className="px-4 py-3 text-xs text-muted border-t border-white/5">{filtered.length} work orders</div>
            </div>
        </div>
    );
}

function StatCard({ label, value, color }) {
    return (
        <div className="bg-panel rounded-xl p-4 border border-white/5">
            <p className="text-xs text-muted mb-1">{label}</p>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
        </div>
    );
}
