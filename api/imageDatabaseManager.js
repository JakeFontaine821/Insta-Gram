const path = require('path');
const Database = require('better-sqlite3');
const db = new Database(path.join(__dirname, './database.db'));

db.prepare(`
    CREATE TABLE IF NOT EXISTS images (
        id         INTEGER AUTO_INCREMENT PRIMARY KEY,
        file_path  TEXT NOT NULL,
        sent_by    INTEGER NOT NULL,
        date_added INTEGER NOT NULL,
        album_ids  INTEGER NOT NULL
    ) WITHOUT ROWID
`).run();

const getAllStatement = db.prepare(`SELECT * FROM images`);
function getAllImages(){
    try{ return { success: true, entries: getAllStatement.all() }; }
    catch(err){ return { success: false, error: `Failed to get entries from database: ${err}` }; }
};

module.exports = {
    getAllImages,
};