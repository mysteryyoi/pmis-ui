export default function SystemHealth() {
  // Placeholder “chart” to match the look until we plug Recharts
  const bars = [34, 40, 38, 50, 46, 55, 52, 60, 54, 62, 58, 66];

  return (
    <section className="col-span-2 bg-panel rounded-xl p-5 border border-white/5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium">System Health Trends</h3>
        <div className="text-xs text-muted">
          Vibration • Temperature • Pressure
        </div>
      </div>

      <div className="h-56 flex items-end gap-2">
        {bars.map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-md bg-primary/25 border border-primary/20"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>

      <div className="mt-3 text-xs text-muted">
        (bakki model train ayitt)
      </div>
    </section>
  );
}