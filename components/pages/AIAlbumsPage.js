import { motion } from 'framer-motion';
import Link from 'next/link';
import { AI_ALBUMS_DRIVE_FOLDER, getDriveFolderUrl } from '@/lib/data/googleDrive';

export default function AIAlbumsPage() {
  const embedUrl = `https://drive.google.com/embeddedfolderview?id=${AI_ALBUMS_DRIVE_FOLDER}#grid`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
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

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-lg">
        <iframe
          title="AI albums (Google Drive)"
          src={embedUrl}
          className="h-[70vh] w-full"
          allowFullScreen
          loading="lazy"
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-4 text-sm text-white/70">
        <Link
          href={`/drive/${AI_ALBUMS_DRIVE_FOLDER}`}
          className="rounded-full border border-white/10 px-4 py-2 transition hover:border-white/30 hover:text-white"
        >
          Open expanded view
        </Link>
        <a
          href={getDriveFolderUrl(AI_ALBUMS_DRIVE_FOLDER)}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-white/10 px-4 py-2 transition hover:border-white/30 hover:text-white"
        >
          View directly in Google Drive
        </a>
      </div>
    </div>
  );
}
