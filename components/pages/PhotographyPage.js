import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderIcon } from '@heroicons/react/24/outline';
import LoadingScreen from '../ui/LoadingScreen';
import AlbumGrid from '../album/AlbumGrid';
import MasonryAlbumGrid from '../album/MasonryAlbumGrid';
import ItemGrid from '../album/ItemGrid';
import SingleView from '../singleview/SingleView';
import { getDailyThumbnail } from '@/lib/utils/dailyCover';
import FilterBar, { SORT_OPTIONS } from '@/components/common/FilterBar';
import { shuffle } from '@/lib/utils/helpers';

import { useApp } from '@/contexts/AppContext';

export default function PhotographyPage() {
  const {
    currentAlbum: selectedAlbum,
    openAlbum,
    closeAlbum,
    singleViewItem,
    openSingleView,
    closeSingleView,
    photographyAlbums: albums,      // Use from context
    setPhotographyAlbums: setAlbums // Use context setter
  } = useApp();

  // State for loading
  // Initialize loading to true ONLY if we don't have albums yet
  const [loading, setLoading] = useState(albums.length === 0);
  const [error, setError] = useState(null);

  // Search & Sort State
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState(SORT_OPTIONS.NAME_ASC);

  // Fetch albums on mount if needed
  useEffect(() => {
    // If we already have albums, don't fetch again
    if (albums.length > 0) {
      setLoading(false);
      return;
    }

    async function fetchAlbums() {
      try {
        setLoading(true);
        const res = await fetch('/api/albums?type=photography');
        if (!res.ok) throw new Error('Failed to fetch albums');
        const data = await res.json();
        setAlbums(data);
      } catch (err) {
        console.error('Error fetching photography albums:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchAlbums();
  }, [albums.length, setAlbums]);




  // Use fetched albums instead of mock categories
  // Note: We might want to categorize them later based on folder structure
  // For now, we'll treat the top-level folders as "Categories" or "Albums"

  const handleAlbumClick = async (album) => {
    // If it's a folder, we might want to drill down
    // But for this simple version, let's treat top folders as albums that contain images
    // We need to fetch the images for this album
    try {
      // Show loading state for album?
      const res = await fetch(`/api/album/${album.id}`);
      if (!res.ok) throw new Error('Failed to fetch album images');
      const data = await res.json();

      openAlbum({
        ...album,
        images: data.images
      });
    } catch (err) {
      console.error('Error fetching album images:', err);
      // Maybe show toast error
    }
  };

  const handleItemClick = (item) => {
    openSingleView(item);
  };

  const handleBack = () => {
    if (singleViewItem) {
      closeSingleView();
    } else if (selectedAlbum) {
      closeAlbum();
    }
  };

  // Filter & Sort Logic
  const processedAlbums = useMemo(() => {
    let result = [...albums];

    // 1. Search
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(a =>
        (a.title || a.name || '').toLowerCase().includes(lower) ||
        (a.category || '').toLowerCase().includes(lower)
      );
    }

    // 2. Sort
    switch (sortOption) {
      case SORT_OPTIONS.NAME_DESC:
        result.sort((a, b) => (b.title || b.name || '').localeCompare(a.title || a.name || ''));
        break;
      case SORT_OPTIONS.DATE_NEWEST:
        result.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
        break;
      case SORT_OPTIONS.DATE_OLDEST:
        result.sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0));
        break;
      case SORT_OPTIONS.RANDOM:
        // Shuffle is handled by triggering a shuffle once, but here we just shuffle strictly on change?
        // Actually, pure random in render is bad.
        // We'll use a seed or just shuffle once when option selected.
        // For simplicity, we just shuffle copy.
        // BUT strict mode will shuffle incessantly. Better to let 'shuffle' util handle it once or assume array order is stable until sort changes
        // Let's rely on standard sort for random:
        // Actually, simple shuffle:
        result = result.sort(() => Math.random() - 0.5);
        break;
      case SORT_OPTIONS.NAME_ASC:
      default:
        result.sort((a, b) => (a.title || a.name || '').localeCompare(b.title || b.name || ''));
        break;
    }

    return result;
  }, [albums, searchTerm, sortOption]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">


      {!selectedAlbum ? (
        <>
          {/* Page header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 text-center"
          >
            <h1 className="text-4xl font-bold text-white">
              Photography
            </h1>
            <p className="mt-2 text-white/60">
              Captured moments and visual narratives
            </p>
          </motion.div>

          {/* Filter Bar */}
          <div className="mb-8">
            <FilterBar
              onSearch={setSearchTerm}
              onSort={setSortOption}
            />
          </div>

          {loading ? (
            <div className="flex justify-center p-12">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white"></div>
            </div>
          ) : error ? (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-6 text-center text-red-500">
              <p>Failed to load albums. Please try again later.</p>
            </div>
          ) : (
            <AlbumGrid
              albums={albums.map(album => ({
                ...album,
                thumbnail: getDailyThumbnail(album.id, album.images || album.items || []),
                items: album.images || album.items || []
              }))}
              onAlbumClick={handleAlbumClick}
              isLoading={loading}
              variant="vertical"
            />
          )}

          {/* Empty State */}
          {!loading && !error && albums.length === 0 && (
            <div className="rounded-lg border border-white/10 bg-white/5 p-12 text-center text-white/60">
              <p>No albums found.</p>
            </div>
          )}
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
              onClick={handleBack}
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
          </motion.div>

          {/* Images Grid */}
          {selectedAlbum.images && selectedAlbum.images.length > 0 ? (
            <MasonryAlbumGrid
              items={selectedAlbum.images}
              onItemClick={handleItemClick}
            />
          ) : (
            <div className="flex justify-center p-12 text-white/40">
              {/* If we are here, it means we clicked an album but images might still be loading if not handled eagerly above */}
              {/* Current logic fetches eagerly on click, so if empty here, it's truly empty */}
              <p>No images in this album.</p>
            </div>
          )}
        </>
      )}

      {/* Single View */}
      <AnimatePresence>
        {singleViewItem && selectedAlbum && (
          <SingleView
            item={singleViewItem}
            items={selectedAlbum.images || []}
            albums={albums} // Pass all albums for navigation
            currentAlbumId={selectedAlbum.id}
            onClose={closeSingleView}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
