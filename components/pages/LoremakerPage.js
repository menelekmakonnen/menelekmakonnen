import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import ItemGrid from '../album/ItemGrid';
import SingleView from '../singleview/SingleView';
import { fetchLoremakerCharacters, getRandomCharacters, filterCharactersWithImages } from '@/lib/data/loremaker';
import { getDriveImageUrl } from '@/lib/data/googleDrive';

const CTA_CARD = {
  id: 'loremaker-cta',
  character: 'Enter the Universe',
  alias: 'Loremaker',
  shortDescription: 'See every character and arc on loremaker.cloud',
  coverImage: '',
  galleryImages: [],
  cta: true,
  thumbnail: '/images/loremaker-blur.svg',
  name: 'Enter the Universe',
  description: 'See every character and arc on loremaker.cloud'
};

export default function LoremakerPage() {
  const [characters, setCharacters] = useState([]);
  const [singleViewItem, setSingleViewItem] = useState(null);
  const [isPreloading, setIsPreloading] = useState(true);

  const preloadImages = async (urls = []) => {
    const uniqueUrls = [...new Set(urls.filter(Boolean))];
    await Promise.all(
      uniqueUrls.map(src =>
        new Promise(resolve => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => resolve();
          img.src = src;
        })
      )
    );
  };

  useEffect(() => {
    // Fetch from Google Sheets using Gviz API
    const loadCharacters = async () => {
      const allCharacters = await fetchLoremakerCharacters();
      const charactersWithImages = filterCharactersWithImages(allCharacters);
      const randomCharacters = getRandomCharacters(charactersWithImages, 20);
      const hydrated = randomCharacters.map(char => ({
        ...char,
        id: char.character,
        name: char.character,
        thumbnail: char.cta
          ? '/images/loremaker-blur.svg'
          : getDriveImageUrl(char.coverImage) || getDriveImageUrl(char.galleryImages[0]) || char.coverImage || char.galleryImages[0],
        description: char.shortDescription
      }));

      // Preload hero thumbnails so they are ready when rendered
      await preloadImages(hydrated.map(char => char.thumbnail));

      setCharacters([...hydrated, CTA_CARD]);
      setIsPreloading(false);
    };

    loadCharacters();
  }, []);

  const handleItemClick = (item) => {
    if (item.cta) {
      window.open('https://loremaker.cloud', '_blank');
      return;
    }
    setSingleViewItem(item);
  };

  const handleCloseSingleView = () => {
    setSingleViewItem(null);
  };

  const handleRefresh = async () => {
    setIsPreloading(true);
    const allCharacters = await fetchLoremakerCharacters();
    const charactersWithImages = filterCharactersWithImages(allCharacters);
    const randomCharacters = getRandomCharacters(charactersWithImages, 20);
    const hydrated = randomCharacters.map(char => ({
      ...char,
      id: char.character,
      name: char.character,
      thumbnail: char.cta
        ? '/images/loremaker-blur.svg'
        : getDriveImageUrl(char.coverImage) || getDriveImageUrl(char.galleryImages[0]) || char.coverImage || char.galleryImages[0],
      description: char.shortDescription
    }));
    await preloadImages(hydrated.map(char => char.thumbnail));
    setCharacters([...hydrated, CTA_CARD]);
    setIsPreloading(false);
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
          The Loremaker Universe – Not “The African X”, Just Its Own Giant
        </h1>
        <div className="mt-3 space-y-3 text-white/70">
          <p>
            I grew up loving worlds that didn’t look like me—Middle-earth, Westeros, Gotham, Metropolis—and I respect all of them. They proved that one obsessively built universe can change culture for decades.
            Now I’m building a universe that can stand beside them.
          </p>
          <p>
            The Loremaker Universe is a long-form conversation between African myth, diaspora reality, superheroes, magic, and science.
            You’ll find characters who could walk into a DC crossover and not get overshadowed, magic systems rooted in African history, and timelines designed to rival any epic canon.
            Read the profiles, connect the dots, and know the films, series, and games are coming. This is the blueprint.
          </p>
        </div>

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
      {isPreloading ? (
        <div className="flex min-h-[320px] items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/60">
          Preparing characters...
        </div>
      ) : characters.length > 0 ? (
        <ItemGrid
          items={characters}
          onItemClick={handleItemClick}
          type="vertical"
          descriptionOnHover
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
            onSelectCharacter={setSingleViewItem}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function CharacterSingleView({ character, characters, onClose, onSelectCharacter }) {
  const suggested = characters.filter(c => c.id !== character.id && !c.cta).sort(() => 0.5 - Math.random()).slice(0, 4);
  const galleryImages = [character.coverImage, ...(character.galleryImages || [])].filter(Boolean);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [character.id]);

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
                src={getDriveImageUrl(galleryImages[activeImageIndex]) || galleryImages[activeImageIndex]}
                alt={character.character}
                className="h-full w-full object-cover"
              />

              {galleryImages.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImageIndex(prev => (prev > 0 ? prev - 1 : galleryImages.length - 1))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-black/50 p-2 text-white transition-all hover:bg-white/10"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setActiveImageIndex(prev => (prev < galleryImages.length - 1 ? prev + 1 : 0))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-black/50 p-2 text-white transition-all hover:bg-white/10"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}

              {galleryImages.length > 1 && (
                <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2 rounded-full bg-black/50 px-3 py-1 text-xs text-white/80 backdrop-blur-sm">
                  {galleryImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`h-2 w-2 rounded-full ${idx === activeImageIndex ? 'bg-white' : 'bg-white/40'}`}
                    />
                  ))}
                </div>
              )}
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

          {suggested.length > 0 && (
            <div className="mt-6">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white/50">Other characters</h3>
              <div className="grid grid-cols-2 gap-3">
                {suggested.map(other => (
                  <motion.button
                    key={other.id}
                    onClick={() => onSelectCharacter(other)}
                    className="rounded-lg border border-white/10 bg-white/5 p-2 text-white/80 text-left transition-colors hover:border-white/40 hover:bg-white/10"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="aspect-video overflow-hidden rounded-md">
                      <img
                        src={getDriveImageUrl(other.coverImage) || getDriveImageUrl(other.galleryImages?.[0]) || other.coverImage || other.galleryImages?.[0]}
                        alt={other.character}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <p className="mt-2 text-sm font-semibold">{other.character}</p>
                  </motion.button>
                ))}
              </div>
            </div>
          )}
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
