const fs = require('fs');
const path = require('path');
const axios = require('axios');

const serverURL = 'http://localhost:1901'; // URL server
const clientFolder = path.join(__dirname, 'client-folder'); // Folder lokal

// Fungsi untuk membuat folder jika tidak ada
function ensureFolderExists(folderPath) {
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }
}

// Fungsi rekursif untuk sinkronisasi
async function syncFolder(serverItems, localFolderPath) {
    ensureFolderExists(localFolderPath);

    const localItems = fs.existsSync(localFolderPath)
        ? fs.readdirSync(localFolderPath)
        : [];

    const localItemMap = new Map(
        localItems.map((item) => {
            const itemPath = path.join(localFolderPath, item);
            const stats = fs.statSync(itemPath);
            return [
                item,
                {
                    name: item,
                    isDirectory: stats.isDirectory(),
                    lastModified: stats.mtime,
                },
            ];
        })
    );

    // Sinkronisasi item dari server
    for (const serverItem of serverItems) {
        const localItem = localItemMap.get(serverItem.name);
        const localItemPath = path.join(localFolderPath, serverItem.name);

        if (serverItem.isDirectory) {
            // Rekursi ke dalam folder
            await syncFolder(serverItem.children || [], localItemPath);
        } else {
            // Periksa apakah file perlu di-update
            if (
                !localItem ||
                serverItem.lastModified > localItem.lastModified ||
                serverItem.size !== fs.statSync(localItemPath)?.size
            ) {
                console.log(`Mengunduh file: ${serverItem.name}`);
                await downloadFile(serverItem, localItemPath);
            }
        }
    }

    // Hapus item lokal yang tidak ada di server
    for (const [localItemName] of localItemMap) {
        if (!serverItems.find((item) => item.name === localItemName)) {
            const localItemPath = path.join(localFolderPath, localItemName);
            fs.rmSync(localItemPath, { recursive: true, force: true });
            console.log(`Menghapus item lokal: ${localItemName}`);
        }
    }
}

// Fungsi untuk mengunduh file
async function downloadFile(serverItem, localPath) {
    const response = await axios({
        method: 'get',
        url: `${serverURL}/download`,
        responseType: 'stream',
        params: { filePath: serverItem.name },
    });

    const writer = fs.createWriteStream(localPath);
    response.data.pipe(writer);
    return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
    });
}

// Fungsi utama untuk memulai sinkronisasi
async function run() {
    try {
        console.log('Memulai sinkronisasi...');
        const response = await axios.get(`${serverURL}/read-folder`);
        const serverItems = response.data.items;

        await syncFolder(serverItems, clientFolder);

        console.log('Sinkronisasi selesai.');
    } catch (error) {
        console.error('Error saat sinkronisasi:', error);
    }
}

run();
