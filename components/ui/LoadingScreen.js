import { motion } from 'framer-motion';

export default function LoadingScreen({ message = 'Loading Gallery Content...' }) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md">
            <div className="relative flex flex-col items-center">
                {/* Animated Scanner Ring */}
                <div className="relative h-32 w-32">
                    <motion.div
                        className="absolute inset-0 rounded-full border-2 border-white/10"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1.2, opacity: 1 }}
                        transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
                    />
                    <motion.div
                        className="absolute inset-0 rounded-full border-t-2 border-white"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                    />

                    {/* Inner Pulse */}
                    <motion.div
                        className="absolute inset-4 rounded-full bg-white/5 shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                </div>

                {/* Text and Progress */}
                <div className="mt-8 text-center">
                    <motion.h3
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xl font-light tracking-[0.2em] text-white uppercase"
                    >
                        {message}
                    </motion.h3>

                    <div className="mt-4 h-[1px] w-48 overflow-hidden bg-white/10">
                        <motion.div
                            className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,1)]"
                            initial={{ x: '-100%' }}
                            animate={{ x: '100%' }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        />
                    </div>

                    <div className="mt-2 flex justify-between text-[10px] tracking-widest text-white/30 uppercase">
                        <span>Scanning Drive</span>
                        <span>Allocating VRAM</span>
                    </div>
                </div>

                {/* HUD Deco Elements */}
                <div className="absolute -top-20 -left-20 h-10 w-10 border-l border-t border-white/20" />
                <div className="absolute -top-20 -right-20 h-10 w-10 border-r border-t border-white/20" />
                <div className="absolute -bottom-20 -left-20 h-10 w-10 border-l border-b border-white/20" />
                <div className="absolute -bottom-20 -right-20 h-10 w-10 border-r border-b border-white/20" />
            </div>
        </div>
    );
}
