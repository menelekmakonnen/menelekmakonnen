import { motion } from 'framer-motion';
import Link from 'next/link';
import { PHOTOGRAPHY_DRIVE_FOLDER, getDriveFolderUrl } from '@/lib/data/googleDrive';

export default function PhotographyPage() {
  const embedUrl = `https://drive.google.com/embeddedfolderview?id=${PHOTOGRAPHY_DRIVE_FOLDER}#grid`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
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
          <p className="text-white/60">
            Beauty and Professional live shoots each sit in their own subfolders—open them inside the embed below or in a full-width view.
          </p>
        </div>
      </motion.div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-lg">
        <iframe
          title="Photography albums (Google Drive)"
          src={embedUrl}
          className="h-[70vh] w-full"
          allowFullScreen
          loading="lazy"
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-4 text-sm text-white/70">
        <Link
          href={`/drive/${PHOTOGRAPHY_DRIVE_FOLDER}`}
          className="rounded-full border border-white/10 px-4 py-2 transition hover:border-white/30 hover:text-white"
        >
          Open expanded view
        </Link>
        <a
          href={getDriveFolderUrl(PHOTOGRAPHY_DRIVE_FOLDER)}
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
