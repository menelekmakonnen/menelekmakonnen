// Video Edits categorized into 4 albums with live Instagram thumbnails
const instagramThumbnailFromUrl = (instagramUrl, embedCode) => {
  const code = embedCode || instagramUrl?.split('/')?.filter(Boolean)?.pop();
  if (!code) return null;

  const isReel = instagramUrl?.includes('/reel/');
  const path = isReel ? 'reel' : 'p';
  return `https://www.instagram.com/${path}/${code}/media/?size=l`;
};

const attachThumbnails = (items) =>
  items.map((item) => {
    const thumbnail = instagramThumbnailFromUrl(item.instagramUrl, item.embedCode);

    return {
      ...item,
      thumbnail,
      coverImage: thumbnail
    };
  });

const EPIC_EDITS_BASE = [
  {
    id: 'epic-1',
    title: 'Epic Edit 1',
    instagramUrl: 'https://www.instagram.com/p/DMKpVGwoOC2/',
    embedCode: 'DMKpVGwoOC2',
    thumbnail: null
  },
  {
    id: 'epic-2',
    title: 'Epic Edit 2',
    instagramUrl: 'https://www.instagram.com/p/C7TX-jlqQFB/',
    embedCode: 'C7TX-jlqQFB',
    thumbnail: null
  },
  {
    id: 'epic-3',
    title: 'Epic Edit 3',
    instagramUrl: 'https://www.instagram.com/reel/C8rQp-kq5PG/',
    embedCode: 'C8rQp-kq5PG',
    thumbnail: null
  },
  {
    id: 'epic-4',
    title: 'Epic Edit 4',
    instagramUrl: 'https://www.instagram.com/reel/C8kNL16KIZc/',
    embedCode: 'C8kNL16KIZc',
    thumbnail: null
  },
  {
    id: 'epic-5',
    title: 'Epic Edit 5',
    instagramUrl: 'https://www.instagram.com/reel/C8z0DAtKq8B/',
    embedCode: 'C8z0DAtKq8B',
    thumbnail: null
  },
  {
    id: 'epic-6',
    title: 'Epic Edit 6',
    instagramUrl: 'https://www.instagram.com/reel/DFPiXCOo220/',
    embedCode: 'DFPiXCOo220',
    thumbnail: null
  },
  {
    id: 'epic-7',
    title: 'Epic Edit 7',
    instagramUrl: 'https://www.instagram.com/reel/CIDASf-n6mv/',
    embedCode: 'CIDASf-n6mv',
    thumbnail: null
  }
];

