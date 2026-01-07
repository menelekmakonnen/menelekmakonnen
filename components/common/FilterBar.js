import { useState } from 'react';
import { motion } from 'framer-motion';
import { MagnifyingGlassIcon, BarsArrowDownIcon, ArrowsUpDownIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils/helpers';

export const SORT_OPTIONS = {
    NAME_ASC: 'name_asc',
    NAME_DESC: 'name_desc',
    DATE_NEWEST: 'date_newest',
    DATE_OLDEST: 'date_oldest',
    RANDOM: 'random',
};

export default function FilterBar({
    onSearch,
    onSort,
    placeholder = "Search albums...",
    className
}) {
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [activeSort, setActiveSort] = useState(SORT_OPTIONS.NAME_ASC);

    const handleSort = (option) => {
        setActiveSort(option);
        onSort(option);
        setIsSortOpen(false);
    };

    const getSortLabel = (option) => {
        switch (option) {
            case SORT_OPTIONS.NAME_ASC: return 'Name (A-Z)';
            case SORT_OPTIONS.NAME_DESC: return 'Name (Z-A)';
            case SORT_OPTIONS.DATE_NEWEST: return 'Newest First';
            case SORT_OPTIONS.DATE_OLDEST: return 'Oldest First';
            case SORT_OPTIONS.RANDOM: return 'Random Shuffle';
            default: return 'Sort';
        }
    };

    return (
        <div className={cn("relative z-10 mx-auto flex max-w-2xl gap-3", className)}>
            {/* Search Input */}
            <div className="relative flex-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <MagnifyingGlassIcon className="h-5 w-5 text-white/40" />
                </div>
                <input
                    type="text"
                    onChange={(e) => onSearch(e.target.value)}
                    placeholder={placeholder}
                    className="w-full rounded-lg border border-white/10 bg-black/50 py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/30 backdrop-blur-md focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/30"
                />
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
                <button
                    onClick={() => setIsSortOpen(!isSortOpen)}
                    className="flex h-full items-center gap-2 rounded-lg border border-white/10 bg-black/50 px-4 text-sm font-medium text-white backdrop-blur-md transition-colors hover:bg-white/5"
                >
                    <ArrowsUpDownIcon className="h-4 w-4 text-white/60" />
                    <span className="hidden sm:inline">{getSortLabel(activeSort)}</span>
                </button>

                {isSortOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 top-full mt-2 w-48 overflow-hidden rounded-lg border border-white/10 bg-black/90 p-1 shadow-xl backdrop-blur-xl"
                        onMouseLeave={() => setIsSortOpen(false)}
                    >
                        {[
                            { id: SORT_OPTIONS.NAME_ASC, label: 'Name (A-Z)' },
                            { id: SORT_OPTIONS.NAME_DESC, label: 'Name (Z-A)' },
                            { id: SORT_OPTIONS.DATE_NEWEST, label: 'Newest First' },
                            { id: SORT_OPTIONS.DATE_OLDEST, label: 'Oldest First' },
                            { id: SORT_OPTIONS.RANDOM, label: 'Random Shuffle' },
                        ].map((opt) => (
                            <button
                                key={opt.id}
                                onClick={() => handleSort(opt.id)}
                                className={cn(
                                    "flex w-full items-center px-3 py-2 text-left text-sm transition-colors rounded-md",
                                    activeSort === opt.id
                                        ? "bg-white/20 text-white"
                                        : "text-white/60 hover:bg-white/10 hover:text-white"
                                )}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
}
