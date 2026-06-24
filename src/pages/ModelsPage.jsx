import { useState } from "react";
import { Brain, CheckCircle, Clock, GitCommit, Layers, Zap } from "lucide-react";
import { models } from "../data/mockData";
import StatusBadge from "../components/ui/StatusBadge";
import Modal from "../components/ui/Modal";
import FilterBar from "../components/ui/FilterBar";

export default function ModelsPage() {
    const [search, setSearch] = useState("");
    const [domainFilter, setDomainFilter] = useState("");
    const [taskFilter, setTaskFilter] = useState("");
    const [selected, setSelected] = useState(null);

    const filtered = models.filter((m) => {
        if (search && !m.name.toLowerCase().includes(search.toLowerCase()) && !m.id.toLowerCase().includes(search.toLowerCase())) return false;
        if (domainFilter && m.domain !== domainFilter) return false;
        if (taskFilter && m.task !== taskFilter) return false;
        return true;
    });

    return (
        <div className="space-y-6 animate-fade-in">
            <FilterBar
                searchPlaceholder="Search models..."
                searchValue={search}
                onSearchChange={setSearch}
                filters={[
                    { label: "All Domains", value: domainFilter, options: ["Aerospace", "Automotive", "Manufacturing"], onChange: setDomainFilter },
                    { label: "All Tasks", value: taskFilter, options: ["RUL", "Fault"], onChange: setTaskFilter },
                ]}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map((m) => (
                    <div
                        key={m.id}
                        onClick={() => setSelected(m)}
                        className="bg-panel rounded-xl p-5 border border-white/5 hover:border-primary/20 cursor-pointer transition-all duration-200 group relative"
                    >
                        {m.active && (
                            <div className="absolute top-3 right-3">
                                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/15 border border-green-500/25 text-green-400 text-[10px] font-semibold">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-400" /> Active
                                </span>
                            </div>
                        )}

                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                <Brain size={20} className="text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold">{m.name}</h3>
                                <p className="text-xs text-muted">{m.version} • {m.domain}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                                <span className="text-xs text-muted">Task</span>
                                <p><StatusBadge value={m.task} /></p>
                            </div>
                            <div>
                                <span className="text-xs text-muted">Dataset</span>
                                <p className="text-gray-300 text-xs mt-1 truncate">{m.dataset}</p>
                            </div>
                            <div>
                                <span className="text-xs text-muted">{m.task === "RUL" ? "RMSE" : "F1"}</span>
                                <p className="font-semibold text-primary">{m.task === "RUL" ? m.metrics.rmse : m.metrics.f1}</p>
                            </div>
                            <div>
                                <span className="text-xs text-muted">{m.task === "RUL" ? "NASA Score" : "AUC"}</span>
                                <p className="font-semibold text-cyan-400">{m.task === "RUL" ? m.metrics.nasaScore : m.metrics.auc}</p>
                            </div>
                        </div>

                        <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-gray-500">
                            <span className="flex items-center gap-1"><GitCommit size={12} />{m.gitHash}</span>
                            <span>Seed σ: ±{m.seedVariance}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Model Detail Modal */}
            <Modal open={!!selected} onClose={() => setSelected(null)} title={`${selected?.name} ${selected?.version}`} wide>
                {selected && <ModelDetail model={selected} />}
            </Modal>
        </div>
    );
}

function ModelDetail({ model: m }) {
    return (
        <div className="space-y-6">
            {/* Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <DetailCard label="Domain" value={m.domain} />
                <DetailCard label="Task" value={m.task} />
                <DetailCard label="Dataset" value={m.dataset} />
                <DetailCard label="Last Trained" value={m.lastTrained} />
            </div>

            {/* Metrics */}
            <div>
                <h4 className="text-sm font-medium mb-3 flex items-center gap-2"><Zap size={14} className="text-amber-400" /> Metrics</h4>
                <div className="grid grid-cols-4 gap-3">
                    {Object.entries(m.metrics).filter(([, v]) => v !== null).map(([k, v]) => (
                        <div key={k} className="bg-white/[0.03] rounded-lg p-3 border border-white/5 text-center">
                            <div className="text-xs text-muted uppercase">{k}</div>
                            <div className="text-xl font-bold text-primary mt-1">{v}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Hyperparameters */}
            <div>
                <h4 className="text-sm font-medium mb-3 flex items-center gap-2"><Layers size={14} className="text-primary" /> Hyperparameters</h4>
                <div className="bg-white/[0.03] rounded-lg p-4 border border-white/5 grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                    {Object.entries(m.hyperparams).map(([k, v]) => (
                        <div key={k}>
                            <span className="text-xs text-muted">{k}</span>
                            <p className="font-mono text-gray-300">{JSON.stringify(v)}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Multi-seed stats */}
            <div>
                <h4 className="text-sm font-medium mb-3">Multi-Seed Statistics</h4>
                <div className="bg-white/[0.03] rounded-lg p-4 border border-white/5 text-sm space-y-2">
                    {Object.entries(m.multiSeedStats).map(([k, v]) => (
                        <div key={k} className="flex items-center justify-between">
                            <span className="text-muted">{k}</span>
                            <span className="font-mono text-gray-200">{Array.isArray(v) ? v.join(", ") : v}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Training Data + Git */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/[0.03] rounded-lg p-4 border border-white/5">
                    <p className="text-xs text-muted mb-1">Training Data</p>
                    <p className="text-sm">{m.trainDataInfo}</p>
                </div>
                <div className="bg-white/[0.03] rounded-lg p-4 border border-white/5">
                    <p className="text-xs text-muted mb-1">Git Commit Hash</p>
                    <p className="text-sm font-mono">{m.gitHash}</p>
                </div>
            </div>

            {/* Promote Button */}
            {!m.active && (
                <button className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors shadow-lg shadow-primary/20 flex items-center gap-2">
                    <CheckCircle size={16} />
                    Promote to Production
                </button>
            )}
            {m.active && (
                <div className="px-4 py-3 bg-green-500/10 border border-green-500/20 rounded-lg text-sm text-green-400 flex items-center gap-2">
                    <CheckCircle size={16} />
                    This model is currently in production
                </div>
            )}
        </div>
    );
}

function DetailCard({ label, value }) {
    return (
        <div className="bg-white/[0.03] rounded-lg p-3 border border-white/5">
            <span className="text-xs text-muted">{label}</span>
            <p className="text-sm font-medium mt-0.5">{value}</p>
        </div>
    );
}
