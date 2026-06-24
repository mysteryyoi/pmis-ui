import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const PAGE_META = {
    "/": { title: "Overview Dashboard", subtitle: "Real-time fleet-level awareness" },
    "/assets": { title: "Asset Inventory", subtitle: "Monitor and inspect fleet assets" },
    "/predictions": { title: "Predictions", subtitle: "RUL forecasts & fault diagnosis" },
    "/alerts": { title: "Alerts", subtitle: "Operational decision interface" },
    "/models": { title: "Model Registry", subtitle: "Version control & performance tracking" },
    "/evaluation": { title: "Evaluation", subtitle: "Cross-domain model evaluation" },
    "/datasets": { title: "Dataset Registry", subtitle: "Training & evaluation data catalog" },
    "/runs": { title: "Runs & Experiments", subtitle: "Reproducibility tracking" },
    "/work-orders": { title: "Work Orders", subtitle: "Maintenance task management" },
};

export default function Layout() {
    const { pathname } = useLocation();
    const basePath = "/" + (pathname.split("/")[1] || "");
    const meta = PAGE_META[basePath] || PAGE_META["/"];

    return (
        <div className="flex h-screen bg-bg text-gray-200 overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <Topbar title={meta.title} subtitle={meta.subtitle} />
                <main className="flex-1 p-6 overflow-y-auto custom-scrollbar">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
