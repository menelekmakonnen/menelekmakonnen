import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderIcon } from '@heroicons/react/24/outline';
import { MOCK_PHOTOGRAPHY_ALBUMS } from '@/lib/data/googleDrive';
import AlbumGrid from '../album/AlbumGrid';
import ItemGrid from '../album/ItemGrid';
import SingleView from '../singleview/SingleView';

export default function PhotographyPage() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [singleViewItem, setSingleViewItem] = useState(null);

  // In production, fetch from Google Drive
  // For now, use mock structure
  const categories = [
    {
      id: 'beauty',
      title: 'Beauty',
      description: 'Beauty and portrait photoshoots',
      thumbnail: null
    },
    {
      id: 'professional',
      title: 'Professional',
      description: 'Events and professional photography',
      thumbnail: null
    }
  ];

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

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
    } else if (selectedCategory) {
      setSelectedCategory(null);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {!selectedCategory && !selectedAlbum ? (
        <>
          {/* Page header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-white">
              Photography
            </h1>
            <p className="mt-2 text-white/60">
              Capturing moments, freezing time
            </p>
          </motion.div>

          {/* Category grid */}
          <AlbumGrid albums={categories} onAlbumClick={handleCategoryClick} />

          {/* Coming Soon Notice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 rounded-lg border border-blue-500/30 bg-blue-500/10 p-6 text-center"
          >
            <FolderIcon className="mx-auto mb-4 h-12 w-12 text-blue-400" />
            <h3 className="mb-2 text-lg font-semibold text-blue-400">
              Gallery Integration Coming Soon
            </h3>
            <p className="text-sm text-white/60">
              Photography albums will be populated from Google Drive.
              This feature is currently in development.
            </p>
            <a
              href="https://drive.google.com/drive/folders/1G_6TgOtftLKwqRWjH-tFLuCgp_Oydor4"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block text-sm text-blue-400 hover:underline"
            >
              View on Google Drive →
            </a>
          </motion.div>
        </>
      ) : selectedCategory && !selectedAlbum ? (
        <>
          {/* Category view */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <button
              onClick={handleBack}
              className="mb-4 text-sm text-white/60 transition-colors hover:text-white"
            >
              ← Back
            </button>

            <h2 className="text-3xl font-bold text-white">
              {selectedCategory.title}
            </h2>
            <p className="mt-2 text-white/60">
              {selectedCategory.description}
            </p>
          </motion.div>

          {/* Albums would go here */}
          <div className="rounded-lg border border-white/10 bg-white/5 p-12 text-center text-white/60">
            Albums from Google Drive will appear here
          </div>
        </>
      ) : null}

      {/* Single View */}
      <AnimatePresence>
        {singleViewItem && selectedAlbum && (
          <SingleView
            item={singleViewItem}
            items={selectedAlbum.images || []}
            albums={[selectedAlbum]}
            currentAlbumId={selectedAlbum.id}
            onClose={() => setSingleViewItem(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
