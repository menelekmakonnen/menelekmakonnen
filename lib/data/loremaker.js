// Loremaker Universe character data

export const LOREMAKER_SPREADSHEET_ID = '1nbAsU-zNe4HbM0bBLlYofi1pHhneEjEIWfW22JODBeM';

/**
 * Get public CSV export URL for the spreadsheet
 */
export function getLoremak erSpreadsheetCsvUrl() {
  return `https://docs.google.com/spreadsheets/d/${LOREMAKER_SPREADSHEET_ID}/export?format=csv`;
}

/**
 * Parse character data from spreadsheet row
 */
export function parseCharacterData(row) {
  return {
    charId: row['Char_ID'] || '',
    character: row['Character'] || '',
    alias: row['Alias'] || '',
    gender: row['Gender'] || '',
    alignment: row['Alignment'] || '',
    location: row['Location'] || '',
    powers: row['Powers'] || '',
    faction: row['Faction/Team'] || '',
    era: row['Era'] || '',
    status: row['Status'] || '',
    shortDescription: row['Short Description'] || '',
    longDescription: row['Long Description'] || '',
    stories: row['Stories'] || '',
    coverImage: row['Cover Image'] || '',
    galleryImages: [
      row['Gallery Image 1'],
      row['Gallery Image 2'],
      row['Gallery Image 3'],
      row['Gallery Image 4'],
      row['Gallery Image 5'],
      row['Gallery Image 6'],
      row['Gallery Image 7'],
      row['Gallery Image 8'],
      row['Gallery Image 9'],
      row['Gallery Image 10'],
      row['Gallery Image 11'],
      row['Gallery Image 12'],
      row['Gallery Image 13'],
      row['Gallery Image 14'],
      row['Gallery Image 15']
    ].filter(img => img && img.trim() !== '')
  };
}

/**
 * Filter characters that have at least one image
 */
export function filterCharactersWithImages(characters) {
  return characters.filter(char => {
    const hasImages = char.coverImage || char.galleryImages.length > 0;
    return hasImages;
  });
}

/**
 * Get random selection of characters
 */
export function getRandomCharacters(characters, count = 20) {
  const shuffled = [...characters].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

/**
 * Mock character data (sample - replace with real data)
 * In production, you'd fetch this from the CSV export or a pre-generated JSON
 */
export const MOCK_LOREMAKER_CHARACTERS = [
  {
    character: 'Sample Character 1',
    alias: 'The Wanderer',
    gender: 'Male',
    alignment: 'Neutral Good',
    location: 'The Wastes',
    powers: 'Time Manipulation',
    faction: 'The Seekers',
    era: 'Modern',
    status: 'Active',
    shortDescription: 'A time-walker seeking to restore balance.',
    longDescription: 'Full character backstory goes here...',
    stories: 'Heroes & Gods, Story Arc 3',
    coverImage: 'https://drive.google.com/file/d/SAMPLE_ID/view',
    galleryImages: []
  }
  // Add more mock characters or fetch from spreadsheet
];

/**
 * Fetch characters from spreadsheet (client-side)
 * This would need to be implemented with a proper CSV parser
 */
export async function fetchLoremakeCharacters() {
  // In a real implementation, you'd:
  // 1. Fetch the CSV from the public export URL
  // 2. Parse it with a CSV parser library
  // 3. Filter for characters with images
  // 4. Return the data

  // For now, return mock data
  return MOCK_LOREMAKER_CHARACTERS;
}
