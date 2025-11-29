import { useEffect, useMemo, useRef, useState } from 'react';

export function SingleView({ open, onClose, album, item, onNavigate, otherAlbums }) {
  const [expanded, setExpanded] = useState(false);
  const [slideShow, setSlideShow] = useState(false);
  const [zoom, setZoom] = useState(1);
  const timerRef = useRef(null);
  const containerRef = useRef(null);

  const items = album?.items || [];
  const currentIndex = useMemo(() => items.findIndex((i) => i.title === item?.title), [items, item]);

  useEffect(() => {
    if (!slideShow) return undefined;
    timerRef.current = setInterval(() => {
      onNavigate('next');
    }, 4000);
    return () => clearInterval(timerRef.current);
  }, [slideShow, onNavigate]);

  useEffect(() => {
    const onWheel = (e) => {
      if (expanded) {
        e.preventDefault();
        const next = Math.max(1, Math.min(3, zoom + (e.deltaY > 0 ? -0.1 : 0.1)));
        setZoom(next);
      }
    };
    const node = containerRef.current;
    node?.addEventListener('wheel', onWheel, { passive: false });
    return () => node?.removeEventListener('wheel', onWheel);
  }, [expanded, zoom]);

  if (!open) return null;

  const media = () => {
    if (!item) return <div className="text-center text-slate-300">No media selected.</div>;
    if (item.type === 'youtube') {
      return (
        <iframe
          title={item.title}
          src={`https://www.youtube.com/embed/${item.id}`}
          allowFullScreen
          className="h-full w-full rounded-2xl"
        />
      );
    }
    if (item.type === 'instagram') {
      return (
        <iframe
          title={item.title}
          src={`https://www.instagram.com/reel/${item.id}/embed`}
          allowFullScreen
          className="h-full w-full rounded-2xl"
        />
      );
    }
    if (item.thumbnail) {
      return <img src={item.thumbnail} alt={item.title} className="h-full w-full object-contain" />;
    }
    return <div className="text-slate-400">Media preview coming soon.</div>;
  };

  return (
    <div className={`fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-xl ${expanded ? 'p-2' : 'p-6'}`}>
      <div className="absolute right-6 top-6 flex items-center gap-2">
        <button
          onClick={() => setSlideShow(!slideShow)}
          className="rounded-lg border border-slate-700 bg-slate-800/70 px-3 py-1 text-sm"
        >
          {slideShow ? 'Pause' : 'Slideshow'}
        </button>
        <button
          onClick={() => setExpanded(!expanded)}
          className="rounded-lg border border-slate-700 bg-slate-800/70 px-3 py-1 text-sm"
        >
          {expanded ? 'Collapse' : 'Expand'}
        </button>
        <button
          onClick={onClose}
          className="rounded-lg border border-slate-700 bg-slate-800/70 px-3 py-1 text-sm"
        >
          Close
        </button>
      </div>
      <div className="grid h-full gap-4 md:grid-cols-[2fr,1fr]" ref={containerRef}>
        <div className={`glass-panel relative flex h-full flex-col overflow-hidden ${expanded ? 'col-span-2' : ''}`} style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}>
          <div className="relative flex-1 bg-black/70 p-4">{media()}</div>
          {zoom !== 1 && (
            <button
              onClick={() => setZoom(1)}
              className="absolute right-4 top-4 rounded-md border border-slate-700 bg-slate-900/70 px-3 py-1 text-xs"
            >
              Reset zoom
            </button>
          )}
        </div>
        {!expanded && (
          <div className="glass-panel flex flex-col overflow-hidden">
            <div className="border-b border-slate-800 px-4 py-3 text-sm font-semibold">{album?.name}</div>
            <div className="flex-1 space-y-2 overflow-y-auto p-3">
              {items.map((thumb, idx) => (
                <button
                  key={thumb.title + idx}
                  onClick={() => onNavigate(idx)}
                  className={`flex w-full items-center gap-3 rounded-xl border px-2 py-2 text-left ${
                    idx === currentIndex
                      ? 'border-cyan-400/60 bg-cyan-400/10'
                      : 'border-slate-800 bg-slate-900/60'
                  }`}
                >
                  <div className="h-12 w-16 overflow-hidden rounded-lg bg-slate-800">
                    {thumb.thumbnail ? (
                      <img src={thumb.thumbnail} alt={thumb.title} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[10px] text-slate-400">Preview</div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-100">{thumb.title}</p>
                    <p className="text-xs text-slate-400">{thumb.description}</p>
                  </div>
                </button>
              ))}
            </div>
            <div className="border-t border-slate-800 px-3 py-2 text-xs text-slate-400">Use arrow keys or scroll to navigate.</div>
          </div>
        )}
      </div>
      {!expanded && otherAlbums?.length ? (
        <div className="mt-3 flex items-center gap-2 overflow-x-auto py-2">
          {otherAlbums.map((other) => (
            <button
              key={other.name}
              onClick={() => onNavigate('album', other)}
              className="rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-200 hover:border-cyan-400"
            >
              {other.name}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
