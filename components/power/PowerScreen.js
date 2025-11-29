import { motion } from 'framer-motion';
import { PowerIcon } from '@heroicons/react/24/outline';
import { useApp } from '@/contexts/AppContext';

export default function PowerScreen() {
  const { handlePowerOn, isBooting } = useApp();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black"
    >
      {/* Power Button */}
      <motion.button
        onClick={handlePowerOn}
        disabled={isBooting}
        className="group relative mb-12"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="relative">
          {/* Glow effect */}
          <motion.div
            className="absolute inset-0 rounded-full bg-white opacity-0 blur-2xl group-hover:opacity-20"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Power icon */}
          <div className="relative flex h-32 w-32 items-center justify-center rounded-full border-2 border-white/30 bg-white/5 backdrop-blur-sm transition-all duration-300 group-hover:border-white/60 group-hover:bg-white/10">
            <PowerIcon className="h-16 w-16 text-white transition-transform duration-300 group-hover:rotate-90" />
          </div>
        </div>

        {/* Label */}
        <motion.p
          className="mt-6 text-center text-sm font-light tracking-widest text-white/60"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {isBooting ? 'BOOTING...' : 'PRESS TO POWER ON'}
        </motion.p>
      </motion.button>

      {/* Social Media Icons */}
      <SocialMediaIcons />

      {/* Boot sequence overlay */}
      {isBooting && <BootSequence />}
    </motion.div>
  );
}

function SocialMediaIcons() {
  const socialLinks = [
    { name: 'Instagram', url: 'https://instagram.com/menelekmakonnen', icon: 'instagram' },
    { name: 'YouTube', url: 'https://youtube.com/@menelekmakonnen', icon: 'youtube' },
    { name: 'LinkedIn', url: 'https://linkedin.com/in/menelekmakonnen', icon: 'linkedin' },
    { name: 'X', url: 'https://x.com/menelekmakonnen', icon: 'x' }
  ];

  const renderIcon = (icon) => {
    switch (icon) {
      case 'instagram':
        return (
          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path d="M12 2.2c3.2 0 3.6.01 4.9.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.9s-.01 3.64-.07 4.9c-.15 3.23-1.67 4.77-4.92 4.92-1.26.06-1.65.07-4.9.07s-3.64-.01-4.9-.07c-3.26-.15-4.77-1.69-4.92-4.92C2.2 15.86 2.2 15.48 2.2 12.25s0-3.64.06-4.9C2.41 4.1 3.92 2.56 7.18 2.41 8.44 2.35 8.82 2.2 12 2.2zm0-2.2C8.7 0 8.28.02 7 .08 2.64.28.22 2.7.02 7.04 0 8.32 0 8.74 0 12.02s.02 3.7.08 4.98c.2 4.34 2.62 6.76 6.96 6.96 1.28.06 1.7.08 4.98.08s3.7-.02 4.98-.08c4.34-.2 6.76-2.62 6.96-6.96.06-1.28.08-1.7.08-4.98s-.02-3.7-.08-4.98C23.78 2.64 21.36.22 17.02.02 15.74 0 15.32 0 12.04 0H12z" />
            <path d="M12 5.84A6.16 6.16 0 1 0 18.16 12 6.17 6.17 0 0 0 12 5.84zm0 10.16A4 4 0 1 1 16 12a4 4 0 0 1-4 4zm6.41-11.85a1.44 1.44 0 1 0 1.44 1.44 1.44 1.44 0 0 0-1.44-1.44z" />
          </svg>
        );
      case 'youtube':
        return (
          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.13C19.5 3.54 12 3.54 12 3.54s-7.5 0-9.38.52A3.02 3.02 0 0 0 .5 6.19 31.7 31.7 0 0 0 0 12a31.7 31.7 0 0 0 .5 5.81 3.02 3.02 0 0 0 2.12 2.13C4.5 20.46 12 20.46 12 20.46s7.5 0 9.38-.52a3.02 3.02 0 0 0 2.12-2.13A31.7 31.7 0 0 0 24 12a31.7 31.7 0 0 0-.5-5.81zM9.55 15.57V8.43L15.82 12z" />
          </svg>
        );
      case 'linkedin':
        return (
          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM6.78 20.45H3.55V9h3.56zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45C23.2 24 24 23.23 24 22.27V1.73C24 .77 23.2 0 22.22 0z" />
          </svg>
        );
      case 'x':
        return (
          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path d="M18.244 2.25h3.308l-7.227 8.26L22.5 21.75h-6.531l-5.12-6.708-5.854 6.708H1.688l7.73-8.86L1.5 2.25h6.656l4.617 6.056z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      className="flex gap-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      {socialLinks.map((link, index) => (
        <motion.a
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 + index * 0.1 }}
          whileHover={{ scale: 1.1, y: -2 }}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white backdrop-blur-sm transition-all duration-300 group-hover:border-white/40 group-hover:bg-white/10">
            {renderIcon(link.icon)}
          </div>

          {/* Tooltip */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-white/10 px-2 py-1 text-xs text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
            {link.name}
          </div>
        </motion.a>
      ))}
    </motion.div>
  );
}

function BootSequence() {
  const bootMessages = [
    'Initializing systems...',
    'Loading camera modules...',
    'Calibrating sensors...',
    'Mounting image processor...',
    'Activating viewfinder...',
    'Ready'
  ];

  return (
    <motion.div
      className="absolute inset-0 z-10 flex items-center justify-center bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="w-full max-w-md space-y-4 px-8">
        {bootMessages.map((message, index) => (
          <motion.div
            key={message}
            className="font-mono text-sm text-green-400"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.3, duration: 0.2 }}
          >
            <span className="mr-2">&gt;</span>
            {message}
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
            >
              _
            </motion.span>
          </motion.div>
        ))}

        {/* Progress bar */}
        <motion.div
          className="mt-8 h-1 w-full overflow-hidden rounded-full bg-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-green-400 to-emerald-500"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 1.8, ease: 'easeInOut' }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
