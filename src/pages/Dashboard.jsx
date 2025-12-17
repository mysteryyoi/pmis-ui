import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import KpiCard from "../components/KpiCard";
import SystemHealth from "../components/SystemHealth";
import ModelStatus from "../components/ModelStatus";
import AssetsTable from "../components/AssetsTable";

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-bg text-gray-200">
      {/* LEFT */}
      <Sidebar />

      {/* RIGHT */}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />

        <main className="p-6 space-y-6 overflow-y-auto">
          {/* KPI ROW */}
          <div className="grid grid-cols-4 gap-6">
            <KpiCard title="Machines Monitored" value="128" variant="primary" />
            <KpiCard title="Active Faults" value="6" variant="danger" />
            <KpiCard title="Avg RUL (hrs)" value="184" variant="warning" />
            <KpiCard title="Downtime Avoided" value="23%" variant="success" />
          </div>

          {/* CHART + MODEL */}
          <div className="grid grid-cols-3 gap-6">
            <SystemHealth />
            <ModelStatus />
          </div>

          {/* TABLE */}
          <AssetsTable />
        </main>
      </div>
    </div>
  );
}
