const variants = {
    Critical: "bg-red-500/15 text-red-400 border-red-500/25",
    High: "bg-orange-500/15 text-orange-400 border-orange-500/25",
    Medium: "bg-yellow-500/15 text-yellow-300 border-yellow-500/25",
    Low: "bg-green-500/15 text-green-400 border-green-500/25",
    Open: "bg-blue-500/15 text-blue-400 border-blue-500/25",
    Acknowledged: "bg-purple-500/15 text-purple-400 border-purple-500/25",
    Closed: "bg-gray-500/15 text-gray-400 border-gray-500/25",
    Online: "bg-green-500/15 text-green-400 border-green-500/25",
    Offline: "bg-gray-500/15 text-gray-400 border-gray-500/25",
    "In Progress": "bg-amber-500/15 text-amber-400 border-amber-500/25",
    Completed: "bg-green-500/15 text-green-400 border-green-500/25",
    Baseline: "bg-cyan-500/15 text-cyan-400 border-cyan-500/25",
    Realistic: "bg-violet-500/15 text-violet-400 border-violet-500/25",
    RUL: "bg-blue-500/15 text-blue-400 border-blue-500/25",
    Fault: "bg-rose-500/15 text-rose-400 border-rose-500/25",
};

export default function StatusBadge({ value, className = "" }) {
    const cls = variants[value] || "bg-white/10 text-gray-300 border-white/10";
    return (
        <span className={`inline-flex px-2.5 py-1 rounded-md border text-xs font-medium ${cls} ${className}`}>
            {value}
        </span>
    );
}
