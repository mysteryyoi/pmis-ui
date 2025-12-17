import {
  LayoutDashboard,
  Activity,
  TrendingUp,
  AlertCircle,
  Wrench,
  Brain,
  Database,
  Settings,
} from "lucide-react";

const items = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: Activity, label: "Asset Health" },
  { icon: TrendingUp, label: "Predictions" },
  { icon: AlertCircle, label: "Alerts" },
  { icon: Wrench, label: "Maintenance" },
  { icon: Brain, label: "Models" },
  { icon: Database, label: "Datasets" },
  { icon: Settings, label: "Settings" },
];

export default function Sidebar() {
  return (
    <aside className="w-[260px] bg-sidebar h-full p-6 flex flex-col gap-6 border-r border-white/5">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10" />
        <div>
          <div className="text-lg font-semibold leading-tight">PMIS</div>
          <div className="text-xs text-muted">Predictive Maintenance</div>
        </div>
      </div>

      <nav className="space-y-2">
        {items.map(({ icon: Icon, label, active }) => (
          <div
            key={label}
            className={[
              "flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer",
              "transition-colors",
              active
                ? "bg-primary/15 text-primary border border-primary/20"
                : "text-gray-300 hover:bg-white/5 hover:text-gray-100",
            ].join(" ")}
          >
            <Icon size={18} />
            <span className="text-sm">{label}</span>
          </div>
        ))}
      </nav>

      <div className="mt-auto text-xs text-muted">
        v1.0 • Local Dashboard
      </div>
    </aside>
  );
}
