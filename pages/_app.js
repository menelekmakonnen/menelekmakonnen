import { AnimatePresence } from 'framer-motion';
import { AppProvider } from '@/contexts/AppContext';
import '@/styles/globals.css';

export default function MyApp({ Component, pageProps }) {
  return (
    <AppProvider>
      <AnimatePresence mode="wait">
        <Component {...pageProps} />
      </AnimatePresence>
    </AppProvider>
  );
}
