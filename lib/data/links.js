// Links and social media data

export const PERSONAL_LINKS = [
  {
    id: 'instagram',
    platform: 'Instagram',
    username: '@menelek.makonnen',
    url: 'https://instagram.com/menelek.makonnen',
    description: 'Personal Instagram',
    category: 'personal',
    icon: 'instagram',
    color: 'from-pink-500 to-purple-500'
  },
  {
    id: 'youtube',
    platform: 'YouTube',
    username: '@menelekmakonnen',
    url: 'https://youtube.com/@menelekmakonnen',
    description: 'Main YouTube Channel',
    category: 'personal',
    icon: 'youtube',
    color: 'from-red-500 to-red-600'
  },
  {
    id: 'linkedin',
    platform: 'LinkedIn',
    username: 'menelekmakonnen',
    url: 'https://linkedin.com/in/menelekmakonnen',
    description: 'Professional Network',
    category: 'personal',
    icon: 'linkedin',
    color: 'from-blue-600 to-blue-700'
  },
  {
    id: 'email',
    platform: 'Email',
    username: 'admin@menelekmakonnen.com',
    url: 'mailto:admin@menelekmakonnen.com',
    description: 'Get in touch',
    category: 'contact',
    icon: 'email',
    color: 'from-gray-600 to-gray-700'
  }
];

export const PROFESSIONAL_LINKS = [
  {
    id: 'director-youtube',
    platform: 'YouTube (Director)',
    username: '@director_menelek',
    url: 'https://www.youtube.com/@director_menelek',
    description: 'Director Channel',
    category: 'professional',
    icon: 'youtube',
    color: 'from-red-500 to-orange-500'
  },
  {
    id: 'director-instagram',
    platform: 'Instagram (Director)',
    username: '@menelek.makonnen',
    url: 'https://www.instagram.com/menelek.makonnen/',
    description: 'Director Instagram',
    category: 'professional',
    icon: 'instagram',
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'loremaker-instagram',
    platform: 'Instagram (Loremaker)',
    username: '@lore.maker',
    url: 'https://www.instagram.com/lore.maker',
    description: 'Loremaker Universe',
    category: 'professional',
    icon: 'instagram',
    color: 'from-indigo-500 to-purple-500'
  },
  {
    id: 'icuni-instagram',
    platform: 'Instagram (ICUNI)',
    username: '@icuni_',
    url: 'https://www.instagram.com/icuni_',
    description: 'ICUNI Brand',
    category: 'professional',
    icon: 'instagram',
    color: 'from-cyan-500 to-blue-500'
  },
  {
    id: 'mmm-media-instagram',
    platform: 'Instagram (MMM Media)',
    username: '@mm.m.media',
    url: 'https://www.instagram.com/mm.m.media/',
    description: 'MMM Media Productions',
    category: 'professional',
    icon: 'instagram',
    color: 'from-orange-500 to-red-500'
  },
  {
    id: 'ai-educator-instagram',
    platform: 'Instagram (AI Educator)',
    username: '@mr.mikaelgabriel',
    url: 'https://www.instagram.com/mr.mikaelgabriel/',
    description: 'AI Education Content',
    category: 'professional',
    icon: 'instagram',
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'corporate-linkedin',
    platform: 'LinkedIn (Mikael Gabriel)',
    username: 'mikaelgabriel',
    url: 'https://www.linkedin.com/in/mikaelgabriel/',
    description: 'Corporate LinkedIn',
    category: 'professional',
    icon: 'linkedin',
    color: 'from-blue-600 to-blue-800'
  }
];

export const WEBSITES = [
  {
    id: 'loremaker',
    platform: 'Loremaker Universe',
    url: 'https://loremaker.cloud',
    description: 'Full lore and worldbuilding platform',
    category: 'website',
    icon: 'globe',
    color: 'from-violet-500 to-purple-600'
  },
  {
    id: 'starterclass',
    platform: 'Starterclass',
    url: 'https://starterclass.icuni.org',
    description: 'Educational platform',
    category: 'website',
    icon: 'globe',
    color: 'from-teal-500 to-cyan-600'
  },
  {
    id: 'blog',
    platform: 'Blog',
    url: 'https://wordpress.com/mikaelgabriel',
    description: 'Personal blog and writings',
    category: 'website',
    icon: 'globe',
    color: 'from-slate-500 to-gray-600'
  }
];

export const NOVEL = {
  id: 'novel',
  title: 'The Last Ochiyamie',
  platform: 'Amazon',
  url: 'https://a.co/d/iG5DOBk',
  description: 'Published novel available on Amazon',
  category: 'creative',
  icon: 'book',
  color: 'from-amber-500 to-orange-600'
};

export const ALL_LINKS = [
  ...PERSONAL_LINKS,
  ...PROFESSIONAL_LINKS,
  ...WEBSITES,
  NOVEL
];
