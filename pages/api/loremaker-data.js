import { getLoremakerGvizUrl, parseCharacterData, MOCK_LOREMAKER_CHARACTERS } from '@/lib/data/loremaker';

export default async function handler(req, res) {
    try {
        const url = getLoremakerGvizUrl();
        const response = await fetch(url);
        const text = await response.text();

        console.log('[API] Loremaker Gviz Fetch Status:', response.status);

        // Standard format: google.visualization.Query.setResponse({...});
        // Our JSON is between the first '(' and the last ')'
        const startIdx = text.indexOf('(');
        const endIdx = text.lastIndexOf(')');

        if (startIdx === -1 || endIdx === -1) {
            console.error('[API] Invalid Gviz response format:', text.substring(0, 100));
            throw new Error('Invalid Gviz response format');
        }

        const jsonString = text.substring(startIdx + 1, endIdx);
        const data = JSON.parse(jsonString);

        if (!data.table || !data.table.rows) {
            console.warn('[API] No table data found');
            return res.status(200).json(MOCK_LOREMAKER_CHARACTERS);
        }

        // Skip header row and parse characters
        const characters = data.table.rows
            .slice(1) // Skip header
            .map(row => parseCharacterData(row))
            .filter(char => char.character); // Only keep rows with character name

        console.log(`[API] Successfully parsed ${characters.length} characters`);

        // Return the parsed data
        res.status(200).json(characters.length > 0 ? characters : MOCK_LOREMAKER_CHARACTERS);
    } catch (error) {
        console.error('[API] Error in Loremaker proxy:', error);
        res.status(500).json({ error: 'Failed to fetch character data' });
    }
}
