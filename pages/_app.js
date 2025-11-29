import { useEffect } from 'react';
import Head from 'next/head';
import { AnimatePresence } from 'framer-motion';
import { AppProvider } from '@/contexts/AppContext';
import '@/styles/globals.css';

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon-active.svg" />
      </Head>
      <FaviconController />
      <AppProvider>
        <AnimatePresence mode="wait">
          <Component {...pageProps} />
        </AnimatePresence>
      </AppProvider>
    </>
  );
}

function FaviconController() {
  useEffect(() => {
    const activeIcon = '/favicon-active.svg';
    const mutedIcon = '/favicon-muted.svg';

    const setFavicon = (href) => {
      let link = document.querySelector("link[rel*='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = href;
    };

    const activate = () => setFavicon(activeIcon);
    const mute = () => setFavicon(mutedIcon);

    activate();
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        activate();
      } else {
        mute();
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('focus', activate);
    window.addEventListener('blur', mute);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('focus', activate);
      window.removeEventListener('blur', mute);
    };
  }, []);

  return null;
}
