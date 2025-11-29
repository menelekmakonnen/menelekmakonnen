import { useMemo } from 'react';
import { Icon } from './Icon';
import { SubtitleTicker } from './SubtitleTicker';
import { pages } from '../data/content';

const iconMap = {
  HomeIcon: 'HomeIcon',
  SparklesIcon: 'SparklesIcon',
  FilmIcon: 'FilmIcon',
  CameraIcon: 'CameraIcon',
  CpuChipIcon: 'CpuChipIcon',
  PlayIcon: 'PlayIcon',
  LinkIcon: 'LinkIcon',
};

export function Header({ currentPage, onNavigate }) {
  const now = useMemo(() => new Date(), []);
  const timeGreeting = () => {
    const hour = now.getHours();
    if (hour < 5) return 'Burning the midnight oil';
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    if (hour < 21) return 'Good evening';
    return 'Prime edit hour';
  };

  return (
    <header className="fixed left-0 right-0 top-0 z-30 flex items-center justify-between border-b border-white/5 bg-slate-900/50 px-6 py-4 backdrop-blur-2xl">
      <div className="flex items-center gap-3">
        <button onClick={() => onNavigate('home')} className="text-left">
          <div className="text-lg font-semibold tracking-wide">Menelek Makonnen</div>
          <SubtitleTicker />
        </button>
      </div>
      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-2 rounded-full border border-white/5 bg-white/5 px-2 py-1 shadow-[0_10px_50px_rgba(0,0,0,0.4)]">
          {pages.map((page) => (
            <button
              key={page.key}
              onClick={() => onNavigate(page.key)}
              className={`relative flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-200 ${
                currentPage === page.key
                  ? 'bg-gradient-to-b from-cyan-500/25 to-indigo-500/15 shadow-inner shadow-cyan-500/30 ring-1 ring-cyan-300/60'
                  : 'border border-white/10 bg-slate-900/50 hover:border-cyan-200/50'
              }`}
              aria-label={page.label}
            >
              <Icon name={iconMap[page.icon] || 'ViewfinderCircleIcon'} className="h-5 w-5" />
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
          <Icon name="GlobeAltIcon" className="h-5 w-5 animate-spin-slow" />
          <span className="tracking-wide">{timeGreeting()}</span>
        </div>
      </div>
    </header>
  );
}
