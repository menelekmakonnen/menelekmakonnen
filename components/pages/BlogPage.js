import { useState } from 'react';
import { motion } from 'framer-motion';
import { DocumentTextIcon, CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';

// Placeholder blog posts - replace with CMS or API
const BLOG_POSTS = [
    {
        id: 1,
        title: 'Welcome to My Blog',
        excerpt: 'This is where I share my thoughts on creativity, technology, and the intersection of art and innovation.',
        date: '2026-01-15',
        readTime: '5 min read',
        slug: 'welcome-to-my-blog',
        category: 'General'
    },

    {
        id: 2,
        title: 'The Future of Visual Storytelling',
        excerpt: 'Exploring how emerging technologies are reshaping the way we tell stories through visual media.',
        date: '2026-01-10',
        readTime: '8 min read',
        slug: 'future-of-visual-storytelling',
        category: 'Film & Photography'
    },
    {
        id: 3,
        title: 'Behind the Camera: My Creative Process',
        excerpt: 'A deep dive into my approach to composition, lighting, and capturing authentic moments.',
        date: '2026-01-05',
        readTime: '6 min read',
        slug: 'behind-the-camera',
        category: 'Photography'
    }
];

export default function BlogPage() {
    const [selectedCategory, setSelectedCategory] = useState('All');

    const categories = ['All', 'General', 'Film & Photography', 'Photography', 'Technology'];

    const filteredPosts = selectedCategory === 'All'
        ? BLOG_POSTS
        : BLOG_POSTS.filter(post => post.category === selectedCategory);

    return (
        <div className="relative min-h-screen w-full p-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mx-auto max-w-4xl"
            >
                <h1 className="font-light text-6xl tracking-wider text-white mb-2">Blog</h1>
                <p className="text-white/60 text-lg">Thoughts, stories, and insights</p>

                {/* Category Filter */}
                <div className="mt-8 flex flex-wrap gap-2">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-2 rounded-full border transition-all ${selectedCategory === cat
                                    ? 'border-white bg-white/10 text-white'
                                    : 'border-white/20 text-white/60 hover:border-white/40 hover:text-white/80'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* Blog Posts Grid */}
            <div className="mx-auto max-w-4xl mt-12 space-y-8">
                {filteredPosts.length === 0 ? (
                    <div className="text-center text-white/40 py-20">
                        <DocumentTextIcon className="h-16 w-16 mx-auto mb-4 opacity-20" />
                        <p>No posts found in this category</p>
                    </div>
                ) : (
                    filteredPosts.map((post, index) => (
                        <motion.article
                            key={post.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="group cursor-pointer glass glass-hover p-6 rounded-lg"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <span className="text-xs uppercase tracking-widest text-white/40">
                                    {post.category}
                                </span>
                                <div className="flex items-center gap-4 text-xs text-white/40">
                                    <span className="flex items-center gap-1">
                                        <CalendarIcon className="h-3 w-3" />
                                        {new Date(post.date).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <ClockIcon className="h-3 w-3" />
                                        {post.readTime}
                                    </span>
                                </div>
                            </div>

                            <h2 className="text-2xl font-light text-white mb-3 group-hover:text-white/80 transition-colors">
                                {post.title}
                            </h2>

                            <p className="text-white/60 leading-relaxed">
                                {post.excerpt}
                            </p>

                            <div className="mt-4 flex items-center text-sm text-white/40 group-hover:text-white/60 transition-colors">
                                <span>Read more →</span>
                            </div>
                        </motion.article>
                    ))
                )}
            </div>

            {/* Coming Soon Notice */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mx-auto max-w-4xl mt-12 text-center text-white/40 text-sm"
            >
                <p>More posts coming soon. Stay tuned.</p>
            </motion.div>
        </div>
    );
}
