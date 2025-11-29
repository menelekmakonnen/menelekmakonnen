function RandomBars() {
  const bars = Array.from({ length: 20 }, () => Math.random());
  return (
    <div className="flex h-24 items-end gap-1 overflow-hidden">
      {bars.map((value, idx) => (
        <div
          key={idx}
          className="w-3 rounded-t bg-gradient-to-t from-cyan-500 to-emerald-300"
          style={{ height: `${Math.max(12, value * 100)}%` }}
        />
      ))}
    </div>
  );
}

export function OverlayBoxes({ overlays, onClose }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-20 p-6">
      <div className="flex flex-col gap-4">
        {overlays.histogram && (
          <div className="pointer-events-auto w-72 rounded-xl border border-slate-800 bg-slate-900/80 p-3 shadow-lg">
            <div className="mb-2 flex items-center justify-between text-xs text-slate-300">
              <span>Histogram</span>
              <button onClick={() => onClose('histogram')} className="text-cyan-300">×</button>
            </div>
            <RandomBars />
          </div>
        )}
        {overlays.waveform && (
          <div className="pointer-events-auto w-72 rounded-xl border border-slate-800 bg-slate-900/80 p-3 shadow-lg">
            <div className="mb-2 flex items-center justify-between text-xs text-slate-300">
              <span>Waveform</span>
              <button onClick={() => onClose('waveform')} className="text-cyan-300">×</button>
            </div>
            <RandomBars />
          </div>
        )}
      </div>
    </div>
  );
}
