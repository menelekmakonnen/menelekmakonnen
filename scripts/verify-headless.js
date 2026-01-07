
const http = require('http');

async function fetchUrl(url) {
    return new Promise((resolve, reject) => {
        http.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    if (res.statusCode !== 200) {
                        reject(new Error(`Status Code: ${res.statusCode}`));
                    } else {
                        resolve(JSON.parse(data));
                    }
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', (err) => reject(err));
    });
}

async function verify() {
    const port = 3002; // As identified in previous turn
    const baseUrl = `http://localhost:${port}`;

    console.log(`Starting Headless Verification on ${baseUrl}...`);

    try {
        // 1. Verify Photography Albums
        console.log('\n--- Verifying Photography Albums ---');
        const photoAlbums = await fetchUrl(`${baseUrl}/api/albums?type=photography`);
        console.log(`Fetched ${photoAlbums.length} photography albums.`);

        if (photoAlbums.length === 0) {
            console.error('FAIL: No photography albums returned.');
        } else {
            const hasCovers = photoAlbums.some(a => a.thumbnail);
            const hasItems = photoAlbums.some(a => a.items && a.items.length > 0);

            console.log(`Has Covers: ${hasCovers ? 'YES' : 'NO'}`);
            console.log(`Has Items: ${hasItems ? 'YES' : 'NO'}`);

            if (!hasCovers) console.error('FAIL: Photography albums missing covers.');
            else console.log('PASS: Photography covers detected.');

            // Check URL format
            const sampleUrl = photoAlbums[0].items[0]?.url;
            console.log(`Sample Image URL: ${sampleUrl}`);
            if (sampleUrl && sampleUrl.includes('googleusercontent.com')) {
                console.log('PASS: Using high-res googleusercontent links.');
            } else {
                console.warn('WARN: Might be using Drive export links (potential preview issue).');
            }
        }

        // 2. Verify AI Albums
        console.log('\n--- Verifying AI Albums ---');
        const aiAlbums = await fetchUrl(`${baseUrl}/api/albums?type=ai`);
        console.log(`Fetched ${aiAlbums.length} AI albums.`);

        if (aiAlbums.length === 0) {
            console.error('FAIL: No AI albums returned.');
        } else {
            const hasCovers = aiAlbums.some(a => a.thumbnail);
            console.log(`Has Covers: ${hasCovers ? 'YES' : 'NO'}`);
            if (!hasCovers) console.error('FAIL: AI albums missing covers.');
            else console.log('PASS: AI covers detected.');
        }

        console.log('\nVerification Complete.');

    } catch (error) {
        console.error('Verification Failed:', error.message);
    }
}

verify();
