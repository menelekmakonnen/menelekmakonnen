import { useEffect, useState } from 'react';
import { motion, useMotionValue } from 'framer-motion';

export default function CameraCursor() {
    const [isClicking, setIsClicking] = useState(false);
    const cursorX = useMotionValue(0);
    const cursorY = useMotionValue(0);

    useEffect(() => {
        const moveCursor = (e) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
        };

        const handleMouseDown = () => setIsClicking(true);
        const handleMouseUp = () => setIsClicking(false);

        window.addEventListener('mousemove', moveCursor);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [cursorX, cursorY]);

    return (
        <>
            {/* Camera Reticle Cursor */}
            <motion.div
                className="pointer-events-none fixed top-0 left-0 z-[9999] mix-blend-difference"
                style={{
                    x: cursorX,
                    y: cursorY,
                    translateX: '-50%',
                    translateY: '-50%'
                }}
            >
                {/* Center dot */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className={`rounded-full bg-white transition-all duration-150 ${isClicking ? 'h-2 w-2' : 'h-1 w-1'}`} />
                </div>

                {/* Outer reticle circle */}
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white transition-all duration-150 ${isClicking ? 'h-6 w-6' : 'h-8 w-8'}`} />

                {/* Corner brackets (camera viewfinder style) */}
                <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-150 ${isClicking ? 'scale-75' : 'scale-100'}`}
                    fill="none"
                    stroke="white"
                    strokeWidth="1"
                >
                    {/* Top-left */}
                    <path d="M 4 8 L 4 4 L 8 4" />
                    {/* Top-right */}
                    <path d="M 24 4 L 28 4 L 28 8" />
                    {/* Bottom-left */}
                    <path d="M 4 24 L 4 28 L 8 28" />
                    {/* Bottom-right */}
                    <path d="M 24 28 L 28 28 L 28 24" />
                </svg>

                {/* Crosshair lines */}
                <div className={`absolute top-1/2 left-1/2 h-px bg-white transition-all duration-150 ${isClicking ? 'w-3 -translate-x-1/2' : 'w-4 -translate-x-1/2'}`} />
                <div className={`absolute top-1/2 left-1/2 w-px bg-white transition-all duration-150 ${isClicking ? 'h-3 -translate-y-1/2' : 'h-4 -translate-y-1/2'}`} />
            </motion.div>
        </>
    );
}
