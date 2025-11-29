export const pages = [
  { key: 'home', label: 'Home', icon: 'HomeIcon' },
  { key: 'loremaker', label: 'Loremaker', icon: 'SparklesIcon' },
  { key: 'films', label: 'Films & Music', icon: 'FilmIcon' },
  { key: 'photography', label: 'Photography', icon: 'CameraIcon' },
  { key: 'ai', label: 'AI Albums', icon: 'CpuChipIcon' },
  { key: 'edits', label: 'Video Edits', icon: 'PlayIcon' },
  { key: 'links', label: 'Links', icon: 'LinkIcon' },
];

export const roles = [
  { label: 'World Builder', icon: 'GlobeAsiaAustraliaIcon' },
  { label: 'Creative Director', icon: 'LightBulbIcon' },
  { label: 'AI Super Nerd', icon: 'CpuChipIcon' },
  { label: 'Producer', icon: 'AdjustmentsVerticalIcon' },
  { label: 'Prompt Engineer', icon: 'CommandLineIcon' },
  { label: 'Vibe Coder', icon: 'SparklesIcon' },
  { label: 'Video Editor', icon: 'FilmIcon' },
  { label: 'Videographer', icon: 'VideoCameraIcon' },
  { label: 'Project Manager', icon: 'ClipboardDocumentCheckIcon' },
  { label: 'Screenwriter', icon: 'PencilSquareIcon' },
  { label: 'Photographer', icon: 'CameraIcon' },
  { label: 'Solutions Architect', icon: 'CubeTransparentIcon' },
  { label: 'Libra', icon: 'ScaleIcon' },
  { label: 'INT-J', icon: 'PuzzlePieceIcon' },
  { label: 'Reader', icon: 'BookOpenIcon' },
  { label: 'Mentor', icon: 'UserGroupIcon' },
  { label: 'Dreamer', icon: 'CloudIcon' },
  { label: 'Production Manager', icon: 'Cog6ToothIcon' },
];

const yt = (id) => ({
  type: 'youtube',
  id,
  thumbnail: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
});

const ig = (id) => ({
  type: 'instagram',
  id,
  thumbnail: `https://www.instagram.com/p/${id}/media?size=l`,
});

export const films = [
  {
    title: "I'm Alright",
    role: 'Writer–Director',
    runtime: '8 min',
    description: 'Psychological short about addiction and depression during lockdown.',
    link: 'https://www.youtube.com/watch?v=A8cGpNe2JAE',
    ...yt('A8cGpNe2JAE'),
  },
  {
    title: 'Blinded by Magic',
    role: 'Writer–Director',
    runtime: '12 min',
    description: 'A cursed camera grants visions and power at the cost of sight.',
    link: 'https://www.youtube.com/watch?v=ivsCBuD1JYQ',
    ...yt('ivsCBuD1JYQ'),
  },
  {
    title: 'Heroes & Gods',
    role: 'Writer–Director, Editor',
    runtime: '120 min',
    description: 'Ten-part anthology fused into a feature: gods, vengeance, superheroes, lore foundations.',
    link: 'https://www.youtube.com/watch?v=jtiOv0OvD-0',
    ...yt('jtiOv0OvD-0'),
  },
  {
    title: 'SPAR (Doc)',
    role: 'Director, Cinematographer, Editor',
    runtime: '14 min',
    description: 'Boxing pilot documentary shot in London’s Left Hook Gym.',
    link: 'https://www.youtube.com/watch?v=4q6X6prhVOE',
    ...yt('4q6X6prhVOE'),
  },
  {
    title: 'Abranteers',
    role: 'Writer–Director',
    runtime: '9 min',
    description: 'Anti-magic vet and rookie take on a dangerous magic user.',
    link: 'https://www.youtube.com/shorts/CPPkq5zsXgE',
    ...yt('CPPkq5zsXgE'),
  },
];

export const musicVideos = [
  {
    title: 'Soldier - Wonu',
    role: 'Director, Editor',
    runtime: '3 min',
    description: 'Full-cycle creative direction: concept, video, cover art.',
    link: 'https://www.youtube.com/watch?v=BHPaJieCAXY',
    ...yt('BHPaJieCAXY'),
  },
  {
    title: 'Invertebrate - Beenie G',
    role: 'Director',
    runtime: 'Single',
    description: 'Surreal textures and grounded performance merge in Invertebrate.',
    link: 'https://youtu.be/y4a6naAuf3U',
    ...yt('y4a6naAuf3U'),
  },
  {
    title: 'Cameo Chick - CHXY',
    role: 'Director',
    runtime: 'Single',
    description: 'Stylish, confident, glossy visuals.',
    link: 'https://youtu.be/-hx6g3KLexE',
    ...yt('-hx6g3KLexE'),
  },
  {
    title: 'Imperfect - Wonu',
    role: 'Director',
    runtime: 'Single',
    description: 'Tender look at imperfection and longing.',
    link: 'https://youtu.be/pb9l2ZI6A3E',
    ...yt('pb9l2ZI6A3E'),
  },
];

