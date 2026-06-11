const path = require('path');
const Database = require('better-sqlite3');
const db = new Database(path.join(__dirname, './database.db'));
const ImageDatabaseManager = require(path.join(__dirname, '/imageDatabaseManager.js'));

db.prepare(`
    CREATE TABLE IF NOT EXISTS albums (
        album_id         TEXT NOT NULL PRIMARY KEY,
        album_name       TEXT NOT NULL,
        number_of_photos INTEGER NOT NULL
    ) WITHOUT ROWID
`).run();

const getAllStatement = db.prepare(`SELECT * FROM albums`);
function getAllAlbums(){
    try{ return { success: true, entries: getAllStatement.all().map(entry => deserializeObj(entry)) }; }
    catch(err){ return { success: false, error: `Failed to get entries from database: ${err}` }; }
};

const getAlbumStatement = db.prepare(`SELECT * FROM albums WHERE album_id=@album_id`);
function getAlbum(album_id){
    try{ return { success: true, entries: deserializeObj(getAlbumStatement.get({ album_id })) }; }
    catch(err){ return { success: false, error: `Failed to get entry from database: ${err}` }; }
};

const createAlbumStatement = db.prepare(`INSERT INTO albums (album_id, album_name, number_of_photos) VALUES (@album_id, @album_name, @number_of_photos)`);
function createNewAlbum(album_name){

    // Create unique id for each album
    let album_id = Math.random().toString(36).substring(5);
    while(getAlbumStatement.get({ album_id })){ album_id = Math.random().toString(36).substring(5); }

    const newAlbumObj = {
        album_id,
        album_name,
        number_of_photos: 0
    };

    try{ createAlbumStatement.run(newAlbumObj); }
    catch(err){ return { success: false, error: `Failed to insert into database: ${err}` }; }

    return { success: true, config: deserializeObj(newAlbumObj) };
};

const updateAlbumPhotoCount = db.prepare(`UPDATE albums SET number_of_photos=@number_of_photos WHERE album_id=@album_id`);
function incrementPhotoCount(album_id){
    const imageCount = ImageDatabaseManager.totalImageCount_album(album_id);
    if(!imageCount){ return { success: false, error: `No album found with album_id: ${album_id}` }; }

    try{ updateAlbumPhotoCount.run({ album_id, number_of_photos: imageCount.count }); }
    catch(err){ return { success: false, error: `Failed to increment photo count: ${err}` }; }

    return { success: true, count: imageCount.count };
};

const updateAlbumName = db.prepare(`UPDATE albums SET album_name=@album_name WHERE album_id=@album_id`);
function renameAlbum(album_id, album_name){
    try{ updateAlbumName.run({ album_id, album_name }); }
    catch(err){ return { success: false, error: `Failed to increment photo count: ${err}` }; }

    return { success: true };
};

function deserializeObj(databaseObj){
    return {
        albumId: databaseObj.album_id,
        albumName: databaseObj.album_name,
        numberOfPhotos: databaseObj.number_of_photos
    };
};

module.exports = {
    getAllAlbums,
    getAlbum,
    createNewAlbum,
    incrementPhotoCount,
    renameAlbum,
};