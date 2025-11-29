import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  aiAlbums,
  films,
  links,
  loremakerSheet,
  musicVideos,
  pages,
  photographyAlbums,
  videoEdits,
} from '../data/content';
import { Header } from '../components/Header';
import { HUD } from '../components/HUD';
import { PowerScreen } from '../components/PowerScreen';
import { GalleryGrid } from '../components/GalleryGrid';
import { SingleView } from '../components/SingleView';
import { OverlayBoxes } from '../components/OverlayBoxes';

function combineAlbums(name, ...groups) {
  const items = groups.flat();
  return { name, description: `${items.length} items`, items };
}

const socials = [
  { label: 'Instagram', url: 'https://instagram.com/menelek.makonnen', icon: 'CameraIcon' },
  { label: 'YouTube', url: 'https://youtube.com/@menelekmakonnen', icon: 'PlayIcon' },
  { label: 'LinkedIn', url: 'https://linkedin.com/in/menelekmakonnen', icon: 'LinkIcon' },
  { label: 'Director IG', url: 'https://www.instagram.com/menelek.makonnen/', icon: 'CameraIcon' },
];

export default function Home() {
  const [powered, setPowered] = useState(false);
  const [page, setPage] = useState('home');
  const [lens, setLens] = useState('standard');
  const [hudVisibility, setHudVisibility] = useState('full');
  const [camera, setCamera] = useState({ iso: 800, aperture: 2.8, shutter: 250, wb: 'AWB' });
  const [overlays, setOverlays] = useState({
    histogram: false,
    waveform: false,
    grid: false,
    cursor: false,
    zebra: false,
    peaking: false,
    flicker: false,
    vignette: false,
  });
  const [history, setHistory] = useState([]);
  const [sortMode, setSortMode] = useState('random');
  const [singleOpen, setSingleOpen] = useState(false);
  const [activeAlbum, setActiveAlbum] = useState(null);
  const [activeItem, setActiveItem] = useState(null);
  const [albumContext, setAlbumContext] = useState([]);
  const [loremakerCharacters, setLoremakerCharacters] = useState([]);
  const [battery, setBattery] = useState(100);

  const viewAllFilms = useMemo(
    () => combineAlbums('View All Films & Music', [...films, ...musicVideos]),
    []
  );
  const viewAllEdits = useMemo(
    () => combineAlbums('View All Video Edits', Object.values(videoEdits).flat()),
    []
  );

  const recordAction = (action) => setHistory((prev) => [...prev, action]);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      const end = new Date();
      end.setHours(23, 59, 59, 999);
      const progress = (now - start) / (end - start);
      const remaining = Math.max(0, 100 - progress * 100);
      setBattery(parseFloat(remaining.toFixed(1)));
      if (remaining <= 0 && powered) {
        setPowered(false);
        setPage('home');
      }
    };
    tick();
    const id = setInterval(tick, 60000);
    return () => clearInterval(id);
  }, [powered]);

  const openAlbum = (album, item, context = []) => {
    if (!album) return;
    setActiveAlbum(album);
    setActiveItem(item || album.items?.[0]);
    setAlbumContext(context);
    setSingleOpen(true);
    setHudVisibility('hidden');
  };

  const navigateSingle = useCallback(
    (direction, nextAlbum) => {
      const items = nextAlbum ? nextAlbum.items : activeAlbum?.items || [];
      const index = direction === 'album' ? 0 : items.findIndex((i) => i.title === activeItem?.title);
      if (direction === 'album' && nextAlbum) {
        setActiveAlbum(nextAlbum);
        setActiveItem(nextAlbum.items[0]);
        return;
      }
      if (direction === 'next') {
        const next = items[(index + 1) % items.length];
        setActiveItem(next);
        return;
      }
      if (direction === 'prev') {
        const next = items[(index - 1 + items.length) % items.length];
        setActiveItem(next);
        return;
      }
      if (typeof direction === 'number') {
        setActiveItem(items[direction]);
      }
    },
    [activeAlbum, activeItem]
  );

  useEffect(() => {
    const handleKeys = (e) => {
      if (!powered) return;
      if (singleOpen) {
        if (e.key === 'ArrowRight' || e.key === 'd') navigateSingle('next');
        if (e.key === 'ArrowLeft' || e.key === 'a') navigateSingle('prev');
        if (e.key === 'Escape') setSingleOpen(false);
        return;
      }
      if (e.key === 'ArrowRight' || e.key === 'd') {
        const index = pages.findIndex((p) => p.key === page);
        const next = pages[(index + 1) % pages.length];
        setPage(next.key);
      }
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        const index = pages.findIndex((p) => p.key === page);
        const next = pages[(index - 1 + pages.length) % pages.length];
        setPage(next.key);
      }
      if (e.key === 'Escape') {
        setPowered(false);
      }
    };
    window.addEventListener('keydown', handleKeys);
    return () => window.removeEventListener('keydown', handleKeys);
  }, [page, powered, singleOpen, navigateSingle]);

  useEffect(() => {
    fetch(loremakerSheet)
      .then((res) => res.text())
      .then((text) => {
        const json = JSON.parse(text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1));
        const rows = json.table.rows || [];
        const parsed = rows
          .map((row) => {
            const [character, alias, , , location, , faction, , , shortDesc, , , cover] = row.c.map((c) => c?.v || '');
            return {
              title: character,
              alias,
              location,
              description: shortDesc,
              thumbnail: cover,
            };
          })
          .filter((item) => item.title && item.thumbnail);
        setLoremakerCharacters(parsed.slice(0, 20));
      })
      .catch(() => {
        setLoremakerCharacters([
          {
            title: 'Aria of Mercury',
            alias: 'The Seer',
            location: 'Cloud City',
            description: 'Future-forward loremaker sample card.',
            thumbnail:
              'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=60',
          },
        ]);
      });
  }, []);

  const resetCamera = () => {
    if (history.length === 1) {
      setCamera(history[0].camera || camera);
      setOverlays(history[0].overlays || overlays);
      setHistory([]);
      return;
    }
    setCamera({ iso: 800, aperture: 2.8, shutter: 250, wb: 'AWB' });
    setOverlays({ histogram: false, waveform: false, grid: false, cursor: false, zebra: false, peaking: false, flicker: false, vignette: false });
    setHistory([]);
  };

  const contentForPage = () => {
    if (page === 'home') {
      return (
        <div className="space-y-6">
          <div className="glass-panel accent-ring rounded-3xl p-8 shadow-2xl">
            <div className="grid items-center gap-8 md:grid-cols-[1.05fr,0.95fr]">
              <div className="space-y-4">
                <p className="text-[11px] uppercase tracking-[0.3em] text-slate-300">Welcome</p>
                <h1 className="text-4xl font-semibold leading-tight">Luxury camera-inspired portfolio OS</h1>
                <p className="max-w-2xl text-slate-200">
                  A premium EVF for films, music videos, photography, AI imagery, and high-energy edits. Cruise with keyboard shortcuts, toggle overlays, and jump straight into Single View.
                </p>
                <div className="flex flex-wrap gap-3 text-sm">
                  <button
                    onClick={() => setPage('films')}
                    className="rounded-full border border-white/20 bg-white/10 px-4 py-2 font-medium shadow-[0_10px_35px_rgba(0,0,0,0.35)] transition hover:border-cyan-300/80 hover:bg-cyan-500/15"
                  >
                    View Films & Music
                  </button>
                  <button
                    onClick={() => setPage('edits')}
                    className="rounded-full border border-cyan-300/50 bg-cyan-400/10 px-4 py-2 font-medium text-cyan-50 shadow-[0_10px_35px_rgba(0,0,0,0.35)] transition hover:bg-cyan-400/20"
                  >
                    Open Video Edits
                  </button>
                  <button
                    onClick={() => setPage('links')}
                    className="rounded-full border border-white/15 px-4 py-2 font-medium text-slate-100 transition hover:border-cyan-200/60"
                  >
                    Links & Contacts
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
                  {[{ label: 'Films', value: films.length }, { label: 'Music Videos', value: musicVideos.length }, { label: 'Video Edits', value: Object.values(videoEdits).flat().length }, { label: 'Photo / AI Albums', value: photographyAlbums.length + aiAlbums.length }].map((item) => (
                    <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 shadow-inner">
                      <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">{item.label}</p>
                      <p className="text-xl font-semibold text-white">{item.value.toString().padStart(2, '0')}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-5 shadow-[0_15px_50px_rgba(0,0,0,0.35)]">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Latest Films</h3>
                    <span className="text-xs text-slate-300">Tap to preview</span>
                  </div>
                  <div className="mt-3 space-y-2">
                    {films.slice(0, 3).map((film) => (
                      <button
                        key={film.title}
                        className="group flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left transition hover:border-cyan-300/70 hover:bg-cyan-400/10"
                        onClick={() => openAlbum({ name: 'Films', items: films }, film, [{ name: 'Films', items: films }])}
                      >
                        <div>
                          <p className="text-sm font-semibold text-white">{film.title}</p>
                          <p className="text-xs text-slate-300">{film.description}</p>
                        </div>
                        <span className="text-[11px] text-cyan-100">{film.runtime}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Book</p>
                      <h3 className="text-lg font-semibold text-white">The Last Ochiyamie</h3>
                      <p className="text-sm text-slate-300">Feature-length novel now available.</p>
                    </div>
                    <a
                      className="rounded-full border border-cyan-300/60 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-50 transition hover:bg-cyan-400/20"
                      href="https://a.co/d/iG5DOBk"
                    >
                      Visit Amazon
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="glass-panel rounded-2xl p-5">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Signature reels</p>
              <h3 className="text-lg font-semibold">Video edits</h3>
              <p className="text-sm text-slate-300">Epic, Beauty & Travel, BTS, AI educator reels.</p>
              <div className="mt-3 space-y-2 text-sm">
                {Object.entries(videoEdits)
                  .slice(0, 3)
                  .map(([name, items]) => (
                    <button
                      key={name}
                      className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-left transition hover:border-cyan-200/70 hover:bg-cyan-500/10"
                      onClick={() => openAlbum({ name, items }, items[0], Object.entries(videoEdits).map(([label, list]) => ({ name: label, items: list })))}
                    >
                      <span className="font-medium text-white">{name}</span>
                      <span className="text-[11px] text-slate-300">{items.length} clips</span>
                    </button>
                  ))}
              </div>
            </div>
            <div className="glass-panel rounded-2xl p-5">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Storyworlds</p>
              <h3 className="text-lg font-semibold">Loremaker universe</h3>
              <p className="text-sm text-slate-300">20 rotating characters with art & hook lines.</p>
              <button
                className="mt-3 w-full rounded-xl border border-cyan-300/50 bg-cyan-400/10 px-3 py-2 text-sm font-semibold text-cyan-50 transition hover:bg-cyan-400/20"
                onClick={() => setPage('loremaker')}
              >
                Enter Loremaker
              </button>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-300">
                {loremakerCharacters.slice(0, 4).map((character) => (
                  <div key={character.title} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                    <p className="font-semibold text-white">{character.title}</p>
                    <p className="text-[11px] text-slate-400">{character.alias || character.location}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="glass-panel rounded-2xl p-5">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Gallery surfaces</p>
              <h3 className="text-lg font-semibold">Photography & AI</h3>
              <p className="text-sm text-slate-300">Separate lenses for real-world shoots and synthetic imagery.</p>
              <div className="mt-3 space-y-2 text-sm">
                {[{ label: 'Photography albums', target: 'photography', count: photographyAlbums.length }, { label: 'AI albums', target: 'ai', count: aiAlbums.length }].map((item) => (
                  <button
                    key={item.label}
                    className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-left transition hover:border-cyan-200/70 hover:bg-cyan-500/10"
                    onClick={() => setPage(item.target)}
                  >
                    <span className="font-medium text-white">{item.label}</span>
                    <span className="text-[11px] text-slate-300">{item.count} sets</span>
                  </button>
                ))}
              </div>
              <div className="mt-3 flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-slate-200">
                <span>Need a direct line?</span>
                <button
                  className="rounded-full border border-cyan-300/60 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-50 transition hover:bg-cyan-400/20"
                  onClick={() => setPage('links')}
                >
                  Contact
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }
    if (page === 'loremaker') {
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Loremaker</p>
              <h2 className="text-2xl font-semibold">20 random characters</h2>
            </div>
            <a
              href="https://loremaker.cloud"
              className="rounded-full border border-cyan-400/60 px-4 py-2 text-sm text-cyan-100"
            >
              Visit site
            </a>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {loremakerCharacters.map((character) => (
              <button
                key={character.title}
                onClick={() => openAlbum({ name: 'Loremaker', items: loremakerCharacters }, character, [
                  { name: 'Loremaker', items: loremakerCharacters },
                ])}
                className="glass-panel rounded-2xl p-4 text-left hover:border-cyan-400"
              >
                <div className="h-40 w-full overflow-hidden rounded-xl bg-slate-800">
                  {character.thumbnail ? (
                    <img src={character.thumbnail} alt={character.title} className="h-full w-full object-cover" loading="lazy" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-slate-400">Preview unavailable</div>
                  )}
                </div>
                <h3 className="mt-3 text-lg font-semibold">{character.title}</h3>
                <p className="text-sm text-slate-400">{character.description || 'Lore card preview'}</p>
              </button>
            ))}
          </div>
        </div>
      );
    }
    if (page === 'films') {
      const albums = [
        { name: 'Films', description: 'Narrative films', items: films },
        { name: 'Music Videos', description: 'Official and artistic videos', items: musicVideos },
        viewAllFilms,
      ];
      return (
        <GalleryGrid
          title="Films & Music"
          albums={albums}
          lens={lens}
          onOpen={(album, item) => openAlbum(album, item, albums)}
          sortMode={sortMode}
          onReshuffle={setSortMode}
        />
      );
    }
    if (page === 'edits') {
      const albums = [
        ...Object.entries(videoEdits).map(([name, items]) => ({ name, description: 'Instagram reels', items })),
        viewAllEdits,
      ];
      return (
        <GalleryGrid
          title="Video Edits"
          albums={albums}
          lens={lens}
          onOpen={(album, item) => openAlbum(album, item, albums)}
          sortMode={sortMode}
          onReshuffle={setSortMode}
        />
      );
    }
    if (page === 'photography') {
      return (
        <GalleryGrid
          title="Photography"
          albums={photographyAlbums}
          lens={lens}
          onOpen={(album, item) => openAlbum(album, item, photographyAlbums)}
          sortMode={sortMode}
          onReshuffle={setSortMode}
        />
      );
    }
    if (page === 'ai') {
      return (
        <GalleryGrid
          title="AI Albums"
          albums={aiAlbums}
          lens={lens}
          onOpen={(album, item) => openAlbum(album, item, aiAlbums)}
          sortMode={sortMode}
          onReshuffle={setSortMode}
        />
      );
    }
    if (page === 'links') {
      return (
        <div className="grid gap-3 md:grid-cols-2">
          {links.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="glass-panel block rounded-2xl border border-slate-800 p-4 hover:border-cyan-400"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{link.label}</h3>
                  <p className="text-sm text-slate-400">{link.description}</p>
                </div>
                <span className="text-xs text-cyan-200">Visit</span>
              </div>
            </a>
          ))}
        </div>
      );
    }
    return null;
  };

  const mainClasses = `${overlays.grid ? 'grid-overlay' : ''} ${overlays.vignette ? 'shadow-[inset_0_0_80px_rgba(0,0,0,0.6)]' : ''}`;

  return (
    <div className="relative min-h-screen">
      {!powered && <PowerScreen onPower={() => setPowered(true)} socials={socials} />}
      {powered && <Header currentPage={page} onNavigate={setPage} />}
      <main className={`pt-24 pb-32 ${mainClasses}`}>
        <div className="mx-auto max-w-7xl space-y-6 px-4">
          {contentForPage()}
        </div>
      </main>
      {powered && (
        <HUD
          camera={camera}
          setCamera={(fn) => {
            const next = typeof fn === 'function' ? fn(camera) : fn;
            recordAction({ camera: next, overlays });
            setCamera(next);
          }}
          overlays={overlays}
          setOverlays={(next) => {
            const updated = typeof next === 'function' ? next(overlays) : next;
            recordAction({ camera, overlays: updated });
            setOverlays(updated);
          }}
          onLens={(next) => {
            setLens(next);
            recordAction({ lens: next });
          }}
          lens={lens}
          onPowerOff={() => setPowered(false)}
          hudVisibility={hudVisibility}
          onHudToggle={setHudVisibility}
          onReset={resetCamera}
          hasHistory={history.length > 0}
          onHome={() => setPage('home')}
          batteryLevel={battery}
        />
      )}
      {powered && <OverlayBoxes overlays={overlays} onClose={(key) => setOverlays((prev) => ({ ...prev, [key]: false }))} />}
      <SingleView
        open={singleOpen}
        onClose={() => {
          setSingleOpen(false);
          setHudVisibility('full');
        }}
        album={activeAlbum}
        item={activeItem}
        onNavigate={(dir, albumSwitch) => navigateSingle(dir, albumSwitch)}
        otherAlbums={albumContext.filter((ctx) => ctx.name !== activeAlbum?.name)}
      />
      {overlays.zebra && <div className="pointer-events-none fixed inset-0 z-10 bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.06),rgba(255,255,255,0.06)_10px,transparent_10px,transparent_20px)]" />}
      {overlays.flicker && <div className="pointer-events-none fixed inset-0 z-10 bg-[radial-gradient(circle,rgba(255,255,255,0.03),transparent_40%)] mix-blend-overlay" />}
      {overlays.peaking && <div className="pointer-events-none fixed inset-0 z-10 border-2 border-cyan-400/40" />}
    </div>
  );
}
