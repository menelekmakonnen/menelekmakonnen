import { useMemo } from 'react';

const lensClasses = {
  wide: 'grid-cols-2 md:grid-cols-4',
  standard: 'grid-cols-2 md:grid-cols-3',
  tele: 'grid-cols-1 md:grid-cols-2',
};

export function GalleryGrid({ title, albums, lens, onOpen, sortMode, onReshuffle }) {
  const sortedAlbums = useMemo(() => {
    if (sortMode === 'az') return [...albums].sort((a, b) => a.name.localeCompare(b.name));
    if (sortMode === 'za') return [...albums].sort((a, b) => b.name.localeCompare(a.name));
    const randomized = [...albums];
    for (let i = randomized.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [randomized[i], randomized[j]] = [randomized[j], randomized[i]];
    }
    return randomized;
  }, [albums, sortMode]);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{title}</p>
          <h2 className="text-2xl font-semibold">Albums</h2>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <button
            onClick={() => onReshuffle('random')}
            className={`rounded-lg border px-3 py-1 ${sortMode === 'random' ? 'border-cyan-400 text-cyan-200' : 'border-slate-700 text-slate-300'}`}
          >
            Random
          </button>
          <button
            onClick={() => onReshuffle('az')}
            className={`rounded-lg border px-3 py-1 ${sortMode === 'az' ? 'border-cyan-400 text-cyan-200' : 'border-slate-700 text-slate-300'}`}
          >
            A–Z
          </button>
          <button
            onClick={() => onReshuffle('za')}
            className={`rounded-lg border px-3 py-1 ${sortMode === 'za' ? 'border-cyan-400 text-cyan-200' : 'border-slate-700 text-slate-300'}`}
          >
            Z–A
          </button>
        </div>
      </div>
      <div className={`grid gap-4 ${lensClasses[lens]}`}>
        {sortedAlbums.map((album) => (
          <button
            key={album.name}
            className="glass-panel group relative overflow-hidden rounded-2xl p-4 text-left"
            onClick={() => onOpen(album, album.items[0])}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 to-emerald-400/5 opacity-0 transition group-hover:opacity-100" />
            <div className="mb-3 h-32 w-full overflow-hidden rounded-xl bg-slate-800">
              {album.items && album.items[0]?.thumbnail ? (
                <img
                  src={album.items[0].thumbnail}
                  alt={album.items[0].title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-slate-400">
                  Preview coming from {album.folder ? 'Drive' : 'Album'}
                </div>
              )}
            </div>
            <h3 className="text-lg font-semibold">{album.name}</h3>
            <p className="text-sm text-slate-400">{album.description || `${album.items?.length || 0} items`}</p>
          </button>
        ))}
      </div>
    </section>
  );
}
