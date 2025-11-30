import cheerio from 'cheerio';

export default async function handler(req, res) {
  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ error: 'Missing folder id' });
  }
  const url = `https://drive.google.com/embeddedfolderview?id=${id}#list`;
  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);
    const items = [];
    $('a').each((_, el) => {
      const name = $(el).text().trim();
      const href = $(el).attr('href');
      if (!href) return;
      const folderMatch = href.match(/\/folders\/([A-Za-z0-9_-]+)/);
      if (folderMatch) {
        items.push({ type: 'folder', id: folderMatch[1], name });
        return;
      }
      const fileMatch = href.match(/\/file\/d\/([A-Za-z0-9_-]+)/);
      if (fileMatch) {
        items.push({ type: 'file', id: fileMatch[1], name });
      }
    });
    return res.status(200).json(items);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch folder contents' });
  }
}
