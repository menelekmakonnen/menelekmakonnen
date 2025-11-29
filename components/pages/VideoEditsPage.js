import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VIDEO_EDIT_ALBUMS } from '@/lib/data/videoEdits';
import AlbumGrid from '../album/AlbumGrid';
import ItemGrid from '../album/ItemGrid';
import SingleView from '../singleview/SingleView';

export default function VideoEditsPage() {
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [singleViewItem, setSingleViewItem] = useState(null);

  const albums = Object.values(VIDEO_EDIT_ALBUMS);

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
                  Video Edits – Thumb-Stopping Chaos, Precision-Built
                </h1>
                <div className="mt-2 space-y-2 text-white/70">
                  <p>
                    These aren’t random reels thrown at the algorithm. They’re short-form experiments in pacing, rhythm and emotional punch—epic edits, beauty & travel, behind the scenes, and AI & learning.
                  </p>
                  <p>
                    Built to grab attention in under a second, deliver a feeling, and leave a trace of story. If your brand, song or story needs cinematic short-form that respects audience intelligence, we should talk.
                  </p>
                </div>
              </div>

              {/* View All button */}
              <motion.button
                onClick={() => handleAlbumClick({
                  id: 'all',
                  title: 'All Video Edits',
                  description: 'Complete collection of Instagram reels',
                  items: [
                    ...VIDEO_EDIT_ALBUMS['epic-edits'].items,
                    ...VIDEO_EDIT_ALBUMS['beauty-and-travel'].items,
                    ...VIDEO_EDIT_ALBUMS['behind-the-scenes'].items,
                    ...VIDEO_EDIT_ALBUMS['ai-and-learning'].items
                  ]
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
          <AlbumGrid albums={albums} onAlbumClick={handleAlbumClick} thumbnailType="vertical" />
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
              ← Back to Categories
            </button>

            <h2 className="text-3xl font-bold text-white">
              {selectedAlbum.title}
            </h2>
            <p className="mt-2 text-white/60">
              {selectedAlbum.description}
            </p>
            <p className="mt-1 text-sm text-white/40">
              {selectedAlbum.items.length} {selectedAlbum.items.length === 1 ? 'reel' : 'reels'}
            </p>
          </motion.div>

          {/* Item grid (vertical for Instagram) */}
          <ItemGrid
            items={selectedAlbum.items}
            onItemClick={handleItemClick}
            type="vertical"
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
