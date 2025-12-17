import { Cpu, AlertTriangle, Clock, CheckCircle2 } from "lucide-react";

const variantMap = {
  primary: { bar: "bg-primary", icon: Cpu },
  danger: { bar: "bg-red-500", icon: AlertTriangle },
  warning: { bar: "bg-yellow-500", icon: Clock },
  success: { bar: "bg-green-500", icon: CheckCircle2 },
};

export default function KpiCard({ title, value, variant = "primary" }) {
  const cfg = variantMap[variant] ?? variantMap.primary;
  const Icon = cfg.icon;

  return (
    <div className="relative bg-panel rounded-xl p-5 border border-white/5">
      <div className={`absolute bottom-0 left-0 h-1 w-full ${cfg.bar} rounded-b-xl`} />
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">{title}</p>
        <Icon size={18} className="text-muted" />
      </div>
      <div className="text-3xl font-semibold mt-3">{value}</div>
    </div>
  );
}
