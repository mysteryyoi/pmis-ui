const rows = [
  { machine: "Motor-02", health: "🔴", rul: "32h", risk: "High", fault: "Bearing Wear" },
  { machine: "Pump-03", health: "🟡", rul: "90h", risk: "Medium", fault: "Cavitation Risk" },
  { machine: "Fan-01", health: "🟢", rul: "240h", risk: "Low", fault: "Normal" },
];

function RiskPill({ risk }) {
  const cls =
    risk === "High"
      ? "bg-red-500/15 text-red-300 border-red-500/25"
      : risk === "Medium"
      ? "bg-yellow-500/15 text-yellow-200 border-yellow-500/25"
      : "bg-green-500/15 text-green-300 border-green-500/25";

  return (
    <span className={`px-2 py-1 rounded-md border text-xs ${cls}`}>{risk}</span>
  );
}

export default function AssetsTable() {
  return (
    <section className="bg-panel rounded-xl p-5 border border-white/5">
      <h3 className="font-medium mb-4">Assets Overview</h3>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-muted border-b border-white/10">
            <tr>
              <th className="text-left py-3 font-medium">Machine</th>
              <th className="text-center py-3 font-medium">Health</th>
              <th className="text-center py-3 font-medium">RUL</th>
              <th className="text-center py-3 font-medium">Risk</th>
              <th className="text-left py-3 font-medium">Fault</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((r) => (
              <tr
                key={r.machine}
                className="border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors"
              >
                <td className="py-3">{r.machine}</td>
                <td className="text-center py-3">{r.health}</td>
                <td className="text-center py-3">{r.rul}</td>
                <td className="text-center py-3">
                  <RiskPill risk={r.risk} />
                </td>
                <td className="py-3">{r.fault}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
