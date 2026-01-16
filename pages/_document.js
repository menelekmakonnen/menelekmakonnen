import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                <link rel="icon" type="image/png" href="/favicon.png" />
                <meta name="description" content="Menelek Makonnen - Photography & Film Portfolio" />
            </Head>
            <body className="antialiased">
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}
