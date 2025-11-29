import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SparklesIcon } from '@heroicons/react/24/outline';
import { MOCK_AI_ALBUMS } from '@/lib/data/googleDrive';
import AlbumGrid from '../album/AlbumGrid';
import ItemGrid from '../album/ItemGrid';
import SingleView from '../singleview/SingleView';

export default function AIAlbumsPage() {
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [singleViewItem, setSingleViewItem] = useState(null);

  // In production, fetch from Google Drive
  const albums = MOCK_AI_ALBUMS;

  const handleAlbumClick = (album) => {
    setSelectedAlbum(album);
  };

  const handleItemClick = (item) => {
    setSingleViewItem(item);
  };

  const handleBack = () => {
    if (singleViewItem) {
      setSingleViewItem(null);
    } else if (selectedAlbum) {
      setSelectedAlbum(null);
    }
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
              AI Albums
            </h1>
            <p className="mt-2 text-white/60">
              AI-generated visual explorations
            </p>
          </motion.div>

          {/* Coming Soon Notice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-lg border border-green-500/30 bg-green-500/10 p-8 text-center"
          >
            <SparklesIcon className="mx-auto mb-4 h-16 w-16 text-green-400" />
            <h3 className="mb-2 text-xl font-semibold text-green-400">
              AI Album Integration Coming Soon
            </h3>
            <p className="mb-4 text-white/60">
              AI-generated image albums will be populated from Google Drive.
              This feature is currently in development.
            </p>
            <a
              href="https://drive.google.com/drive/folders/1G_6TgOtftLKwqRWjH-tFLuCgp_Oydor4"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-sm text-green-400 hover:underline"
            >
              View on Google Drive →
            </a>
          </motion.div>

          {/* Placeholder album grid */}
          {albums.length > 0 && (
            <div className="mt-8">
              <AlbumGrid albums={albums} onAlbumClick={handleAlbumClick} />
            </div>
          )}
        </>
      ) : (
        <>
          {/* Album view */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <button
              onClick={handleBack}
              className="mb-4 text-sm text-white/60 transition-colors hover:text-white"
            >
              ← Back to Albums
            </button>

            <h2 className="text-3xl font-bold text-white">
              {selectedAlbum.name}
            </h2>
            {selectedAlbum.description && (
              <p className="mt-2 text-white/60">
                {selectedAlbum.description}
              </p>
            )}
          </motion.div>

          {/* Images would go here */}
          <div className="rounded-lg border border-white/10 bg-white/5 p-12 text-center text-white/60">
            AI-generated images from Google Drive will appear here
          </div>
        </>
      )}

      {/* Single View */}
      <AnimatePresence>
        {singleViewItem && selectedAlbum && (
          <SingleView
            item={singleViewItem}
            items={selectedAlbum.images || []}
            albums={albums}
            currentAlbumId={selectedAlbum.id}
            onClose={() => setSingleViewItem(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
