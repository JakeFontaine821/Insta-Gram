const path = require('path');
const Database = require('better-sqlite3');
const db = new Database(path.join(__dirname, './database.db'));

db.prepare(`
    CREATE TABLE IF NOT EXISTS albums (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        album_id TEXT,
        album_name TEXT,
        number_of_photos INTEGER
    )
`).run();

const getAllStatement = db.prepare(`SELECT * FROM albums`);
function getAllAlbums(){
    try{ return { success: true, entries: getAllStatement.all() }; }
    catch(err){ return { success: false, error: `Failed to get entries from database: ${err}` }; }
};

const getAlbumFromIDStatement = db.prepare(`SELECT * FROM albums WHERE album_id=@album_id`);
function getAlbum(album_id){
    try{ return { success: true, entries: getAlbumFromIDStatement.get({ album_id }) }; }
    catch(err){ return { success: false, error: `Failed to get entry from database: ${err}` }; }
};

const createAlbumStatement = db.prepare(`INSERT INTO albums (album_id, album_name, number_of_photos) VALUES (@album_id, @album_name, @number_of_photos)`);
function createNewAlbum(album_name){

    // Create unique id for each album
    let album_id = Math.random().toString(36).substring(5);
    while(getAlbumFromIDStatement.get({ album_id })){ album_id = Math.random().toString(36).substring(5); }

    const newAlbumObj = {
        album_id,
        album_name,
        number_of_photos: 0
    };

    try{ createAlbumStatement.run(newAlbumObj); }
    catch(err){ return { success: false, error: `Failed to insert into database: ${err}` }; }

    return { success: true, config: newAlbumObj };
};

const updateAlbumPhotoCount = db.prepare(`UPDATE albums SET number_of_photos=@number_of_photos WHERE album_id=@album_id`);
function incrementPhotoCount(album_id){
    const albumObject = getAlbumFromIDStatement.get({ album_id });
    if(!albumObject){ return { success: false, error: `No album found with album_id: ${album_id}` }; }

    const incrementedCount = albumObject.number_of_photos + 1;

    try{ updateAlbumPhotoCount.run({ album_id, number_of_photos: incrementedCount }); }
    catch(err){ return { success: false, error: `Failed to increment photo count: ${err}` }; }

    return { success: true, count: incrementedCount };
};

const updateAlbumName = db.prepare(`UPDATE albums SET album_name=@album_name WHERE album_id=@album_id`);
function renameAlbum(album_id, album_name){
    try{ updateAlbumName.run({ album_id, album_name }); }
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