import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../data/mockData";
import StatusBadge from "../components/ui/StatusBadge";
import FilterBar from "../components/ui/FilterBar";
import { ArrowUpDown } from "lucide-react";

const COLS = [
    { key: "name", label: "Asset ID" },
    { key: "domain", label: "Domain" },
    { key: "site", label: "Site" },
    { key: "status", label: "Status" },
    { key: "healthIndex", label: "Health", numeric: true },
    { key: "rul", label: "RUL (hrs)", numeric: true },
    { key: "faultProb", label: "Fault %", numeric: true },
    { key: "lastUpdated", label: "Last Updated" },
    { key: "riskScore", label: "Risk" },
];

export default function AssetsPage() {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [domainFilter, setDomainFilter] = useState("");
    const [riskFilter, setRiskFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [sort, setSort] = useState({ key: "rul", dir: "asc" });

    const filtered = useMemo(() => {
        let list = [...assets];
        if (search) list = list.filter((a) => a.name.toLowerCase().includes(search.toLowerCase()) || a.id.toLowerCase().includes(search.toLowerCase()));
        if (domainFilter) list = list.filter((a) => a.domain === domainFilter);
        if (riskFilter) list = list.filter((a) => a.riskScore === riskFilter);
        if (statusFilter) list = list.filter((a) => a.status === statusFilter);
        list.sort((a, b) => {
            const av = a[sort.key], bv = b[sort.key];
            const cmp = typeof av === "number" ? av - bv : String(av).localeCompare(String(bv));
            return sort.dir === "asc" ? cmp : -cmp;
        });
        return list;
    }, [search, domainFilter, riskFilter, statusFilter, sort]);

    const toggleSort = (key) =>
        setSort((s) => ({ key, dir: s.key === key && s.dir === "asc" ? "desc" : "asc" }));

    return (
        <div className="space-y-6 animate-fade-in">
            <FilterBar
                searchPlaceholder="Search assets..."
                searchValue={search}
                onSearchChange={setSearch}
                filters={[
                    { label: "All Domains", value: domainFilter, options: ["Aerospace", "Automotive", "Manufacturing"], onChange: setDomainFilter },
                    { label: "All Risk", value: riskFilter, options: ["Critical", "High", "Medium", "Low"], onChange: setRiskFilter },
                    { label: "All Status", value: statusFilter, options: ["Online", "Offline"], onChange: setStatusFilter },
                ]}
            />

            <div className="bg-panel rounded-xl border border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/5">
                                {COLS.map((col) => (
                                    <th
                                        key={col.key}
                                        onClick={() => toggleSort(col.key)}
                                        className="text-left px-4 py-3.5 text-xs font-medium text-muted cursor-pointer hover:text-gray-300 transition-colors select-none"
                                    >
                                        <div className="flex items-center gap-1">
                                            {col.label}
                                            <ArrowUpDown size={12} className={sort.key === col.key ? "text-primary" : "opacity-30"} />
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((a) => (
                                <tr
                                    key={a.id}
                                    onClick={() => navigate(`/assets/${a.id}`)}
                                    className="border-b border-white/[0.03] hover:bg-white/[0.04] cursor-pointer transition-colors"
                                >
                                    <td className="px-4 py-3 font-medium">{a.name}</td>
                                    <td className="px-4 py-3 text-gray-400">{a.domain}</td>
                                    <td className="px-4 py-3 text-gray-400">{a.site}</td>
                                    <td className="px-4 py-3"><StatusBadge value={a.status} /></td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-16 h-1.5 rounded-full bg-white/10 overflow-hidden">
                                                <div className="h-full rounded-full" style={{
                                                    width: `${a.healthIndex}%`,
                                                    background: a.healthIndex > 70 ? "#22c55e" : a.healthIndex > 40 ? "#f59e0b" : "#ef4444",
                                                }} />
                                            </div>
                                            <span className="text-xs text-gray-400">{a.healthIndex}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 font-semibold" style={{ color: a.rul < 50 ? "#ef4444" : a.rul < 150 ? "#f59e0b" : "#e5e7eb" }}>{a.rul}</td>
                                    <td className="px-4 py-3 text-gray-300">{(a.faultProb * 100).toFixed(1)}%</td>
                                    <td className="px-4 py-3 text-xs text-gray-500">{new Date(a.lastUpdated).toLocaleDateString()}</td>
                                    <td className="px-4 py-3"><StatusBadge value={a.riskScore} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="px-4 py-3 text-xs text-muted border-t border-white/5">
                    Showing {filtered.length} of {assets.length} assets
                </div>
            </div>
        </div>
    );
}
