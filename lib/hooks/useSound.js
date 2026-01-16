import { useCallback, useRef, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';

export default function useSound() {
    const { isSoundEnabled } = useApp();
    const audioContextRef = useRef(null);

    // Initialize AudioContext on first user interaction (handled lazily)
    const initAudio = useCallback(() => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }
    }, []);

    const playTone = useCallback((freq, type, duration, vol = 0.1) => {
        if (!isSoundEnabled || !audioContextRef.current) return;

        // Resume context if suspended (browser autoplay policy)
        if (audioContextRef.current.state === 'suspended') {
            audioContextRef.current.resume();
        }

        const ctx = audioContextRef.current;
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        // Envelope for pop-free sound
        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(vol, ctx.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + duration);
    }, [isSoundEnabled]);

    const playClick = useCallback(() => {
        initAudio();
        // High-pitch sci-fi blip
        playTone(1200, 'sine', 0.05, 0.05);
    }, [playTone, initAudio]);

    const playHover = useCallback(() => {
        initAudio();
        // Very subtle low tick
        playTone(800, 'triangle', 0.02, 0.02);
    }, [playTone, initAudio]);

    const playSuccess = useCallback(() => {
        initAudio();
        // Rising dual-tone
        setTimeout(() => playTone(800, 'sine', 0.1, 0.1), 0);
        setTimeout(() => playTone(1200, 'sine', 0.2, 0.05), 100);
    }, [playTone, initAudio]);

    const playError = useCallback(() => {
        initAudio();
        // Low buzzing square wave
        playTone(150, 'sawtooth', 0.3, 0.05);
    }, [playTone, initAudio]);

    return { playClick, playHover, playSuccess, playError };
}
