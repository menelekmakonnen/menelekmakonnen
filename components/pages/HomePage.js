import { motion } from 'framer-motion';
import {
  FilmIcon,
  CameraIcon,
  SparklesIcon,
  VideoCameraIcon,
  BookOpenIcon,
  LinkIcon
} from '@heroicons/react/24/outline';
import { useApp } from '@/contexts/AppContext';
import { PAGES } from '@/lib/constants/pages';
import { LENS_MODES } from '@/lib/constants/camera';

export default function HomePage() {
  const { navigateToPage, cameraSettings } = useApp();
  const lensMode = cameraSettings?.lensMode || LENS_MODES.STANDARD;

  const sections = [
    {
      id: PAGES.LOREMAKER,
      title: 'Loremaker',
      description: 'Explore the universe of characters and worlds',
      icon: BookOpenIcon,
      color: 'from-purple-500/20 to-indigo-500/20',
      borderColor: 'border-purple-500/30'
    },
    {
      id: PAGES.FILMS,
      title: 'Films & Music Videos',
      description: 'Cinematic storytelling and visual narratives',
      icon: FilmIcon,
      color: 'from-red-500/20 to-orange-500/20',
      borderColor: 'border-red-500/30'
    },
    {
      id: PAGES.PHOTOGRAPHY,
      title: 'Photography',
      description: 'Capturing moments, freezing time',
      icon: CameraIcon,
      color: 'from-blue-500/20 to-cyan-500/20',
      borderColor: 'border-blue-500/30'
    },
    {
      id: PAGES.AI_ALBUMS,
      title: 'AI Albums',
      description: 'AI-generated visual explorations',
      icon: SparklesIcon,
      color: 'from-green-500/20 to-emerald-500/20',
      borderColor: 'border-green-500/30'
    },
    {
      id: PAGES.VIDEO_EDITS,
      title: 'Video Edits',
      description: 'Epic edits, beauty, behind the scenes, and learning',
      icon: VideoCameraIcon,
      color: 'from-yellow-500/20 to-amber-500/20',
      borderColor: 'border-yellow-500/30'
    },
    {
      id: PAGES.LINKS,
      title: 'Links & Contact',
      description: 'Connect across all platforms',
      icon: LinkIcon,
      color: 'from-pink-500/20 to-rose-500/20',
      borderColor: 'border-pink-500/30'
    }
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-16 text-center"
      >
        <h1 className="mb-4 text-5xl font-bold tracking-tight text-white md:text-6xl">
          Menelek Makonnen
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-white/60">
          Multidisciplinary creative exploring the intersection of storytelling,
          technology, and visual artistry. Director, world builder, and AI innovator
          crafting cinematic narratives, immersive universes, and visual experiences
          across film, photography, and emerging technologies.
        </p>
      </motion.div>

      {/* Section Cards */}
      <div
        className={`grid grid-cols-1 gap-6 ${
          lensMode === LENS_MODES.WIDE
            ? 'md:grid-cols-3 lg:grid-cols-4'
            : lensMode === LENS_MODES.TELEPHOTO
              ? 'md:grid-cols-2 lg:grid-cols-2'
              : lensMode === LENS_MODES.MACRO
                ? 'md:grid-cols-1'
                : 'md:grid-cols-2 lg:grid-cols-3'
        }`}
      >
        {sections.map((section, index) => (
          <SectionCard
            key={section.id}
            section={section}
            index={index}
            onClick={() => navigateToPage(section.id)}
          />
        ))}
      </div>

      {/* About Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-16 rounded-lg border border-white/10 bg-white/5 p-8 backdrop-blur-sm"
      >
        <h2 className="mb-4 text-2xl font-bold text-white">
          About Menelek Makonnen
        </h2>
        <p className="text-white/70">
          A creative technologist, world builder, and visual storyteller. Bridging the gap
          between imagination and execution through film, photography, AI, and immersive
          experiences. Every project is a journey into crafting narratives that resonate
          across multiple mediums.
        </p>
      </motion.div>

      {/* Navigation Hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-8 text-center text-sm text-white/40"
      >
        Use arrow keys or A/D to navigate between sections
      </motion.div>
    </div>
  );
}

function SectionCard({ section, index, onClick }) {
  const Icon = section.icon;

  return (
    <motion.button
      onClick={onClick}
      className={`group relative overflow-hidden rounded-lg border ${section.borderColor} bg-gradient-to-br ${section.color} p-6 text-left backdrop-blur-sm transition-all hover:scale-105`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Background gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/5 opacity-0 transition-opacity group-hover:opacity-100" />

      {/* Content */}
      <div className="relative">
        <motion.div
          className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-white/10 transition-transform"
          whileHover={{ scale: 1.08, rotate: -3 }}
          whileTap={{ scale: 1.15, rotate: 0 }}
        >
          <Icon className="h-6 w-6 text-white drop-shadow" />
        </motion.div>

        <h3 className="mb-2 text-xl font-bold text-white">
          {section.title}
        </h3>

        <p className="text-sm text-white/60">
          {section.description}
        </p>

        {/* Arrow indicator */}
        <div className="mt-4 flex items-center text-xs text-white/40 transition-all group-hover:text-white/60">
          <span>Explore</span>
          <svg
            className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </motion.button>
  );
}
