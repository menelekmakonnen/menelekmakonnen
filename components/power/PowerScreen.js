import { useApp } from '@/contexts/AppContext';
import { PowerIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

export default function PowerScreen() {
    const { handlePowerOn, isBooting } = useApp();

    return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-black text-white">
            <motion.button
                onClick={handlePowerOn}
                className="group relative flex flex-col items-center justify-center gap-6 rounded-full p-12 transition-all hover:bg-white/5"
                disabled={isBooting}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <div className="relative">
                    {/* Glow effect */}
                    <div className={`absolute inset-0 rounded-full bg-white/20 blur-xl transition-opacity duration-500 ${isBooting ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`} />

                    <PowerIcon className={`relative h-24 w-24 transition-all duration-500 ${isBooting ? 'text-white animate-pulse' : 'text-white/50 group-hover:text-white'}`} />
                </div>

                <span className={`text-xl font-mono tracking-[0.2em] transition-all duration-500 ${isBooting ? 'opacity-100 animate-pulse' : 'opacity-30 group-hover:opacity-80'}`}>
                    {isBooting ? 'BOOTING SYSTEM...' : 'START SYSTEM'}
                </span>
            </motion.button>
        </div>
    );
}
