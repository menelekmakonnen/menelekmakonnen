import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SparklesIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import LoadingScreen from '../ui/LoadingScreen';
import AlbumGrid from '../album/AlbumGrid';
import MasonryAlbumGrid from '../album/MasonryAlbumGrid';
import SingleView from '../singleview/SingleView';
import FilterBar, { SORT_OPTIONS } from '@/components/common/FilterBar';

import { useApp } from '@/contexts/AppContext';

export default function AIAlbumsPage() {
  const {
    openSingleView,
    singleViewItem,
    closeSingleView,
    aiAlbums: albums,      // Use from context
    setAiAlbums: setAlbums // Use context setter
  } = useApp();

  // State for loading
  // Initialize loading to true ONLY if we don't have albums yet
  const [loading, setLoading] = useState(albums.length === 0);
  const [error, setError] = useState(null);
  const [selectedAlbum, setSelectedAlbum] = useState(null);

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
        const res = await fetch('/api/albums?type=ai');
        if (!res.ok) throw new Error('Failed to fetch albums');
        const data = await res.json();
        setAlbums(data);
      } catch (err) {
        console.error('Error fetching AI albums:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchAlbums();
  }, [albums.length, setAlbums]);

  const handleAlbumClick = async (album) => {
    try {
      // Fetch images for the album
      const res = await fetch(`/api/album/${album.id}`);
      if (!res.ok) throw new Error('Failed to fetch album images');
      const data = await res.json();

      setSelectedAlbum({
        ...album,
        images: data.images
      });
    } catch (err) {
      console.error('Error fetching album images:', err);
      // Maybe show toast error
    }
  };

  const handleItemClick = (item) => {
    openSingleView({ item, items: selectedAlbum.images, albums });
  };

  const handleBack = () => {
    if (singleViewItem) {
      closeSingleView();
    } else if (selectedAlbum) {
      setSelectedAlbum(null);
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
        (a.description || '').toLowerCase().includes(lower)
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
        result.sort(() => Math.random() - 0.5);
        break;
      case SORT_OPTIONS.NAME_ASC:
      default:
        result.sort((a, b) => (a.title || a.name || '').localeCompare(b.title || b.name || ''));
        break;
    }

    return result;
  }, [albums, searchTerm, sortOption]);


  if (selectedAlbum) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <button
          onClick={() => setSelectedAlbum(null)}
          className="mb-6 flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Albums
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">{selectedAlbum.title || selectedAlbum.name}</h1>
          <p className="mt-2 text-white/60 max-w-2xl">{selectedAlbum.description}</p>
        </div>

        <MasonryAlbumGrid
          items={selectedAlbum.items || selectedAlbum.images || []}
          onItemClick={handleItemClick}
        />

        {/* Single View */}
        <AnimatePresence>
          {singleViewItem && selectedAlbum && (
            <SingleView
              item={singleViewItem}
              items={selectedAlbum.items || selectedAlbum.images || []}
              albums={albums} // Pass all albums for navigation
              currentAlbumId={selectedAlbum.id}
              onClose={closeSingleView}
            />
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <h1 className="text-4xl font-bold text-white">AI Albums</h1>
        <p className="mt-2 text-white/60">Synthetic dreams and neural networks</p>
      </motion.div>

      {/* Filter Bar */}
      <div className="mb-8">
        <FilterBar
          onSearch={setSearchTerm}
          onSort={setSortOption}
        />
      </div>

      {loading ? (
        <AlbumGrid isLoading={true} variant="vertical" />
      ) : error ? (
        <div className="py-20 text-center text-white/40">{error}</div>
      ) : (
        <div className="mt-8">
          <AlbumGrid
            albums={processedAlbums}
            onAlbumClick={handleAlbumClick}
            variant="vertical"
          />
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && processedAlbums.length === 0 && (
        <div className="rounded-lg border border-white/10 bg-white/5 p-12 text-center text-white/60">
          <p>No albums found.</p>
        </div>
      )}
    </div>
  );
}
