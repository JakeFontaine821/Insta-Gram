const path = require('path');
const fs = require('fs');
const multer = require('multer');
const sharp = require('sharp');
const express = require('express');

const app = express();
app.use(express.json());
app.use('/', express.static(path.join(__dirname, './www')));
app.use('/images', express.static(path.join(__dirname, './images')));

const { networkInterfaces } = require('os');
const HOST = Array.from(Object.values(networkInterfaces())).flat().find(net => net.family === 'IPv4' && !net.internal)?.address ?? 'localhost';
const PORT = 3000;

/****************************************************************************************************/
/*                              SETTING UP IMAGE STORAGE                                            */
/****************************************************************************************************/
// const uploadDir = './images';
// if (!fs.existsSync(uploadDir)){ fs.mkdirSync(uploadDir); }

// Initialize multer with the storage engine (accepts files up to 5MB)
// const upload = multer({
//     storage: multer.diskStorage({
//         destination: (req, file, cb) => {
//             cb(null, uploadDir);
//         },
//         filename: (req, file, cb) => {
//             const name = file.originalname.split('.')[0];
//             cb(null, `${Date.now()}__${Math.random().toString(36).substring(7)}__${file.originalname}`);
//         }
//     }),
// });

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Ensure your uploads directory exists
const uploadDir = path.join(__dirname, './images');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

/****************************************************************************************************/
/*                                   IMPORT HELPER MODULES                                          */
/****************************************************************************************************/
const WeatherUtils = require('./api/weatherUtils.js');
const SettingsUtils = require('./api/SettingsUtils.js');
const LocationDatabaseManager = require('./api/locationDatabaseManager.js');
const AlbumDatabaseManager = require(path.join(__dirname, '/api/albumDatabaseManager.js'));
const ImageDatabaseManager = require(path.join(__dirname, '/api/imageDatabaseManager.js'));

/****************************************************************************************************/
/*                                      FRAME ENDPOINTS                                             */
/****************************************************************************************************/
app.get('/', (req, res) => res.json({ success: true, message: "Sending JSON" }));

app.get('/frame', (req, res) => res.sendFile(path.join(__dirname, '/www/frame/index.html')));
app.get('/frame/host', (req, res) => res.json({ host: HOST, port: PORT }));

app.get('/frame/albums', (req, res) => res.json(AlbumDatabaseManager.getAllAlbums()));
app.get('/images/random', (req, res) => {
    if(!req.query.limit){ return { success: false, error: 'Missing required field \'limit\'' }; }

    const imageMetadata = (() => {
        if(req.query.albumId){ return ImageDatabaseManager.getRandomImages_album(req.query.albumId, req.query.limit); }
        return ImageDatabaseManager.getRandomImages(req.query.limit);
    })();

    res.json(imageMetadata);
});

// Weather
app.get('/frame/location', async (req, res) => res.json(await LocationDatabaseManager.getLocation()));
app.get('/frame/weather', async (req, res) => res.json(await WeatherUtils.getWeatherData()));
app.post('/frame/weather/set', async (req, res) => res.json(await LocationDatabaseManager.setLocation(req.body.locationInfo)));
app.post('/frame/weather/suggest', async (req, res) => res.json(await WeatherUtils.getWeatherSuggestions(req.body.query)));

// Wifi Settings
SettingsUtils.getWifiNetworks();
// const wifi = require('node-wifi');
// wifi.init({ iface: null });
// (async () => {
//     const response = await wifi.scan();
//     console.log('response', response)
// })();
app.get('/frame/images/all', async (req, res) => res.json(await ImageDatabaseManager.getAllImages(req.query)));
app.get('/frame/senders/all', async (req, res) => res.json(await ImageDatabaseManager.getAllSenders()));
app.post('/frame/images/update', async (req, res) => res.json(await ImageDatabaseManager.updateImageMetadata(req.body)));

// https://github.com/friedrith/node-wifi
app.get('/frame/wifi', async (req, res) => res.json(await SettingsUtils.getWifiNetworks()));
app.post('/frame/wifi/connect', async (req, res) => res.json(await SettingsUtils.setWifiNetwork(req.body.ssid, req.body.password)));
app.post('/frame/wifi/disconnect', async (req, res) => res.json(await SettingsUtils.disconnectWifiNetwork(req.body.ssid)));
// app.post('/frame/wifi/forget', async (req, res) => res.json(await SettingsUtils.forgetNetwork(req.body.ssid)));

