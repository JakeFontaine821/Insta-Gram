const path = require('path');
const express = require('express');
const app = express();
app.use(express.json());
app.use('/', express.static(path.join(__dirname, './')));

const { networkInterfaces } = require('os');
const HOST = Array.from(Object.values(networkInterfaces())).flat().find(net => net.family === 'IPv4' && !net.internal).address;
const PORT = 3000;

app.get('/', (req, res) => res.json({ success: true, message: "Sending JSON" }));

app.get('/frame', (req, res) => res.sendFile(path.join(__dirname, '/frame/index.html')));

/****************************************************************************************************/
/*                              SENDER SPECIFIC ENDPOINTS                                           */
/****************************************************************************************************/
app.get('/sender', (req, res) => res.sendFile(path.join(__dirname, '/sender/index.html')));

// Albums
const AlbumDatabaseManager = require(path.join(__dirname, './albumDatabaseManager.js'))
app.get('/sender/albums', (req, res) => res.json(AlbumDatabaseManager.getAllAlbums()));

app.get('/sender/album', (req, res) => {
    if(!req.query.id){ return res.json({ success: false, error: 'Missing required query parameter: \'id\'' }); }
    return res.json(AlbumDatabaseManager.getAlbum(req.query.id));
});

app.post('/sender/albums/create', (req, res) => {
    console.log()
    if(!req.body.albumName){ return res.json({ success: false, error: 'Missing required field: \'albumName\'' }); }
    return res.json(AlbumDatabaseManager.createNewAlbum(req.body.albumName));
});

app.post('/sender/albums/rename', (req, res) => {
    if(!req.body.id){ return res.json({ success: false, error: 'Missing required field: \'id\'' }); }
    if(!req.body.newName){ return res.json({ success: false, error: 'Missing required field: \'newName\'' }); }
    return res.json(AlbumDatabaseManager.createNewAlbum(req.body.id, req.body.newName));
});

// Images

// Database setup
// id | album_name | number_of_photos

// id | file_path | sent_by | date_added | album_names

app.listen(PORT, HOST, () => console.log(`Running on port ${PORT}`));