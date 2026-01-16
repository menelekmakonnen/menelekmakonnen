import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowTopRightOnSquareIcon, MagnifyingGlassIcon, FunnelIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import LoadingScreen from '../ui/LoadingScreen';
import { fetchLoremakerCharacters, getRandomCharacters, filterCharactersWithImages } from '@/lib/data/loremaker';
import { getDriveImageUrl } from '@/lib/data/googleDrive';
import MasonryAlbumGrid from '../album/MasonryAlbumGrid';
import ItemGrid from '../album/ItemGrid';
import SingleView from '../singleview/SingleView';

import { useApp } from '@/contexts/AppContext';

export default function LoremakerPage() {
  const { singleViewItem, openSingleView, closeSingleView } = useApp();
  const [allCharacters, setAllCharacters] = useState([]); // Full dataset
  const [displayedCharacters, setDisplayedCharacters] = useState([]); // Currently shown
  const [loading, setLoading] = useState(true);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [availableFactions, setAvailableFactions] = useState([]);

  useEffect(() => {
    // Fetch from Google Sheets using Gviz API
    const loadCharacters = async () => {
      try {
        setLoading(true);
        const all = await fetchLoremakerCharacters();
        if (!all) throw new Error('No data returned');

        const withImages = filterCharactersWithImages(all);
        setAllCharacters(withImages);

        const factions = [...new Set(withImages.map(c => c.faction).filter(Boolean))].slice(0, 5);
        setAvailableFactions(['All', ...factions]);

        const randoms = getRandomCharacters(withImages, 20);
        setDisplayedCharacters(randoms);
      } catch (err) {
        console.error('Failed to load Loremaker characters:', err);
        // Fallback to empty to prevent crash
        setAllCharacters([]);
        setDisplayedCharacters([]);
      } finally {
        setLoading(false);
      }
    };

    loadCharacters();
  }, []);

  // Handle Search & Filter
  useEffect(() => {
    if (!allCharacters.length) return;

    let result = allCharacters;

    // 1. Filter by Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(c =>
        c.character?.toLowerCase().includes(q) ||
        c.alias?.toLowerCase().includes(q) ||
        c.faction?.toLowerCase().includes(q) ||
        c.location?.toLowerCase().includes(q)
      );
    }

    // 2. Filter by Chip (Faction)
    if (activeFilter !== 'All') {
      result = result.filter(c => c.faction === activeFilter);
    }

    // 3. Selection Strategy
    // If searching or filtering, show all results.
    // If clearing everything (Search empty, Filter All), show random 20 again to avoid massive list?
    // Actually, if user clears search, they might expect the "Home" state.

    if (!searchQuery && activeFilter === 'All') {
      // We don't want to re-randomize every keystroke, so only randomize if we explicitly reset?
      // For now, let's just show up to 50 items if no search, or keep the previous randoms?
      // Let's rely on the initial randoms if inputs are empty, UNLESS we just cleared them.
      // Simplification: If inputs empty, show random 20. But verify dependency loop.
      // To avoid loop, we won't put random logic here. We'll handle "Reset" separately.
    } else {
      setDisplayedCharacters(result.slice(0, 50)); // Cap at 50 results for perf
    }
  }, [searchQuery, activeFilter, allCharacters]);

  const handleItemClick = (item) => {
    openSingleView(item);
  };

  const handleCloseSingleView = () => {
    closeSingleView();
  };

  const handleRefresh = () => {
    setSearchQuery('');
    setActiveFilter('All');
    const randoms = getRandomCharacters(allCharacters, 20);
    setDisplayedCharacters(randoms);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">


      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-white">
          Loremaker Universe
        </h1>
        <p className="mt-2 text-white/60">
          Explore the universe of characters and worlds
        </p>

        <div className="mt-6 flex flex-col gap-4">
          {/* Search Bar */}
          <div className="relative max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Search characters, factions, locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-white/20 bg-white/5 py-2 pl-10 pr-4 text-white placeholder-white/40 backdrop-blur-sm transition-all focus:border-purple-500/50 focus:bg-white/10 focus:outline-none"
            />
          </div>

          {/* Filters & Actions */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Filter Chips */}
            {availableFactions.map((faction) => (
              <button
                key={faction}
                onClick={() => setActiveFilter(faction)}
                className={`rounded-full border px-3 py-1 text-xs transition-all ${activeFilter === faction
                  ? 'border-purple-500/50 bg-purple-500/20 text-purple-200'
                  : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10'
                  }`}
              >
                {faction}
              </button>
            ))}

            <div className="h-4 w-px bg-white/10 mx-2" />

            {/* Randomize Button */}
            <motion.button
              onClick={handleRefresh}
              className="flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-3 py-1.5 text-sm text-white transition-all hover:bg-white/10"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowPathIcon className="h-4 w-4" />
              <span>Shuffle</span>
            </motion.button>

            {/* External Link */}
            <motion.a
              href="https://loremaker.cloud"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg border border-purple-500/30 bg-purple-500/10 px-3 py-1.5 text-sm text-purple-400 transition-all hover:bg-purple-500/20"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Full Site</span>
              <ArrowTopRightOnSquareIcon className="h-4 w-4" />
            </motion.a>
          </div>
        </div>
      </motion.div>

      {/* Character grid */}
      <ItemGrid
        isLoading={loading}
        items={displayedCharacters.map(char => ({
          ...char,
          id: char.character,
          name: char.character,
          thumbnail: getDriveImageUrl(char.coverImage || char.galleryImages[0]),
          description: char.shortDescription
        }))}
        onItemClick={handleItemClick}
        type="vertical"
      />

      {!loading && displayedCharacters.length === 0 && (
        <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/60">
          <div className="text-center">
            <p className="mb-4">No characters with images found.</p>
            <motion.a
              href="https://loremaker.cloud"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-purple-400 transition-all hover:bg-purple-500/20"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Visit Full Loremaker Site</span>
              <ArrowTopRightOnSquareIcon className="h-4 w-4" />
            </motion.a>
          </div>
        </div>
      )}

      {/* Single View with character details */}
      <AnimatePresence>
        {singleViewItem && (
          <CharacterSingleView
            character={singleViewItem}
            characters={allCharacters}
            onClose={handleCloseSingleView}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function CharacterSingleView({ character, characters, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/95 backdrop-blur-md"
    >
      <div className="min-h-screen p-8">
        <div className="mx-auto max-w-5xl">
          {/* Close button */}
          <button
            onClick={onClose}
            className="mb-4 rounded-full border border-white/20 bg-black/50 p-2 text-white transition-all hover:bg-white/10"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Character content */}
          <div className="grid gap-8 md:grid-cols-2">
            {/* Image */}
            <div className="relative aspect-square overflow-hidden rounded-lg">
              <img
                src={getDriveImageUrl(character.coverImage || character.galleryImages?.[0])}
                alt={character.character}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Details */}
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-white">
                  {character.character}
                </h2>
                {character.alias && (
                  <p className="mt-1 text-lg text-white/60">
                    &quot;{character.alias}&quot;
                  </p>
                )}
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-2 gap-4">
                {character.gender && (
                  <MetadataItem label="Gender" value={character.gender} />
                )}
                {character.alignment && (
                  <MetadataItem label="Alignment" value={character.alignment} />
                )}
                {character.location && (
                  <MetadataItem label="Location" value={character.location} />
                )}
                {character.era && (
                  <MetadataItem label="Era" value={character.era} />
                )}
                {character.status && (
                  <MetadataItem label="Status" value={character.status} />
                )}
                {character.faction && (
                  <MetadataItem label="Faction" value={character.faction} />
                )}
              </div>

              {/* Powers */}
              {character.powers && (
                <div>
                  <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-white/40">
                    Powers
                  </h3>
                  <p className="text-white/80">{character.powers}</p>
                </div>
              )}

              {/* Description */}
              {character.shortDescription && (
                <div>
                  <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-white/40">
                    Description
                  </h3>
                  <p className="text-white/80">{character.shortDescription}</p>
                </div>
              )}

              {/* Stories */}
              {character.stories && (
                <div>
                  <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-white/40">
                    Appears In
                  </h3>
                  <p className="text-white/80">{character.stories}</p>
                </div>
              )}

              {/* Read More */}
              <motion.a
                href="https://loremaker.cloud"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-purple-500/30 bg-purple-500/10 px-6 py-3 text-purple-400 transition-all hover:bg-purple-500/20"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Read More on Loremaker</span>
                <ArrowTopRightOnSquareIcon className="h-5 w-5" />
              </motion.a>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function MetadataItem({ label, value }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
        {label}
      </p>
      <p className="mt-1 text-white">{value}</p>
    </div>
  );
}
