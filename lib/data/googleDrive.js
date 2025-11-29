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

// Album data is displayed directly via Google Drive embedded folder views.
