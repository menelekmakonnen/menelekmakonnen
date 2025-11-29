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
    { name: 'Instagram', url: 'https://instagram.com/menelekmakonnen', icon: 'IG' },
    { name: 'YouTube', url: 'https://youtube.com/@menelekmakonnen', icon: 'YT' },
    { name: 'LinkedIn', url: 'https://linkedin.com/in/menelekmakonnen', icon: 'IN' },
    { name: 'X', url: 'https://x.com/menelekmakonnen', icon: 'X' }
  ];

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
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/5 backdrop-blur-sm transition-all duration-300 group-hover:border-white/40 group-hover:bg-white/10">
            <span className="text-xs font-medium text-white/80 group-hover:text-white">
              {link.icon}
            </span>
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
