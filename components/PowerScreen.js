import { useEffect, useMemo } from 'react';
import { Icon } from './Icon';

export function PowerScreen({ onPower, socials }) {
  const todayKey = useMemo(() => new Date().toISOString().slice(0, 10), []);

  useEffect(() => {
    const alreadyPowered = window.localStorage.getItem('power-session');
    if (alreadyPowered === todayKey) {
      onPower();
    }
  }, [onPower, todayKey]);

  const handlePower = () => {
    window.localStorage.setItem('power-session', todayKey);
    onPower();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black text-slate-100">
      <div className="flex flex-col items-center gap-8">
        <button
          onClick={handlePower}
          className="p-8 rounded-full border border-slate-700 hover:border-cyan-400 transition shadow-2xl bg-gradient-to-br from-slate-800 to-slate-900"
          aria-label="Power on"
        >
          <Icon name="PowerIcon" className="w-16 h-16 text-cyan-300" />
        </button>
        <div className="grid grid-cols-4 gap-4">
          {socials.map((item) => (
            <a
              key={item.label}
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-700 hover:border-cyan-400 bg-slate-900/80"
            >
              <Icon name={item.icon} className="w-6 h-6 text-slate-200" />
              <span className="sr-only">{item.label}</span>
            </a>
          ))}
        </div>
        <p className="text-sm text-slate-400">Click power to boot the viewfinder experience.</p>
      </div>
    </div>
  );
}
