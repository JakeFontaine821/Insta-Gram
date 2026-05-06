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

const getAllStatement = db.prepare(`SELECT * FROM imageMetadata`);
function getAllImages(){
    try{ return { success: true, entries: getAllStatement.all() }; }
    catch(err){ return { success: false, error: `Failed to get entries from database: ${err}` }; }
};

const addImageStatement = db.prepare('INSERT INTO imageMetadata (file_path, sent_by, date_added, album_ids) VALUES (@filePath, @sentBy, @dateAdded, @albumIds)');
function addImage(metaData){
    try{ addImageStatement.run(metaData); }
    catch(err){ return { success: false, error: `Failed to insert metadata: ${err}` }; }

    return { success: true };
};

module.exports = {
    getAllImages,
    addImage,
};