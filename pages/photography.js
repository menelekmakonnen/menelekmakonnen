import Link from 'next/link';



const albums = [
  { id: '1q7CcuPAmo0woea1YGazreweS5fk8tiy', name: 'Beauty' },
  { id: '1BjHTapDOAvfdhyuGmN3Q_skSY4QhNX-W', name: 'Professional' },
]

export default function Photography() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 space-y-4">
      <h1 className="text-3xl font-bold">Photography Albums</h1>
      <ul className="space-y-2">
        {albums.map((album) => (
          <li key={album.id}>
            <Link href={`/gallery/${album.id}`} className="text-blue-500 underline">
              {album.name}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
