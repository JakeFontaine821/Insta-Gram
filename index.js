const path = require('path');
const fs = require('fs');
const multer = require('multer');
const express = require('express');

const app = express();
app.use(express.json());
app.use('/', express.static(path.join(__dirname, './www')));

/****************************************************************************************************/
/*                              SETTING UP IMAGE STORAGE                                            */
/****************************************************************************************************/
const uploadDir = './images';
if (!fs.existsSync(uploadDir)){ fs.mkdirSync(uploadDir); }

// Initialize multer with the storage engine (accepts files up to 5MB)
const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, uploadDir);
        },
        filename: (req, file, cb) => {
            const name = file.originalname.split('.')[0];
            cb(null, `${Date.now()}__${Math.random().toString(36).substring(7)}__${file.originalname}`);
        }
    }),
});

/****************************************************************************************************/
/*                              FRAME ENDPOINTS                                            */
/****************************************************************************************************/
app.get('/', (req, res) => res.json({ success: true, message: "Sending JSON" }));

app.get('/frame', (req, res) => res.sendFile(path.join(__dirname, '/www/frame/index.html')));

/****************************************************************************************************/
/*                              SENDER SPECIFIC ENDPOINTS                                           */
/****************************************************************************************************/
app.get('/sender', (req, res) => res.sendFile(path.join(__dirname, '/www/sender/index.html')));

// Albums
const AlbumDatabaseManager = require(path.join(__dirname, '/api/albumDatabaseManager.js'));
const ImageDatabaseManager = require(path.join(__dirname, '/api/imageDatabaseManager.js'));
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
app.post('/sender/photo/save', upload.single('imageFile'), (req, res) => {
    if (!req.file) { return res.json({ success: false, error: 'Missing required field: \'file\'' }); }
    if (!req.body.metadata) { return res.json({ success: false, error: 'Missing required field: \'metadata\'' }); }

    const metadata = JSON.parse(req.body.metadata);
    if (!metadata.sentBy) { return res.json({ success: false, error: 'Missing required field: \'sentBy\'' }); }
    if (!metadata.albumIds) { return res.json({ success: false, error: 'Missing required field: \'albumIds\'' }); }
    if (!metadata.dateAdded) { return res.json({ success: false, error: 'Missing required field: \'dateAdded\'' }); }
    
    return res.json(ImageDatabaseManager.addImage(Object.assign(metadata, { filePath: req.file.path })));
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

const { networkInterfaces } = require('os');
const HOST = Array.from(Object.values(networkInterfaces())).flat().find(net => net.family === 'IPv4' && !net.internal).address;
const PORT = 3000;
app.listen(PORT, HOST, () => console.log(`Running on port ${HOST}:${PORT}`));