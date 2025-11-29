import { Icon } from './Icon';

const toggles = [
  { key: 'histogram', label: 'Histogram', icon: 'ChartBarIcon' },
  { key: 'waveform', label: 'Waveform', icon: 'Squares2X2Icon' },
  { key: 'grid', label: 'Grid', icon: 'ViewfinderCircleIcon' },
  { key: 'cursor', label: 'Cursor', icon: 'Crosshair' },
  { key: 'zebra', label: 'Zebra', icon: 'BoltIcon' },
  { key: 'peaking', label: 'Peaking', icon: 'EyeDropperIcon' },
  { key: 'flicker', label: 'Live View', icon: 'BoltIcon' },
  { key: 'vignette', label: 'Vignette', icon: 'PhotoIcon' },
];

export function HUD({
  camera,
  setCamera,
  overlays,
  setOverlays,
  onLens,
  lens,
  onPowerOff,
  hudVisibility,
  onHudToggle,
  onReset,
  hasHistory,
  onHome,
  batteryLevel,
}) {
  const updateSetting = (key, delta) => {
    setCamera((current) => {
      const next = { ...current };
      next[key] = (current[key] || 0) + delta;
      return next;
    });
  };

  const cycleLens = () => {
    const order = ['wide', 'standard', 'tele'];
    const idx = order.indexOf(lens);
    const next = order[(idx + 1) % order.length];
    onLens(next);
  };

  const cycleHud = () => {
    const order = ['full', 'partial', 'hidden'];
    const idx = order.indexOf(hudVisibility);
    onHudToggle(order[(idx + 1) % order.length]);
  };

  const toggleOverlay = (key) => {
    setOverlays((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 transition ${
        hudVisibility === 'hidden' ? 'translate-y-24 opacity-0' : 'opacity-100'
      }`}
    >
      <div className="mx-auto max-w-6xl rounded-t-2xl border border-slate-800 bg-slate-900/70 backdrop-blur-xl p-4 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <span className="rounded-lg border border-slate-700 bg-slate-800/70 px-3 py-1">ISO {camera.iso}</span>
            <span className="rounded-lg border border-slate-700 bg-slate-800/70 px-3 py-1">f/{camera.aperture.toFixed(1)}</span>
            <span className="rounded-lg border border-slate-700 bg-slate-800/70 px-3 py-1">1/{camera.shutter}</span>
            <span className="rounded-lg border border-slate-700 bg-slate-800/70 px-3 py-1">{camera.wb}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-200">
            <button
              onClick={() => updateSetting('iso', 100)}
              className="rounded-lg border border-slate-700 bg-slate-800/70 px-2 py-1 hover:border-cyan-300"
            >
              ISO+
            </button>
            <button
              onClick={() => updateSetting('iso', -100)}
              className="rounded-lg border border-slate-700 bg-slate-800/70 px-2 py-1 hover:border-cyan-300"
            >
              ISO-
            </button>
            <button
              onClick={() => updateSetting('aperture', -0.4)}
              className="rounded-lg border border-slate-700 bg-slate-800/70 px-2 py-1 hover:border-cyan-300"
            >
              Close
            </button>
            <button
              onClick={() => updateSetting('aperture', 0.4)}
              className="rounded-lg border border-slate-700 bg-slate-800/70 px-2 py-1 hover:border-cyan-300"
            >
              Open
            </button>
            <button
              onClick={() => updateSetting('shutter', 10)}
              className="rounded-lg border border-slate-700 bg-slate-800/70 px-2 py-1 hover:border-cyan-300"
            >
              Shutter+
            </button>
            <button
              onClick={() => updateSetting('shutter', -10)}
              className="rounded-lg border border-slate-700 bg-slate-800/70 px-2 py-1 hover:border-cyan-300"
            >
              Shutter-
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => toggleOverlay('grid')} className={`h-10 w-10 rounded-xl border ${
              overlays.grid ? 'border-cyan-400 bg-cyan-400/10' : 'border-slate-700 bg-slate-800/60'
            }`} aria-label="Grid">
              <Icon name="ViewfinderCircleIcon" className="h-5 w-5" />
            </button>
            {toggles.map((toggle) => (
              <button
                key={toggle.key}
                onClick={() => toggleOverlay(toggle.key)}
                aria-label={toggle.label}
                className={`h-10 w-10 rounded-xl border text-xs ${
                  overlays[toggle.key]
                    ? 'border-cyan-400 bg-cyan-400/10'
                    : 'border-slate-700 bg-slate-800/60'
                }`}
              >
                <Icon name={toggle.icon === 'Crosshair' ? 'ViewfinderCircleIcon' : toggle.icon} className="h-5 w-5" />
              </button>
            ))}
            <button
              onClick={cycleLens}
              className="h-10 rounded-xl border border-slate-700 bg-slate-800/60 px-3 text-sm hover:border-cyan-300"
            >
              {lens === 'wide' ? '24mm' : lens === 'tele' ? '85mm' : '50mm'}
            </button>
            <button
              onClick={onHome}
              className="h-10 w-10 rounded-xl border border-slate-700 bg-slate-800/60 hover:border-cyan-300"
              aria-label="Home"
            >
              <Icon name="HomeIcon" className="h-5 w-5" />
            </button>
            <button
              onClick={onPowerOff}
              className="h-10 w-10 rounded-xl border border-slate-700 bg-slate-800/60 hover:border-red-400"
              aria-label="Power"
            >
              <Icon name="PowerIcon" className="h-5 w-5 text-red-300" />
            </button>
            <div className="flex items-center gap-1 rounded-xl border border-slate-700 bg-slate-800/60 px-3 py-1">
              <Icon name="Battery50Icon" className="h-5 w-5" />
              <div className="h-2 w-20 overflow-hidden rounded bg-slate-700">
                <div className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400" style={{ width: `${batteryLevel}%` }} />
              </div>
            </div>
            <button
              onClick={cycleHud}
              className="h-10 rounded-xl border border-slate-700 bg-slate-800/60 px-3 text-sm hover:border-cyan-300"
            >
              HUD: {hudVisibility}
            </button>
            {hasHistory && (
              <button
                onClick={onReset}
                className="h-10 rounded-xl border border-cyan-400/70 bg-cyan-400/10 px-3 text-sm text-cyan-100 hover:border-cyan-300"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
