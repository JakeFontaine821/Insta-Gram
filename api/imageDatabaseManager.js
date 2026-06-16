const path = require('path');
const Database = require('better-sqlite3');
const db = new Database(path.join(__dirname, './database.db'));

db.prepare(`
    CREATE TABLE IF NOT EXISTS imageMetadata (
        id         INTEGER PRIMARY KEY AUTOINCREMENT,
        file_path  TEXT    NOT NULL,
        sent_by    TEXT    NOT NULL,
        date_added INTEGER NOT NULL,
        album_ids  TEXT    NOT NULL
    )
`).run();

function getAllImages(params){
    const whereCondition = (() => {
        let cond = '';
        if(Object.keys(params).length){
            cond = 'WHERE ';
            if(params.albumId && !params.sentBy){ cond += `album_ids LIKE '%${params.albumId}%' `; }
            else if(!params.albumId && params.sentBy){ cond += `sent_by='${params.sentBy}' `; }
            else{ cond += `album_ids LIKE '%${params.albumId}%' AND sent_by='${params.sentBy}' `; }

            return cond;
        }
        else{ return ''; }
    })();

    const getAllStatement = db.prepare(`SELECT * FROM imageMetadata ${whereCondition}ORDER BY id DESC`);
    try{ return { success: true, entries: getAllStatement.all() }; }
    catch(err){ return { success: false, error: `Failed to get entries from database: ${err}` }; }
};

const getAllSendersStatment = db.prepare(`SELECT DISTINCT sent_by FROM imageMetadata;`)
function getAllSenders(){
    try{ return { success: true, entries: getAllSendersStatment.all() }; }
    catch(err){ return { success: false, error: `Failed to get entries from database: ${err}` }; }
};

function getRandomImages(limit=3){
    const getRandomStatement = db.prepare(`SELECT * FROM imageMetadata ORDER BY RANDOM() LIMIT ${limit};`);

    try{ return { success: true, entries: getRandomStatement.all() }; }
    catch(err){ return { success: false, error: `Failed to get entries from database: ${err}` }; }
};

function getRandomImages_album(albumId='', limit=3){
    const getRandomStatement = db.prepare(`SELECT * FROM imageMetadata WHERE album_ids LIKE '%${albumId}%' ORDER BY RANDOM() LIMIT ${limit};`);
    
    try{ return { success: true, entries: getRandomStatement.all() }; }
    catch(err){ return { success: false, error: `Failed to get entries from database: ${err}` }; }
};

const addImageStatement = db.prepare('INSERT INTO imageMetadata (file_path, sent_by, date_added, album_ids) VALUES (@filePath, @sentBy, @dateAdded, @albumIds)');
function addImage(metaData){
    try{ addImageStatement.run(metaData); }
    catch(err){ return { success: false, error: `Failed to insert metadata: ${err}` }; }

    return { success: true };
};

function totalImageCount(){
    const getAllImagesCount = db.prepare(`SELECT COUNT(*) FROM imageMetadata`);
    const count = getAllImagesCount.get();
    return { success: true, count: count['COUNT(*)'] };
};

function totalImageCount_album(albumId){
    const getAllImagesCount = db.prepare(`SELECT COUNT(*) FROM imageMetadata WHERE album_ids LIKE '%${albumId}%'`);
    const count = getAllImagesCount.get();
    return { success: true, count: count['COUNT(*)'] };
};

module.exports = {
    getAllImages,
    getAllSenders,
    getRandomImages,
    getRandomImages_album,
    addImage,
    totalImageCount,
    totalImageCount_album
};