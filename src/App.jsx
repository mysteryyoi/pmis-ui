import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import AssetsPage from "./pages/AssetsPage";
import AssetDetailPage from "./pages/AssetDetailPage";
import PredictionsPage from "./pages/PredictionsPage";
import AlertsPage from "./pages/AlertsPage";
import ModelsPage from "./pages/ModelsPage";
import EvaluationPage from "./pages/EvaluationPage";
import DatasetsPage from "./pages/DatasetsPage";
import RunsPage from "./pages/RunsPage";
import WorkOrdersPage from "./pages/WorkOrdersPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="assets" element={<AssetsPage />} />
          <Route path="assets/:id" element={<AssetDetailPage />} />
          <Route path="predictions" element={<PredictionsPage />} />
          <Route path="alerts" element={<AlertsPage />} />
          <Route path="models" element={<ModelsPage />} />
          <Route path="evaluation" element={<EvaluationPage />} />
          <Route path="datasets" element={<DatasetsPage />} />
          <Route path="runs" element={<RunsPage />} />
          <Route path="work-orders" element={<WorkOrdersPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
