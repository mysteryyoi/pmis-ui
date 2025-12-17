import { Brain } from "lucide-react";

export default function ModelStatus() {
  return (
    <section className="bg-panel rounded-xl p-5 border border-white/5">
      <div className="flex items-center gap-2 mb-4">
        <Brain size={18} className="text-primary" />
        <h3 className="font-medium">Model Status</h3>
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted">Model</span>
          <span className="text-gray-200">LSTM-RUL v2.1</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-muted">Accuracy</span>
          <span className="text-green-400 font-semibold">96.2%</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-muted">RMSE</span>
          <span className="text-yellow-300 font-semibold">18.4 hrs</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-muted">Last Trained</span>
          <span className="text-gray-200">12-09-2025</span>
        </div>
      </div>
    </section>
  );
}
