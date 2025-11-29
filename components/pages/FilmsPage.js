import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FILMS, MUSIC_VIDEOS } from '@/lib/data/films';
import AlbumGrid from '../album/AlbumGrid';
import ItemGrid from '../album/ItemGrid';
import SingleView from '../singleview/SingleView';

export default function FilmsPage() {
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [singleViewItem, setSingleViewItem] = useState(null);

  const albums = [
    {
      id: 'films',
      title: 'Films',
      description: 'Original narrative films and documentaries',
      items: FILMS,
      thumbnail: FILMS[0]?.thumbnail
    },
    {
      id: 'music-videos',
      title: 'Music Videos',
      description: 'Music video productions and creative direction',
      items: MUSIC_VIDEOS,
      thumbnail: MUSIC_VIDEOS[0]?.thumbnail
    }
  ];

  const handleAlbumClick = (album) => {
    setSelectedAlbum(album);
  };

  const handleItemClick = (item) => {
    setSingleViewItem(item);
  };

  const handleCloseSingleView = () => {
    setSingleViewItem(null);
  };

  const handleCloseAlbum = () => {
    setSelectedAlbum(null);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {!selectedAlbum ? (
        <>
          {/* Page header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-end justify-between">
              <div>
                <h1 className="text-4xl font-bold text-white">
                  Films & Music Videos – Where the Lore Hits the Lens
                </h1>
                <div className="mt-2 space-y-2 text-white/70">
                  <p>
                    I don’t shoot “content.” I shoot evidence that these worlds are real. Grounded emotional arcs, supernatural stakes, and colour-rich cinematography collide here.
                    The influences are obvious if you look—Breaking Bad tension, Game of Thrones stakes, early MCU structure—but the flavour is unapologetically mine.
                  </p>
                  <p>
                    For artists and labels, music videos become mini-pilots for a bigger universe: high-energy visuals, story-driven concepts, and rewatchable craft.
                    If you need a Ghanaian / London-based director who can plug your song, script or concept into a larger mythos, start here.
                  </p>
                </div>
              </div>

              {/* View All button */}
              <motion.button
                onClick={() => handleAlbumClick({
                  id: 'all',
                  title: 'All Films & Music Videos',
                  description: 'Complete collection',
                  items: [...FILMS, ...MUSIC_VIDEOS]
                })}
                className="flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm text-white transition-all hover:bg-white/10"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                View All
              </motion.button>
            </div>
          </motion.div>

          {/* Album grid */}
          <AlbumGrid albums={albums} onAlbumClick={handleAlbumClick} thumbnailType="horizontal" />
        </>
      ) : (
        <>
          {/* Album view header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <button
              onClick={handleCloseAlbum}
              className="mb-4 text-sm text-white/60 transition-colors hover:text-white"
            >
              ← Back to Albums
            </button>

            <h2 className="text-3xl font-bold text-white">
              {selectedAlbum.title}
            </h2>
            <p className="mt-2 text-white/60">
              {selectedAlbum.description}
            </p>
            <p className="mt-1 text-sm text-white/40">
              {selectedAlbum.items.length} {selectedAlbum.items.length === 1 ? 'video' : 'videos'}
            </p>
          </motion.div>

          {/* Item grid */}
          <ItemGrid
            items={selectedAlbum.items}
            onItemClick={handleItemClick}
            type="horizontal"
          />
        </>
      )}

      {/* Single View */}
      <AnimatePresence>
        {singleViewItem && (
          <SingleView
            item={singleViewItem}
            items={selectedAlbum.items}
            albums={albums}
            currentAlbumId={selectedAlbum.id}
            onClose={handleCloseSingleView}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
