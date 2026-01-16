import { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

export default function CameraCursor() {
    const [position, setPosition] = useState({ x: 0, y: 0 });

    // Use springs for smooth movement
    const springConfig = { damping: 25, stiffness: 400 };
    const x = useSpring(0, springConfig);
    const y = useSpring(0, springConfig);

    useEffect(() => {
        const handleMouseMove = (e) => {
            x.set(e.clientX);
            y.set(e.clientY);
            setPosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [x, y]);

    return (
        <>
            <motion.div
                className="pointer-events-none fixed top-0 left-0 z-[100] h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white mix-blend-difference"
                style={{ x, y }}
            />
            <motion.div
                className="pointer-events-none fixed top-0 left-0 z-[100] h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white mix-blend-difference"
                style={{ x, y }}
            />
        </>
    );
}
