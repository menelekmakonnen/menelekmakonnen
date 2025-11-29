import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderIcon } from '@heroicons/react/24/outline';
import { PHOTOGRAPHY_ALBUMS } from '@/lib/data/googleDrive';
import AlbumGrid from '../album/AlbumGrid';
import ItemGrid from '../album/ItemGrid';
import SingleView from '../singleview/SingleView';

export default function PhotographyPage() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [singleViewItem, setSingleViewItem] = useState(null);

  const albums = PHOTOGRAPHY_ALBUMS;
  const categories = Array.from(
    new Map(
      albums.map(album => [
        album.category,
        {
          id: album.category.toLowerCase(),
          title: album.category,
          description: `${album.category} galleries from recent shoots`,
          thumbnail: album.thumbnail
        }
      ])
    ).values()
  );

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
              Photography – Character Studies in Disguise
            </h1>
            <div className="mt-2 space-y-2 text-white/70">
              <p>
                My camera is never just hunting for “pretty.” It’s hunting for story. Every portrait, every fashion shot, every behind-the-scenes frame is treated like a panel from a graphic novel.
                Composition, posture, expression, colour grading – all working together to tell you who this person is before they say a word.
              </p>
              <p>
                Expect cinematic portraits, world-building photography that feels like stills from a bigger universe, and BTS proof that we live the filmmaking life.
                I’m less interested in making you “look nice” and more interested in making you look iconic.
              </p>
            </div>
          </motion.div>

          {/* Category grid */}
          <AlbumGrid albums={categories} onAlbumClick={handleCategoryClick} />
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

          <AlbumGrid
            albums={albums.filter(album => album.category.toLowerCase() === selectedCategory.id).map(album => ({
              ...album,
              title: album.name
            }))}
            onAlbumClick={handleAlbumClick}
            thumbnailType="vertical"
          />
        </>
      ) : selectedAlbum ? (
        <>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <button
              onClick={handleBack}
              className="mb-4 text-sm text-white/60 transition-colors hover:text-white"
            >
              ← Back to {selectedCategory?.title || 'albums'}
            </button>

            <h2 className="text-3xl font-bold text-white">{selectedAlbum.name}</h2>
            <p className="mt-2 text-white/60">{selectedAlbum.date}</p>
          </motion.div>

          <ItemGrid
            items={selectedAlbum.images?.map(image => ({
              ...image,
              id: image.id,
              title: image.title,
              thumbnail: image.url,
              coverImage: image.url,
              description: selectedAlbum.name
            })) || []}
            onItemClick={handleItemClick}
            type="vertical"
          />
        </>
      ) : null}

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
            albums={albums.filter(album => album.category.toLowerCase() === selectedCategory.id).map(album => ({
              ...album,
              id: album.id,
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
