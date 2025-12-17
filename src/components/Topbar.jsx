import { CalendarDays } from "lucide-react";

export default function Topbar() {
  return (
    <header className="h-[72px] bg-topbar px-6 flex items-center justify-between border-b border-white/5">
      <div>
        <div className="text-lg font-semibold">Predictive Maintenance Dashboard</div>
        <div className="text-xs text-muted">Live system overview</div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10">
          <CalendarDays size={16} className="text-muted" />
          <span className="text-xs text-gray-200">Aug 1, 2025 – Sep 1, 2025</span>
        </div>

        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-xs text-gray-200">Live Streaming</span>
        </div>
      </div>
    </header>
  );
}
