import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Activity,
  TrendingUp,
  AlertCircle,
  Brain,
  Database,
  FlaskConical,
  ClipboardList,
  Wrench,
  Cog,
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", to: "/" },
  { icon: Activity, label: "Assets", to: "/assets" },
  { icon: TrendingUp, label: "Predictions", to: "/predictions" },
  { icon: AlertCircle, label: "Alerts", to: "/alerts" },
  { icon: Brain, label: "Models", to: "/models" },
  { icon: FlaskConical, label: "Evaluation", to: "/evaluation" },
  { icon: Database, label: "Datasets", to: "/datasets" },
  { icon: ClipboardList, label: "Runs", to: "/runs" },
  { icon: Wrench, label: "Work Orders", to: "/work-orders" },
];

export default function Sidebar() {
  return (
    <aside className="w-[260px] bg-sidebar h-full p-5 flex flex-col gap-6 border-r border-white/5 shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-3 px-2">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center shadow-lg shadow-primary/20">
          <Cog size={18} className="text-white" />
        </div>
        <div>
          <div className="text-lg font-bold leading-tight tracking-tight">PMIS</div>
          <div className="text-[11px] text-muted leading-tight">Predictive Maintenance</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="space-y-1 flex-1">
        {navItems.map(({ icon: Icon, label, to }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              [
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                isActive
                  ? "bg-primary/15 text-primary border border-primary/20 shadow-sm shadow-primary/10"
                  : "text-gray-400 hover:bg-white/5 hover:text-gray-200 border border-transparent",
              ].join(" ")
            }
          >
            <Icon size={18} className="shrink-0 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium">{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-2 py-3 rounded-lg bg-white/[0.03] border border-white/5">
        <div className="text-xs text-muted">PMIS v1.0</div>
        <div className="text-[11px] text-gray-600 mt-0.5">Framework-ready UI</div>
      </div>
    </aside>
  );
}
