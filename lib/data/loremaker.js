// Loremaker Universe character data

export const LOREMAKER_SPREADSHEET_ID = '1nbAsU-zNe4HbM0bBLlYofi1pHhneEjEIWfW22JODBeM';

/**
 * Get Google Visualization API URL (no API key needed)
 */
export function getLoremakerGvizUrl() {
  return `https://docs.google.com/spreadsheets/d/${LOREMAKER_SPREADSHEET_ID}/gviz/tq?tqx=out:json`;
}

/**
 * Parse character data from Gviz API row
 */
export function parseCharacterData(row) {
  const getValue = (cell) => cell && cell.v != null ? cell.v : '';

  return {
    charId: getValue(row.c[0]),
    character: getValue(row.c[1]),
    alias: getValue(row.c[2]),
    gender: getValue(row.c[3]),
    alignment: getValue(row.c[4]),
    location: getValue(row.c[5]),
    powers: getValue(row.c[6]),
    faction: getValue(row.c[7]),
    era: getValue(row.c[8]),
    status: getValue(row.c[9]),
    shortDescription: getValue(row.c[10]),
    longDescription: getValue(row.c[11]),
    stories: getValue(row.c[12]),
    coverImage: getValue(row.c[13]),
    galleryImages: [
      getValue(row.c[14]),
      getValue(row.c[15]),
      getValue(row.c[16]),
      getValue(row.c[17]),
      getValue(row.c[18]),
      getValue(row.c[19]),
      getValue(row.c[20]),
      getValue(row.c[21]),
      getValue(row.c[22]),
      getValue(row.c[23]),
      getValue(row.c[24]),
      getValue(row.c[25]),
      getValue(row.c[26]),
      getValue(row.c[27]),
      getValue(row.c[28])
    ].filter(img => img && img.toString().trim() !== '')
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
 * Fetch characters from local API (bypassing CORS)
 */
export async function fetchLoremakerCharacters() {
  try {
    // In browser, use the internal API route which handles the Gviz call server-side
    const response = await fetch('/api/loremaker-data');
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    const characters = await response.json();
    return characters;
  } catch (error) {
    console.error('Error fetching Loremaker data:', error);
    return MOCK_LOREMAKER_CHARACTERS;
  }
}
