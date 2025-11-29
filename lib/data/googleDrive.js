// Google Drive data helpers (public links, no API)

// Photography Albums - Main folder with Beauty and Professional subfolders
export const PHOTOGRAPHY_DRIVE_FOLDER = '1G_6TgOtftLKwqRWjH-tFLuCgp_Oydor4';

// AI Albums - Main folder
export const AI_ALBUMS_DRIVE_FOLDER = '1G_6TgOtftLKwqRWjH-tFLuCgp_Oydor4';

/**
 * Extract folder ID from Google Drive URL
 */
export function extractFolderId(url) {
  const match = url.match(/folders\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

/**
 * Extract file ID from Google Drive URL
 */
export function extractFileId(url) {
  const patterns = [
    /\/d\/([a-zA-Z0-9_-]+)/,
    /id=([a-zA-Z0-9_-]+)/,
    /file\/d\/([a-zA-Z0-9_-]+)/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  return null;
}

/**
 * Convert Google Drive file URL to direct image URL
 */
export function getDriveImageUrl(fileIdOrUrl) {
  const fileId = fileIdOrUrl?.includes('drive.google.com')
    ? extractFileId(fileIdOrUrl)
    : fileIdOrUrl;

  if (!fileId) return null;

  // Use Google Drive thumbnail endpoint for faster loading
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
}

/**
 * Get full size image URL
 */
export function getDriveFullImageUrl(fileIdOrUrl) {
  const fileId = fileIdOrUrl?.includes('drive.google.com')
    ? extractFileId(fileIdOrUrl)
    : fileIdOrUrl;

  if (!fileId) return null;

  return `https://drive.google.com/uc?export=view&id=${fileId}`;
}

/**
 * Get folder view URL
 */
export function getDriveFolderUrl(folderId) {
  return `https://drive.google.com/drive/folders/${folderId}`;
}

// Curated Photography Albums (lightweight, ready to ship)
export const PHOTOGRAPHY_ALBUMS = [
  {
    id: 'accra-gold-hour',
    name: 'Accra Gold Hour',
    category: 'Beauty',
    date: '2024-04',
    thumbnail: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=70',
    images: [
      {
        id: 'accra-gold-1',
        url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1400&q=70',
        title: 'Studio Portrait'
      },
      {
        id: 'accra-gold-2',
        url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=70',
        title: 'Backlit Silhouette'
      },
      {
        id: 'accra-gold-3',
        url: 'https://images.unsplash.com/photo-1524504549370-2c4f04e0ed5e?auto=format&fit=crop&w=1200&q=70',
        title: 'Gilded Profile'
      }
    ]
  },
  {
    id: 'london-bts',
    name: 'London BTS',
    category: 'Professional',
    date: '2024-03',
    thumbnail: 'https://images.unsplash.com/photo-1515165562835-c3b8c8e4b27e?auto=format&fit=crop&w=900&q=70',
    images: [
      {
        id: 'london-bts-1',
        url: 'https://images.unsplash.com/photo-1515165562835-c3b8c8e4b27e?auto=format&fit=crop&w=1400&q=70',
        title: 'Keynote Energy'
      },
      {
        id: 'london-bts-2',
        url: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=70',
        title: 'Networking Glimpse'
      },
      {
        id: 'london-bts-3',
        url: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1200&q=70',
        title: 'Conference Floor'
      }
    ]
  },
  {
    id: 'motion-tests',
    name: 'Motion Tests',
    category: 'Professional',
    date: '2024-02',
    thumbnail: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=70',
    images: [
      {
        id: 'motion-tests-1',
        url: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1200&q=70',
        title: 'Steadicam Sweep'
      },
      {
        id: 'motion-tests-2',
        url: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1200&q=70',
        title: 'Shadow Line'
      },
      {
        id: 'motion-tests-3',
        url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=70',
        title: 'Cinematic Bloom'
      }
    ]
  }
];

// Curated AI Albums
export const AI_ALBUMS = [
  {
    id: 'ai-neon-legends',
    name: 'Neon Legends',
    date: '2024-05',
    thumbnail: 'https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?auto=format&fit=crop&w=900&q=70',
    images: [
      {
        id: 'neon-1',
        url: 'https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?auto=format&fit=crop&w=1400&q=70',
        title: 'Neon Skyline'
      },
      {
        id: 'neon-2',
        url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=70',
        title: 'Algorithmic Alley'
      },
      {
        id: 'neon-3',
        url: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=70',
        title: 'Circuit Bazaar'
      }
    ]
  },
  {
    id: 'mythic-renders',
    name: 'Mythic Renders',
    date: '2024-04',
    thumbnail: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=70',
    images: [
      {
        id: 'mythic-1',
        url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=70',
        title: 'Cinematic Bloom'
      },
      {
        id: 'mythic-2',
        url: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1200&q=70',
        title: 'Shattered Crown'
      },
      {
        id: 'mythic-3',
        url: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1200&q=70',
        title: 'Stormcaller'
      }
    ]
  }
];
