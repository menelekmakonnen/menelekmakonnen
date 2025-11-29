import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { fetchLoremakerCharacters, getRandomCharacters, filterCharactersWithImages } from '@/lib/data/loremaker';
import { getDriveImageUrl } from '@/lib/data/googleDrive';
import ItemGrid from '../album/ItemGrid';
import SingleView from '../singleview/SingleView';

export default function LoremakerPage() {
  const [characters, setCharacters] = useState([]);
  const [singleViewItem, setSingleViewItem] = useState(null);

  useEffect(() => {
    // Fetch from Google Sheets using Gviz API
    const loadCharacters = async () => {
      const allCharacters = await fetchLoremakerCharacters();
      const charactersWithImages = filterCharactersWithImages(allCharacters);
      const randomCharacters = getRandomCharacters(charactersWithImages, 20);
      setCharacters(randomCharacters);
    };

    loadCharacters();
  }, []);

  const handleItemClick = (item) => {
    setSingleViewItem(item);
  };

  const handleCloseSingleView = () => {
    setSingleViewItem(null);
  };

  const handleRefresh = async () => {
    const allCharacters = await fetchLoremakerCharacters();
    const charactersWithImages = filterCharactersWithImages(allCharacters);
    const randomCharacters = getRandomCharacters(charactersWithImages, 20);
    setCharacters(randomCharacters);
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

        <div className="mt-4 flex gap-3">
          <motion.button
            onClick={handleRefresh}
            className="flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm text-white transition-all hover:bg-white/10"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Show 20 Random Characters
          </motion.button>

          <motion.a
            href="https://loremaker.cloud"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-sm text-purple-400 transition-all hover:bg-purple-500/20"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Full Loremaker Site</span>
            <ArrowTopRightOnSquareIcon className="h-4 w-4" />
          </motion.a>
        </div>
      </motion.div>

      {/* Character grid */}
      {characters.length > 0 ? (
        <ItemGrid
          items={characters.map(char => ({
            ...char,
            id: char.character,
            name: char.character,
            thumbnail: getDriveImageUrl(char.coverImage) || getDriveImageUrl(char.galleryImages[0]) || char.coverImage || char.galleryImages[0],
            description: char.shortDescription
          }))}
          onItemClick={handleItemClick}
          type="vertical"
        />
      ) : (
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
            characters={characters}
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
                src={getDriveImageUrl(character.coverImage) || getDriveImageUrl(character.galleryImages?.[0]) || character.coverImage || character.galleryImages?.[0]}
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
                    "{character.alias}"
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