const BEAUTY_AND_TRAVEL_BASE = [
  {
    id: 'beauty-1',
    title: 'Beauty & Travel 1',
    instagramUrl: 'https://www.instagram.com/reel/C6YtlD2Kbd6/',
    embedCode: 'C6YtlD2Kbd6',
    thumbnail: null
  },
  {
    id: 'beauty-2',
    title: 'Beauty & Travel 2',
    instagramUrl: 'https://www.instagram.com/reel/C3sDA4AqP5z/',
    embedCode: 'C3sDA4AqP5z',
    thumbnail: null
  },
  {
    id: 'beauty-3',
    title: 'Beauty & Travel 3',
    instagramUrl: 'https://www.instagram.com/reel/C-VzUiFqfkm/',
    embedCode: 'C-VzUiFqfkm',
    thumbnail: null
  },
  {
    id: 'beauty-4',
    title: 'Beauty & Travel 4',
    instagramUrl: 'https://www.instagram.com/reel/DIx8Dkao7wR/',
    embedCode: 'DIx8Dkao7wR',
    thumbnail: null
  },
  {
    id: 'beauty-5',
    title: 'Beauty & Travel 5',
    instagramUrl: 'https://www.instagram.com/reel/DJZC9tpIIOF/',
    embedCode: 'DJZC9tpIIOF',
    thumbnail: null
  },
  {
    id: 'beauty-6',
    title: 'Beauty & Travel 6',
    instagramUrl: 'https://www.instagram.com/reel/DEPpHmFIGAl/',
    embedCode: 'DEPpHmFIGAl',
    thumbnail: null
  },
  {
    id: 'beauty-7',
    title: 'Beauty & Travel 7',
    instagramUrl: 'https://www.instagram.com/reel/DLfna4ao-z-/',
    embedCode: 'DLfna4ao-z-',
    thumbnail: null
  },
  {
    id: 'beauty-8',
    title: 'Beauty & Travel 8',
    instagramUrl: 'https://www.instagram.com/reel/C7BdCzwqgKo/',
    embedCode: 'C7BdCzwqgKo',
    thumbnail: null
  },
  {
    id: 'beauty-9',
    title: 'Beauty & Travel 9',
    instagramUrl: 'https://www.instagram.com/reel/C6JjwNGIKni/',
    embedCode: 'C6JjwNGIKni',
    thumbnail: null
  },
  {
    id: 'beauty-10',
    title: 'Beauty & Travel 10',
    instagramUrl: 'https://www.instagram.com/reel/C5N9JhvK9to/',
    embedCode: 'C5N9JhvK9to',
    thumbnail: null
  },
  {
    id: 'beauty-11',
    title: 'Beauty & Travel 11',
    instagramUrl: 'https://www.instagram.com/reel/C4yA5RKK0zg/',
    embedCode: 'C4yA5RKK0zg',
    thumbnail: null
  },
  {
    id: 'beauty-12',
    title: 'Beauty & Travel 12',
    instagramUrl: 'https://www.instagram.com/reel/C4YBtJdqoWr/',
    embedCode: 'C4YBtJdqoWr',
    thumbnail: null
  },
  {
    id: 'beauty-13',
    title: 'Beauty & Travel 13',
    instagramUrl: 'https://www.instagram.com/reel/C4LBUi7K9wr/',
    embedCode: 'C4LBUi7K9wr',
    thumbnail: null
  },
  {
    id: 'beauty-14',
    title: 'Beauty & Travel 14',
    instagramUrl: 'https://www.instagram.com/reel/C3igTEsqyam/',
    embedCode: 'C3igTEsqyam',
    thumbnail: null
  }
];

const BEHIND_THE_SCENES_BASE = [
  {
    id: 'bts-1',
    title: 'Behind the Scenes 1',
    instagramUrl: 'https://www.instagram.com/reel/CthPmc7OKK5/',
    embedCode: 'CthPmc7OKK5',
    thumbnail: null
  },
  {
    id: 'bts-2',
    title: 'Behind the Scenes 2',
    instagramUrl: 'https://www.instagram.com/reel/CtjWyXJNxwY/',
    embedCode: 'CtjWyXJNxwY',
    thumbnail: null
  },
  {
    id: 'bts-3',
    title: 'Behind the Scenes 3',
    instagramUrl: 'https://www.instagram.com/reel/Ctlc7--veax/',
    embedCode: 'Ctlc7--veax',
    thumbnail: null
  },
  {
    id: 'bts-4',
    title: 'Behind the Scenes 4',
    instagramUrl: 'https://www.instagram.com/reel/Ctn4hRENjQW/',
    embedCode: 'Ctn4hRENjQW',
    thumbnail: null
  },
  {
    id: 'bts-5',
    title: 'Behind the Scenes 5',
    instagramUrl: 'https://www.instagram.com/reel/Cttvmy2AdWU/',
    embedCode: 'Cttvmy2AdWU',
    thumbnail: null
  },
  {
    id: 'bts-6',
    title: 'Behind the Scenes 6',
    instagramUrl: 'https://www.instagram.com/reel/Cue_nHag-QS/',
    embedCode: 'Cue_nHag-QS',
    thumbnail: null
  },
  {
    id: 'bts-7',
    title: 'Behind the Scenes 7',
    instagramUrl: 'https://www.instagram.com/reel/CuhtdZYMwWj/',
    embedCode: 'CuhtdZYMwWj',
    thumbnail: null
  },
  {
    id: 'bts-8',
    title: 'Behind the Scenes 8',
    instagramUrl: 'https://www.instagram.com/reel/C69G68OPF5N/',
    embedCode: 'C69G68OPF5N',
    thumbnail: null
  },
  {
    id: 'bts-9',
    title: 'Behind the Scenes 9',
    instagramUrl: 'https://www.instagram.com/reel/C7KeP-sIHBk/',
    embedCode: 'C7KeP-sIHBk',
    thumbnail: null
  },
  {
    id: 'bts-10',
    title: 'Behind the Scenes 10',
    instagramUrl: 'https://www.instagram.com/reel/DFNRIRqoFH_/',
    embedCode: 'DFNRIRqoFH_',
    thumbnail: null
  },
  {
    id: 'bts-11',
    title: 'Behind the Scenes 11',
    instagramUrl: 'https://www.instagram.com/reel/DFPiY-Do1z0/',
    embedCode: 'DFPiY-Do1z0',
    thumbnail: null
  }
];

