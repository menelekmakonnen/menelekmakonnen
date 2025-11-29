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
  const fileId = fileIdOrUrl.includes('drive.google.com')
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
  const fileId = fileIdOrUrl.includes('drive.google.com')
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

/**
 * Mock Photography Albums structure
 * In a real app, you'd fetch this from Google Drive API or pre-generate it
 * For now, we'll use a mock structure that matches your folder organization
 */
export const MOCK_PHOTOGRAPHY_ALBUMS = [
  {
    id: 'beauty-1',
    name: 'Beauty Shoot 1',
    category: 'Beauty',
    date: '2024-01',
    thumbnail: null, // Will be first image in the folder
    images: []
  },
  {
    id: 'professional-1',
    name: 'Event Shoot 1',
    category: 'Professional',
    date: '2024-02',
    thumbnail: null,
    images: []
  }
  // Add more albums as needed
];

/**
 * Mock AI Albums structure
 */
export const MOCK_AI_ALBUMS = [
  {
    id: 'ai-album-1',
    name: 'AI Generated Collection 1',
    date: '2024-03',
    thumbnail: null,
    images: []
  }
  // Add more albums as needed
];

/**
 * Since we don't have API access, we'll provide instructions for users
 * to manually configure their albums in a config file
 */
export const PHOTOGRAPHY_CONFIG_TEMPLATE = {
  albums: [
    {
      id: 'unique-id',
      name: 'Album Name (from folder name YYYY-MM-DD Name)',
      category: 'Beauty or Professional',
      folderId: 'google-drive-folder-id',
      images: [
        {
          id: 'file-id-1',
          url: 'https://drive.google.com/file/d/FILE_ID/view',
          title: 'Image title'
        }
      ]
    }
  ]
};
