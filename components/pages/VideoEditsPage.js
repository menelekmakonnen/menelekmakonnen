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
            <h1 className="text-4xl font-bold text-white">
              Video Edits
            </h1>
            <p className="mt-2 text-white/60">
              Epic edits, beauty, behind the scenes, and AI & learning content
            </p>
          </motion.div>

          {/* Album grid */}
          <AlbumGrid albums={albums} onAlbumClick={handleAlbumClick} />
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
