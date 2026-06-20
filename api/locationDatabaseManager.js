const path = require('path');
const Database = require('better-sqlite3');
const db = new Database(path.join(__dirname, './database.db'));

db.prepare(`
    CREATE TABLE IF NOT EXISTS location (
        town        STRING NOT NULL PRIMARY KEY,
        state       STRING NOT NULL,
        country     STRING NOT NULL,
        lat         STRING NOT NULL,
        lng         STRING NOT NULL
    ) WITHOUT ROWID
`).run();

const getLocationStatement = db.prepare(`SELECT * FROM location`);
function getLocation(){
    console.log(getLocationStatement.get())
    try{ return { success: true, entries: getLocationStatement.get() }; }
    catch(err){ return { success: false, error: `Failed to get entries from database: ${err}` }; }
};

const removeEntriesStatement = db.prepare(`DELETE FROM location`)
const setLocationStatement = db.prepare(`INSERT INTO location (town, state, country, lat, lng) VALUES (@town, @state, @country, @lat, @lng)`);
function setLocation(locationData){
    try{ removeEntriesStatement.run(); }
    catch(err){ return { success: false, error: `Failed to remove entries:${err} ` }; }

    try{ setLocationStatement.run(locationData); }
    catch(err){ return { success: false, error: `Failed to insert into database: ${err}` }; }

    return { success: true };
};

module.exports = {
    getLocation,
    setLocation,
};