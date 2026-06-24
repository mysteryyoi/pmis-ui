import { useState } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { AlertTriangle, ArrowDown, ArrowUp, Activity, Cpu, Clock, Shield, Database, Brain } from "lucide-react";
import { assets, alerts, getKpis, getFleetRiskDistribution, models, generateHealthTimeline } from "../data/mockData";
import StatusBadge from "../components/ui/StatusBadge";

const DOMAIN_OPTIONS = ["All", "Aerospace", "Automotive", "Manufacturing"];

export default function Dashboard() {
  const [domain, setDomain] = useState("All");
  const kpis = getKpis(domain);
  const riskDist = getFleetRiskDistribution(domain);

  const filtered = domain === "All" ? assets : assets.filter((a) => a.domain === domain);
  const criticalAssets = [...filtered].sort((a, b) => a.rul - b.rul).slice(0, 5);
  const highFaultAssets = [...filtered].sort((a, b) => b.faultProb - a.faultProb).slice(0, 5);
  const recentAlerts = alerts.slice(0, 8);

  // Sparkline-style health data
  const trendData = generateHealthTimeline(filtered[0]?.id).slice(-24).map((p, i) => ({
    t: i,
    health: p.healthIndex,
    vibration: p.vibration,
    temp: p.temperature,
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Domain Filter */}
      <div className="flex gap-2">
        {DOMAIN_OPTIONS.map((d) => (
          <button
            key={d}
            onClick={() => setDomain(d)}
            className={[
              "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
              domain === d
                ? "bg-primary text-white shadow-lg shadow-primary/25"
                : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-gray-200 border border-white/5",
            ].join(" ")}
          >
            {d}
          </button>
        ))}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KpiCard icon={Cpu} title="Total Assets" value={kpis.totalAssets} variant="primary" />
        <KpiCard icon={AlertTriangle} title="Critical Risk" value={kpis.criticalRisk} variant="danger" />
        <KpiCard icon={Clock} title="Avg RUL (hrs)" value={kpis.avgRul} variant="warning" />
        <KpiCard icon={Brain} title="Active Model" value={`${kpis.activeModelName} ${kpis.activeModelVersion}`} variant="info" small />
        <KpiCard icon={Activity} title="Model RMSE" value={kpis.modelRmse} variant="accent" />
        <KpiCard icon={Database} title="Dataset" value={kpis.datasetSource} variant="secondary" small />
      </div>

      {/* Row: Fleet Risk Pie + System Health Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fleet Risk Distribution */}
        <div className="bg-panel rounded-xl p-5 border border-white/5">
          <h3 className="font-medium mb-4 flex items-center gap-2">
            <Shield size={16} className="text-primary" />
            Fleet Risk Distribution
          </h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={riskDist}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                >
                  {riskDist.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 13 }}
                  itemStyle={{ color: "#e5e7eb" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-5 mt-2">
            {riskDist.map((r) => (
              <div key={r.name} className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: r.color }} />
                <span className="text-gray-400">{r.name}</span>
                <span className="font-semibold text-gray-200">{r.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* System Health Trends */}
        <div className="lg:col-span-2 bg-panel rounded-xl p-5 border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium flex items-center gap-2">
              <Activity size={16} className="text-primary" />
              System Health Trends
            </h3>
            <div className="text-xs text-muted">Last 24 hours</div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="gradHealth" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradVib" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="t" hide />
              <YAxis hide domain={[0, 100]} />
              <Tooltip
                contentStyle={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 13 }}
                itemStyle={{ color: "#e5e7eb" }}
              />
              <Area type="monotone" dataKey="health" stroke="#3B82F6" fill="url(#gradHealth)" strokeWidth={2} name="Health Index" />
              <Area type="monotone" dataKey="vibration" stroke="#f59e0b" fill="url(#gradVib)" strokeWidth={1.5} name="Vibration" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row: Critical Assets + Alert Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Critical Assets */}
        <div className="bg-panel rounded-xl p-5 border border-white/5">
          <h3 className="font-medium mb-4 flex items-center gap-2">
            <AlertTriangle size={16} className="text-red-400" />
            Critical Assets
          </h3>
          <div className="space-y-1">
            <div className="grid grid-cols-5 text-xs text-muted py-2 border-b border-white/5 font-medium">
              <span>Asset</span><span>Domain</span><span className="text-center">RUL</span><span className="text-center">Fault %</span><span className="text-center">Risk</span>
            </div>
            {criticalAssets.map((a) => (
              <div key={a.id} className="grid grid-cols-5 text-sm py-2.5 border-b border-white/[0.03] hover:bg-white/[0.03] transition-colors">
                <span className="font-medium text-gray-200">{a.name}</span>
                <span className="text-gray-400">{a.domain}</span>
                <span className="text-center font-semibold text-red-400">{a.rul}h</span>
                <span className="text-center text-yellow-300">{(a.faultProb * 100).toFixed(0)}%</span>
                <span className="text-center"><StatusBadge value={a.riskScore} /></span>
              </div>
            ))}
          </div>
        </div>

        {/* Alert Feed */}
        <div className="bg-panel rounded-xl p-5 border border-white/5">
          <h3 className="font-medium mb-4 flex items-center gap-2">
            <AlertTriangle size={16} className="text-amber-400" />
            Recent Alerts
          </h3>
          <div className="space-y-2 max-h-[280px] overflow-y-auto custom-scrollbar pr-1">
            {recentAlerts.map((al) => (
              <div key={al.id} className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.05] transition-colors">
                <div className={`w-2 h-2 rounded-full shrink-0 ${al.severity === "Critical" ? "bg-red-500" :
                    al.severity === "High" ? "bg-orange-500" :
                      al.severity === "Medium" ? "bg-yellow-500" : "bg-green-500"
                  }`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-200 truncate">{al.assetName}</span>
                    <StatusBadge value={al.severity} />
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">{al.type}</p>
                </div>
                <span className="text-[11px] text-gray-600 shrink-0">
                  {new Date(al.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom: High-Fault Assets Bar Chart */}
      <div className="bg-panel rounded-xl p-5 border border-white/5">
        <h3 className="font-medium mb-4">Top Fault Probability Assets</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={highFaultAssets.map((a) => ({ name: a.name, prob: +(a.faultProb * 100).toFixed(1) }))}>
            <XAxis dataKey="name" tick={{ fill: "#94A3B8", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#94A3B8", fontSize: 12 }} axisLine={false} tickLine={false} domain={[0, 100]} />
            <Tooltip
              contentStyle={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 13 }}
              itemStyle={{ color: "#e5e7eb" }}
            />
            <Bar dataKey="prob" name="Fault %" radius={[6, 6, 0, 0]}>
              {highFaultAssets.map((a, i) => (
                <Cell key={i} fill={a.faultProb > 0.7 ? "#ef4444" : a.faultProb > 0.4 ? "#f59e0b" : "#22c55e"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/* ── KpiCard (inline for Dashboard) ──────────────────────────────────── */
function KpiCard({ icon: Icon, title, value, variant, small }) {
  const COLORS = {
    primary: { bar: "bg-blue-500", text: "text-blue-400" },
    danger: { bar: "bg-red-500", text: "text-red-400" },
    warning: { bar: "bg-amber-500", text: "text-amber-400" },
    success: { bar: "bg-green-500", text: "text-green-400" },
    info: { bar: "bg-cyan-500", text: "text-cyan-400" },
    accent: { bar: "bg-violet-500", text: "text-violet-400" },
    secondary: { bar: "bg-indigo-500", text: "text-indigo-400" },
  };
  const c = COLORS[variant] || COLORS.primary;

  return (
    <div className="relative bg-panel rounded-xl p-4 border border-white/5 group hover:border-white/10 transition-colors">
      <div className={`absolute bottom-0 left-0 h-0.5 w-full ${c.bar} rounded-b-xl opacity-60`} />
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs text-muted">{title}</p>
        <Icon size={16} className={`${c.text} opacity-70`} />
      </div>
      <div className={`${small ? "text-lg" : "text-2xl"} font-bold tracking-tight`}>{value}</div>
    </div>
  );
}
