import Head from 'next/head';

export default function Photography() {
  return (
    <>
      <Head>
        <title>Photography Albums</title>
      </Head>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Photography Albums</h1>
        <iframe
          src="https://drive.google.com/embeddedfolderview?id=1G_6TgOtftLKwqRWjH-tFLuCgp_Oydor4#grid"
          width="100%"
          height="800"
          className="border-0"
          allowFullScreen
        ></iframe>
      </div>
    </>
  );
}
