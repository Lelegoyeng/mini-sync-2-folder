const express = require('express');
const os = require('os');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 1901;

function getLocalIPAddress() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return '127.0.0.1';
}

// Fungsi rekursif untuk membaca folder
function readFolderRecursively(folderPath) {
    const items = fs.readdirSync(folderPath);
    return items.map((item) => {
        const itemPath = path.join(folderPath, item);
        const stats = fs.statSync(itemPath);

        if (stats.isDirectory()) {
            return {
                name: item,
                isDirectory: true,
                lastModified: stats.mtime,
                children: readFolderRecursively(itemPath), // Rekursi ke dalam folder
            };
        } else {
            return {
                name: item,
                isDirectory: false,
                lastModified: stats.mtime,
                size: stats.size,
            };
        }
    });
}

app.get('/read-folder', (_, res) => {
    const folderPath = path.join(__dirname, 'server-folder');
    try {
        const folderStructure = readFolderRecursively(folderPath);
        res.send({ items: folderStructure });
    } catch (err) {
        console.error('Error reading folder:', err);
        res.status(500).send({ error: 'Failed to read folder.' });
    }
});

app.get('/download', (req, res) => {
    const filePath = path.join(__dirname, 'server-folder', req.query.filePath);
    if (!fs.existsSync(filePath)) {
        return res.status(404).send({ error: 'File not found' });
    }

    res.download(filePath);
});

app.listen(port, () => {
    const ip = getLocalIPAddress();
    console.log(`Server berjalan di http://${ip}:${port}`);
});
