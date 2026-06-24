import { useState } from "react";
import { Database, ChevronDown, ChevronUp } from "lucide-react";
import { datasets } from "../data/mockData";
import StatusBadge from "../components/ui/StatusBadge";
import FilterBar from "../components/ui/FilterBar";

export default function DatasetsPage() {
    const [search, setSearch] = useState("");
    const [domainFilter, setDomainFilter] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [expanded, setExpanded] = useState(null);

    const filtered = datasets.filter((d) => {
        if (search && !d.name.toLowerCase().includes(search.toLowerCase())) return false;
        if (domainFilter && d.domain !== domainFilter) return false;
        if (typeFilter && d.type !== typeFilter) return false;
        return true;
    });

    return (
        <div className="space-y-6 animate-fade-in">
            <FilterBar
                searchPlaceholder="Search datasets..."
                searchValue={search}
                onSearchChange={setSearch}
                filters={[
                    { label: "All Domains", value: domainFilter, options: ["Aerospace", "Automotive", "Manufacturing"], onChange: setDomainFilter },
                    { label: "All Types", value: typeFilter, options: ["Baseline", "Realistic"], onChange: setTypeFilter },
                ]}
            />

            <div className="bg-panel rounded-xl border border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="text-left px-4 py-3.5 text-xs font-medium text-muted w-8"></th>
                                <th className="text-left px-4 py-3.5 text-xs font-medium text-muted">Name</th>
                                <th className="text-left px-4 py-3.5 text-xs font-medium text-muted">Domain</th>
                                <th className="text-left px-4 py-3.5 text-xs font-medium text-muted">Type</th>
                                <th className="text-center px-4 py-3.5 text-xs font-medium text-muted">Sensors</th>
                                <th className="text-center px-4 py-3.5 text-xs font-medium text-muted">Sampling</th>
                                <th className="text-center px-4 py-3.5 text-xs font-medium text-muted">Missing %</th>
                                <th className="text-left px-4 py-3.5 text-xs font-medium text-muted">Regime</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((d) => (
                                <TableRowGroup key={d.id} dataset={d} expanded={expanded === d.id} onToggle={() => setExpanded(expanded === d.id ? null : d.id)} />
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="px-4 py-3 text-xs text-muted border-t border-white/5">
                    {filtered.length} datasets
                </div>
            </div>
        </div>
    );
}

function TableRowGroup({ dataset: d, expanded, onToggle }) {
    return (
        <>
            <tr onClick={onToggle} className="border-b border-white/[0.03] hover:bg-white/[0.04] cursor-pointer transition-colors">
                <td className="px-4 py-3">
                    {expanded ? <ChevronUp size={14} className="text-gray-500" /> : <ChevronDown size={14} className="text-gray-500" />}
                </td>
                <td className="px-4 py-3 font-medium">
                    <div className="flex items-center gap-2">
                        <Database size={14} className="text-primary opacity-60" />
                        {d.name}
                    </div>
                </td>
                <td className="px-4 py-3 text-gray-400">{d.domain}</td>
                <td className="px-4 py-3"><StatusBadge value={d.type} /></td>
                <td className="px-4 py-3 text-center text-gray-300">{d.sensors}</td>
                <td className="px-4 py-3 text-center text-gray-400 text-xs">{d.samplingFreq}</td>
                <td className="px-4 py-3 text-center">
                    <span className={d.missingPct > 0 ? "text-amber-400 font-semibold" : "text-green-400"}>
                        {d.missingPct}%
                    </span>
                </td>
                <td className="px-4 py-3 text-gray-400 text-xs">{d.regimeDiversity}</td>
            </tr>
            {expanded && (
                <tr className="bg-white/[0.02]">
                    <td colSpan={8} className="px-8 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm animate-slide-up">
                            <div className="bg-white/[0.03] rounded-lg p-3 border border-white/5">
                                <span className="text-xs text-muted">Distribution Shift</span>
                                <p className="mt-1 text-gray-200">{d.distributionShift || "None"}</p>
                            </div>
                            <div className="bg-white/[0.03] rounded-lg p-3 border border-white/5">
                                <span className="text-xs text-muted">Lifecycle Truncation</span>
                                <p className="mt-1 text-gray-200">{d.truncationInfo}</p>
                            </div>
                            <div className="bg-white/[0.03] rounded-lg p-3 border border-white/5">
                                <span className="text-xs text-muted">Dataset ID</span>
                                <p className="mt-1 text-gray-200 font-mono">{d.id}</p>
                            </div>
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
}
