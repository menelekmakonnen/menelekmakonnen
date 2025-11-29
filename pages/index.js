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
          <div className="glass-panel rounded-2xl p-8">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Welcome</p>
            <h1 className="text-4xl font-semibold">Luxury camera-inspired portfolio</h1>
            <p className="mt-2 max-w-3xl text-slate-300">
              Explore the viewfinder to see films, music videos, photography, AI imagery, and high-energy video edits. Switch lenses, toggle overlays, and keep the HUD in control.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="glass-panel rounded-2xl p-6">
              <h3 className="text-lg font-semibold">Latest Films</h3>
              <div className="mt-3 space-y-2">
                {films.slice(0, 3).map((film) => (
                  <button
                    key={film.title}
                    className="flex w-full items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-3 text-left hover:border-cyan-400"
                    onClick={() => openAlbum({ name: 'Films', items: films }, film, [{ name: 'Films', items: films }])}
                  >
                    <div>
                      <p className="text-sm font-semibold">{film.title}</p>
                      <p className="text-xs text-slate-400">{film.description}</p>
                    </div>
                    <span className="text-xs text-slate-400">{film.runtime}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="glass-panel rounded-2xl p-6">
              <h3 className="text-lg font-semibold">Book / Novel</h3>
              <p className="text-sm text-slate-300">The Last Ochiyamie available now.</p>
              <a className="mt-3 inline-flex items-center gap-2 rounded-lg border border-cyan-400/60 px-3 py-2 text-sm text-cyan-100" href="https://a.co/d/iG5DOBk">
                Visit Amazon
              </a>
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
        <div className="mx-auto max-w-6xl space-y-6 px-4">
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
