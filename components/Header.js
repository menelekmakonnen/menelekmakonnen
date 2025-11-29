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
    <header className="fixed left-0 right-0 top-0 z-30 flex items-center justify-between px-6 py-4 bg-slate-900/60 backdrop-blur-xl border-b border-slate-800">
      <div className="flex items-center gap-3">
        <button onClick={() => onNavigate('home')} className="text-left">
          <div className="text-lg font-semibold tracking-wide">Menelek Makonnen</div>
          <SubtitleTicker />
        </button>
      </div>
      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-3">
          {pages.map((page) => (
            <button
              key={page.key}
              onClick={() => onNavigate(page.key)}
              className={`relative flex h-11 w-11 items-center justify-center rounded-xl border ${
                currentPage === page.key
                  ? 'border-cyan-400/80 bg-cyan-400/10 shadow-inner shadow-cyan-500/20'
                  : 'border-slate-700 bg-slate-900/40'
              }`}
              aria-label={page.label}
            >
              <Icon name={iconMap[page.icon] || 'ViewfinderCircleIcon'} className="h-5 w-5" />
              {currentPage === page.key && (
                <span className="absolute -bottom-2 h-1 w-8 rounded-full bg-cyan-400/60" aria-hidden />
              )}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 rounded-full border border-slate-700 bg-slate-900/60 px-3 py-1 text-xs text-slate-200">
          <Icon name="GlobeAltIcon" className="h-5 w-5 animate-spin-slow" />
          <span>{timeGreeting()}</span>
        </div>
      </div>
    </header>
  );
}