const AI_AND_LEARNING_BASE = [
  {
    id: 'ai-1',
    title: 'AI & Learning 1',
    instagramUrl: 'https://www.instagram.com/reel/DK1bY8couuK/',
    embedCode: 'DK1bY8couuK',
    thumbnail: null
  },
  {
    id: 'ai-2',
    title: 'AI & Learning 2',
    instagramUrl: 'https://www.instagram.com/reel/DK4gIZtNB-U/',
    embedCode: 'DK4gIZtNB-U',
    thumbnail: null
  },
  {
    id: 'ai-3',
    title: 'AI & Learning 3',
    instagramUrl: 'https://www.instagram.com/reel/DIvxSY9tQio/',
    embedCode: 'DIvxSY9tQio',
    thumbnail: null
  },
  {
    id: 'ai-4',
    title: 'AI & Learning 4',
    instagramUrl: 'https://www.instagram.com/reel/DLAbo5mtbC2/',
    embedCode: 'DLAbo5mtbC2',
    thumbnail: null
  },
  {
    id: 'ai-5',
    title: 'AI & Learning 5',
    instagramUrl: 'https://www.instagram.com/reel/C5oZNM5KF77/',
    embedCode: 'C5oZNM5KF77',
    thumbnail: null
  },
  {
    id: 'ai-6',
    title: 'AI & Learning 6',
    instagramUrl: 'https://www.instagram.com/reel/C5fciTUqXBR/',
    embedCode: 'C5fciTUqXBR',
    thumbnail: null
  },
  {
    id: 'ai-7',
    title: 'AI & Learning 7',
    instagramUrl: 'https://www.instagram.com/reel/C5c74nYKdI2/',
    embedCode: 'C5c74nYKdI2',
    thumbnail: null
  },
  {
    id: 'ai-8',
    title: 'AI & Learning 8',
    instagramUrl: 'https://www.instagram.com/reel/DMzghyEtXu1/',
    embedCode: 'DMzghyEtXu1',
    thumbnail: null
  }
];

export const EPIC_EDITS = attachThumbnails(EPIC_EDITS_BASE);
export const BEAUTY_AND_TRAVEL = attachThumbnails(BEAUTY_AND_TRAVEL_BASE, 2);
export const BEHIND_THE_SCENES = attachThumbnails(BEHIND_THE_SCENES_BASE, 4);
export const AI_AND_LEARNING = attachThumbnails(AI_AND_LEARNING_BASE, 6);

export const VIDEO_EDIT_ALBUMS = {
  'epic-edits': {
    id: 'epic-edits',
    title: 'Epic Edits',
    description: 'High-energy, high-VFX, hyper-stylised video edits with punchy transitions.',
    items: EPIC_EDITS
  },
  'beauty-and-travel': {
    id: 'beauty-and-travel',
    title: 'Beauty & Travel',
    description: 'Soft-power aesthetic reels with glow, wanderlust energy, and clean lifestyle edits.',
    items: BEAUTY_AND_TRAVEL
  },
  'behind-the-scenes': {
    id: 'behind-the-scenes',
    title: 'Behind the Scenes',
    description: 'Documentary filmmaking receipts — proof of being active in the trenches.',
    items: BEHIND_THE_SCENES
  },
  'ai-and-learning': {
    id: 'ai-and-learning',
    title: 'AI & Learning',
    description: 'AI educator persona with clean demos, polished voiceovers, and value delivery.',
    items: AI_AND_LEARNING
  }
};
