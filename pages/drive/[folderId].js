import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function DriveFolderView() {
  const router = useRouter();
  const { folderId } = router.query;

  if (!folderId) return null;

  const embedUrl = `https://drive.google.com/embeddedfolderview?id=${folderId}#grid`;

  return (
    <>
      <Head>
        <title>Drive Gallery | Menelek Makonnen</title>
        <meta
          name="description"
          content="Live Google Drive gallery embed for Menelek Makonnen albums."
        />
      </Head>
      <main className="min-h-screen bg-black text-white">
        <div className="mx-auto max-w-6xl px-4 py-10 space-y-6">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.25em] text-white/50">Google Drive</p>
            <h1 className="text-3xl font-semibold">Embedded album view</h1>
            <p className="text-white/70">This pulls live from the shared folder—no caching, no fallbacks.</p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-xl">
            <iframe
              title="Google Drive embedded album"
              src={embedUrl}
              className="h-[80vh] w-full"
              allowFullScreen
              sandbox="allow-same-origin allow-scripts"
              loading="lazy"
            />
          </div>

          <div className="flex flex-wrap gap-3 text-sm text-white/70">
            <Link
              href="/"
              className="rounded-full border border-white/10 px-4 py-2 transition hover:border-white/30 hover:text-white"
            >
              ← Back home
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
