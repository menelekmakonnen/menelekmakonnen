import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AI_ALBUMS } from '@/lib/data/googleDrive';
import AlbumGrid from '../album/AlbumGrid';
import ItemGrid from '../album/ItemGrid';
import SingleView from '../singleview/SingleView';

export default function AIAlbumsPage() {
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [singleViewItem, setSingleViewItem] = useState(null);

  // In production, fetch from Google Drive
  const albums = AI_ALBUMS;

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
              AI Imagery – Concept Art from the Future
            </h1>
            <div className="mt-2 space-y-2 text-white/70">
              <p>
                AI is not here to replace artists. It’s here to expose who actually has ideas. I use it like directors use pre-vis:
                to prototype universes, characters, locations and moods before we spend real money and days on set.
              </p>
              <p>
                Inside these albums you’ll see concept art for heroes, gods, villains and cities that haven’t reached the screen yet—visual experiments where African aesthetics collide with sci-fi, supernatural horror, romance and surrealism.
                If your company is still arguing about whether AI is “allowed,” you’re already behind. I’m more interested in what we can build with it.
              </p>
            </div>
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
