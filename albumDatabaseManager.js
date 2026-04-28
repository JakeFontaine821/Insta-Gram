const path = require('path');
const Database = require('better-sqlite3');
const db = new Database(path.join(__dirname, './database.db'));

db.prepare(`
    CREATE TABLE IF NOT EXISTS albums (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        album_name TEXT,
        number_of_photos INTEGER
    )
`).run();

const getAllStatement = db.prepare(`SELECT * FROM albums`);
function getAllAlbums(){
    try{ return { success: true, entries: getAllStatement.all() }; }
    catch(err){ return { success: false, error: `Failed to get entries from database: ${err}` }; }
};

const getAlbumStatement = db.prepare(`SELECT * FROM albums WHERE album_name=@albumName`);
function getAlbum(albumName){
    try{ return { success: true, entries: getAlbumStatement.get({ albumName }) }; }
    catch(err){ return { success: false, error: `Failed to get entry from database: ${err}` }; }
};

const createAlbumStatement = db.prepare(`INSERT INTO albums (album_name, number_of_photos) VALUES (@albumName, @numberOfPhotos)`);
function createNewAlbum(albumName){
    try{ createAlbumStatement.run({ albumName, numberOfPhotos: 0 }); }
    catch(err){ return { success: false, error: `Failed to insert into database: ${err}` }; }

    return { success: true };
};

const updateAlbumPhotoCount = db.prepare(`UPDATE albums SET number_of_photos=@numberOfPhotos WHERE album_name=@albumName`);
function incrementPhotoCount(albumName){
    const albumObject = getAlbumStatement.get({ albumName });
    if(!albumObject){ return { success: false, error: `No album found with name: ${albumName}` }; }

    const incrementedCount = albumObject.number_of_photos + 1;

    try{ updateAlbumPhotoCount.run({ numberOfPhotos: incrementedCount }); }
    catch(err){ return { success: false, error: `Failed to increment photo count: ${err}` }; }
    
    return { success: true };
};

const updateAlbumName = db.prepare(`UPDATE albums SET album_name=@album_name WHERE id=@id`);
function renameAlbum(oldName, newName){
    const existingAlbum = getAlbumStatement.get({ albumName: newName });
    if(existingAlbum){ return { success: false, error: 'Album already exists' }; }

    const albumObject = getAlbumStatement.get({ albumName: oldName });
    if(!albumObject){ return { success: false, error: `No album found with name: ${oldName}` }; }

    albumObject.album_name = newName;

    try{ updateAlbumName.run(albumObject); }
    catch(err){ return { success: false, error: `Failed to increment photo count: ${err}` }; }
    
    return { success: true };
};

module.exports = {
    getAllAlbums,
    getAlbum,
    createNewAlbum,
    incrementPhotoCount,
    renameAlbum,
};