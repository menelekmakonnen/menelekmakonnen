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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-left text-sm text-white/70"
          >
            <p className="flex items-center gap-2 font-semibold text-green-200">
              <SparklesIcon className="h-5 w-5" />
              Drive-ready placeholders
            </p>
            <p className="mt-2">Replace the URLs in <code>lib/data/googleDrive.js</code> with your Drive thumbnails to wire up the live feed.</p>
          </motion.div>

          {/* Album grid */}
          <AlbumGrid
            albums={albums.map(album => ({ ...album, title: album.name }))}
            onAlbumClick={handleAlbumClick}
            thumbnailType="vertical"
          />
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

          <ItemGrid
            items={selectedAlbum.images?.map(image => ({
              ...image,
              id: image.id,
              title: image.title,
              thumbnail: image.url,
              coverImage: image.url
            })) || []}
            onItemClick={handleItemClick}
            type="vertical"
          />
        </>
      )}

      {/* Single View */}
      <AnimatePresence>
        {singleViewItem && selectedAlbum && (
          <SingleView
            item={singleViewItem}
            items={selectedAlbum.images?.map(image => ({
              ...image,
              id: image.id,
              title: image.title,
              thumbnail: image.url,
              coverImage: image.url
            })) || []}
            albums={albums.map(album => ({
              ...album,
              items: album.images?.map(image => ({
                ...image,
                id: image.id,
                title: image.title,
                thumbnail: image.url,
                coverImage: image.url
              })) || []
            }))}
            currentAlbumId={selectedAlbum.id}
            onClose={() => setSingleViewItem(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
