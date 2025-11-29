import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 space-y-4">
      <h1 className="text-4xl font-bold">Welcome to Menelek's site</h1>
      <nav className="space-x-4">
        <Link href="/photography" className="text-blue-500 underline">
          Photography Albums
        </Link>
        <Link href="/ai-albums" className="text-blue-500 underline">
          AI Albums
        </Link>
      </nav>
    </main>
  );
}