// Storage Display
// https://www.npmjs.com/package/diskusage
app.get('/frame/storage', async (req, res) => res.json(await SettingsUtils.getStorage()));
app.get('/frame/storage/count', async (req, res) => res.json(await ImageDatabaseManager.totalImageCount()));

// Power down listener
app.get('/frame/poweroff', (req, res) => SettingsUtils.shutdownSystem());

/****************************************************************************************************/
/*                              SENDER SPECIFIC ENDPOINTS                                           */
/****************************************************************************************************/
app.get('/sender', (req, res) => res.sendFile(path.join(__dirname, '/www/sender/index.html')));

// Albums
app.get('/sender/albums', (req, res) => res.json(AlbumDatabaseManager.getAllAlbums()));

app.get('/sender/album', (req, res) => {
    if(!req.query.id){ return res.json({ success: false, error: 'Missing required query parameter: \'id\'' }); }
    return res.json(AlbumDatabaseManager.getAlbum(req.query.id));
});

app.post('/sender/albums/create', (req, res) => {
    if(!req.body.albumName){ return res.json({ success: false, error: 'Missing required field: \'albumName\'' }); }

    const response = AlbumDatabaseManager.createNewAlbum(req.body.albumName);
    if(!response.success){ return res.json(response); }

    broadcast('albumreload');
    return res.json({ success: true });
});

app.post('/sender/albums/rename', (req, res) => {
    if(!req.body.albumId){ return res.json({ success: false, error: 'Missing required field: \'albumId\'' }); }
    if(!req.body.albumName){ return res.json({ success: false, error: 'Missing required field: \'albumName\'' }); }

    const response = AlbumDatabaseManager.renameAlbum(req.body.albumId, req.body.albumName);
    if(!response.success){ return res.json(response); }

    broadcast('albumreload');
    return res.json({ success: true });
});

// Images
app.post('/sender/photo/save', upload.single('imageFile'), async (req, res) => {
    if (!req.file) { return res.json({ success: false, error: 'Missing required field: \'file\'' }); }
    if (!req.body.metadata) { return res.json({ success: false, error: 'Missing required field: \'metadata\'' }); }

    const metadata = JSON.parse(req.body.metadata);
    if (!metadata.sentBy) { return res.json({ success: false, error: 'Missing required field: \'sentBy\'' }); }
    if (!metadata.albumIds) { return res.json({ success: false, error: 'Missing required field: \'albumIds\'' }); }
    if (!metadata.dateAdded) { return res.json({ success: false, error: 'Missing required field: \'dateAdded\'' }); }

    try {
        const uniqueFilename = `${Date.now()}__${Math.random().toString(36).substring(9)}__${req.file.originalname}.webp`;
        const outputPath = path.join(uploadDir, uniqueFilename);

        await sharp(req.file.buffer)
            .rotate()
            .resize({
                width: 1200,
                height: 1200,
                fit: 'inside',
                withoutEnlargement: true
            })
            .webp({ quality: 80 })
            .toFile(outputPath);
    
        const savedPathForDB = `/images/${uniqueFilename}`;
        const imageSaveResponse = ImageDatabaseManager.addImage(Object.assign(metadata, { filePath: savedPathForDB }));
        if(imageSaveResponse.success){ broadcast('imagesaved'); }
        
        const parsedAlbumIds = JSON.parse(metadata.albumIds);
        for(const albumId of parsedAlbumIds){
            const incremenetResponse = AlbumDatabaseManager.incrementPhotoCount(albumId);
            if(!incremenetResponse.success){ continue; }
            broadcast('albumcount', { albumId, count: incremenetResponse.count });
        }

        return res.json(imageSaveResponse);
    }
    catch(err){
        console.error('Sharp processing error:', err);
        res.status(500).json({ err: 'Failed to process image' });
    }
});

/****************************************************************************************************/
/*                                    SERVER EVENTS SETUP                                           */
/****************************************************************************************************/
const clients = [];
app.get('/events', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    clients.push(res);

    req.on('close', () => {
        const index = clients.indexOf(res);
        if(index !== -1){ clients.splice(index, 1); }
    });
});

function broadcast(event, data={}, sender=null) {
    for (const client of clients) {
        // client.write(`data: ${JSON.stringify(data)}\n\n`);

        client.write(`event: ${event}\n`);
        client.write(`data: ${JSON.stringify(data)}\n\n`);
    }
};

// Database setup
// album_id | album_name | number_of_photos

// id | file_path | sent_by | date_added | album_ids

app.listen(3000, () => console.log(`Running on port ${HOST}:${PORT}`));
// app.listen(PORT, HOST, () => console.log(`Running on port ${HOST}:${PORT}`));