export const videoEdits = {
  'Epic Edits': [
    ig('DMKpVGwoOC2'),
    ig('C7TX-jlqQFB'),
    ig('C8rQp-kq5PG'),
    ig('C8kNL16KIZc'),
    ig('C8z0DAtKq8B'),
    ig('DFPiXCOo220'),
    ig('CIDASf-n6mv'),
  ].map((item, index) => ({
    title: `Epic Edit ${index + 1}`,
    description: 'High-VFX, hyper-stylised reel.',
    ...item,
  })),
  'Beauty & Travel': [
    ig('C6YtlD2Kbd6'),
    ig('C3sDA4AqP5z'),
    ig('C-VzUiFqfkm'),
    ig('DIx8Dkao7wR'),
    ig('DJZC9tpIIOF'),
    ig('DEPpHmFIGAl'),
    ig('DLfna4ao-z-'),
    ig('C7BdCzwqgKo'),
    ig('C6JjwNGIKni'),
    ig('C5N9JhvK9to'),
    ig('C4yA5RKK0zg'),
    ig('C4YBtJdqoWr'),
    ig('C4LBUi7K9wr'),
    ig('C3igTEsqyam'),
  ].map((item, index) => ({
    title: `Beauty & Travel ${index + 1}`,
    description: 'Soft-power aesthetic reel.',
    ...item,
  })),
  BTS: [
    ig('CthPmc7OKK5'),
    ig('CtjWyXJNxwY'),
    ig('Ctlc7--veax'),
    ig('Ctn4hRENjQW'),
    ig('Cttvmy2AdWU'),
    ig('Cue_nHag-QS'),
    ig('CuhtdZYMwWj'),
    ig('C69G68OPF5N'),
    ig('C7KeP-sIHBk'),
    ig('DFNRIRqoFH_'),
    ig('DFPiY-Do1z0'),
  ].map((item, index) => ({
    title: `BTS ${index + 1}`,
    description: 'Documentary filmmaking receipts.',
    ...item,
  })),
  'AI & Learning': [
    ig('DK1bY8couuK'),
    ig('DK4gIZtNB-U'),
    ig('DIvxSY9tQio'),
    ig('DLAbo5mtbC2'),
    ig('C5oZNM5KF77'),
    ig('C5fciTUqXBR'),
    ig('C5c74nYKdI2'),
    ig('DMzghyEtXu1'),
  ].map((item, index) => ({
    title: `AI & Learning ${index + 1}`,
    description: 'AI educator persona reels.',
    ...item,
  })),
};

export const photographyAlbums = [
  {
    name: 'Beauty',
    description: 'Beauty shoots folder',
    items: [],
    folder: 'https://drive.google.com/drive/folders/1G_6TgOtftLKwqRWjH-tFLuCgp_Oydor4?usp=sharing',
  },
  {
    name: 'Professional',
    description: 'Events and professional shoots',
    items: [],
    folder: 'https://drive.google.com/drive/folders/1G_6TgOtftLKwqRWjH-tFLuCgp_Oydor4?usp=sharing',
  },
];

export const aiAlbums = [
  {
    name: 'AI Visions',
    description: 'AI generated album previews',
    items: [],
    folder: 'https://drive.google.com/drive/folders/1G_6TgOtftLKwqRWjH-tFLuCgp_Oydor4?usp=sharing',
  },
];

export const links = [
  {
    label: 'Personal Instagram',
    url: 'https://instagram.com/menelek.makonnen',
    description: 'Lifestyle, creative snapshots, personal updates.',
  },
  {
    label: 'Personal YouTube',
    url: 'https://youtube.com/@menelekmakonnen',
    description: 'Films, edits, and experiments on YouTube.',
  },
  {
    label: 'LinkedIn',
    url: 'https://linkedin.com/in/menelekmakonnen',
    description: 'Professional presence and collaborations.',
  },
  {
    label: 'Director YouTube',
    url: 'https://www.youtube.com/@director_menelek',
    description: 'Director-focused uploads.',
  },
  {
    label: 'Loremaker Universe',
    url: 'https://loremaker.cloud',
    description: 'Worldbuilding hub for characters and lore.',
  },
  {
    label: 'Starterclass',
    url: 'https://starterclass.icuni.org',
    description: 'Learning portal and class bookings.',
  },
  {
    label: 'Novel: The Last Ochiyamie',
    url: 'https://a.co/d/iG5DOBk',
    description: 'Published novel available on Amazon.',
  },
];

export const loremakerSheet =
  'https://docs.google.com/spreadsheets/d/1nbAsU-zNe4HbM0bBLlYofi1pHhneEjEIWfW22JODBeM/gviz/tq?gid=0';
