import { useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { PAGES } from '@/lib/constants/pages';

const PAGE_ORDER = [
    PAGES.HOME,
    PAGES.LOREMAKER,
    PAGES.FILMS,
    PAGES.PHOTOGRAPHY,
    PAGES.AI_ALBUMS,
    PAGES.VIDEO_EDITS,
    PAGES.LINKS,
    PAGES.BLOG
];

export default function useKeyboardNavigation() {
    const {
        currentPage,
        navigateToPage,
        currentAlbum,
        openAlbum,
        singleViewItem,
        photographyAlbums,
        aiAlbums
    } = useApp();

    useEffect(() => {
        const handleKeyDown = (e) => {
            // Ignore if user is typing in an input
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }

            // If viewing a single item, don't handle navigation (SingleView has its own controls)
            if (singleViewItem) {
                return;
            }

            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                e.preventDefault();

                // If an album is open, navigate between albums
                if (currentAlbum) {
                    let albums = [];

                    // Determine which album list to use
                    if (currentPage === PAGES.PHOTOGRAPHY) {
                        albums = photographyAlbums;
                    } else if (currentPage === PAGES.AI_ALBUMS) {
                        albums = aiAlbums;
                    } else if (currentPage === PAGES.FILMS || currentPage === PAGES.VIDEO_EDITS) {
                        // For Films/Video Edits, we would need the albums from those pages
                        // For now, skip album navigation on these pages
                        return;
                    }

                    if (albums.length === 0) return;

                    const currentIndex = albums.findIndex(a => a.id === currentAlbum.id);
                    if (currentIndex === -1) return;

                    let nextIndex;
                    if (e.key === 'ArrowRight') {
                        nextIndex = (currentIndex + 1) % albums.length;
                    } else {
                        nextIndex = (currentIndex - 1 + albums.length) % albums.length;
                    }

                    openAlbum(albums[nextIndex]);
                } else {
                    // Navigate between pages
                    const currentIndex = PAGE_ORDER.indexOf(currentPage);
                    if (currentIndex === -1) return;

                    let nextIndex;
                    if (e.key === 'ArrowRight') {
                        nextIndex = (currentIndex + 1) % PAGE_ORDER.length;
                    } else {
                        nextIndex = (currentIndex - 1 + PAGE_ORDER.length) % PAGE_ORDER.length;
                    }

                    navigateToPage(PAGE_ORDER[nextIndex]);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentPage, currentAlbum, singleViewItem, photographyAlbums, aiAlbums, navigateToPage, openAlbum]);
}
