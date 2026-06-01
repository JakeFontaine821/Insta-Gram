/****************************************Wifi Utils TODO This is copied from the github, need to do some testing*/
const path = require('path');
const Database = require('better-sqlite3');
const db = new Database(path.join(__dirname, './database.db'));

// Setup Wifi
const wifi = require('node-wifi');
wifi.init({ iface: null });

// Get all Networks available and mark one as currently connected if necessary
async function getWifiNetworks(){
    const wifiResponse = await wifi.scan();
    console.log(wifiResponse)
    const confirmResponse = await wifi.getCurrentConnections(); //TODO
    console.log(confirmResponse)
    return { success: true, networks: wifiResponse };
};

// Try to connect to network then confirm connection succeeded
// Save Connection to database to automatically connect if necessary
async function setWifiNetwork(ssid, password, saveConnection=false){
    const connectResponse = await wifi.connect({ ssid, password });
    console.log('connectResponse', connectResponse);

    // const confirmResponse = wifi.getCurrentConnections((error, connections) => {
    //     if(error){ console.log(error); }
    //     else {
    //         console.log(connections);
    //         /*
    //         // you may have several connections
    //         [
    //             {
    //                 iface: '...', // network interface used for the connection, not available on macOS
    //                 ssid: '...',
    //                 bssid: '...',
    //                 mac: '...', // equals to bssid (for retrocompatibility)
    //                 channel: <number>,
    //                 frequency: <number>, // in MHz
    //                 signal_level: <number>, // in dB
    //                 quality: <number>, // same as signal level but in %
    //                 security: '...' //
    //                 security_flags: '...' // encryption protocols (format currently depending of the OS)
    //                 mode: '...' // network mode like Infra (format currently depending of the OS)
    //             }
    //         ]
    //         */
    //     }
    // });
    // console.log('confirmResponse', confirmResponse);

    if(saveConnection){ /** TODO Add to database */ }
    
    return { success: true };
};

// Disconnect from current network
async function disconnectWifiNetwork(ssid){
    wifi.deleteConnection({ ssid }, error => {
        if (error) { console.log(error); }
        else { console.log('Deleted'); }
    });
};

// Disconnect from current network
async function forgetNetwork(ssid){
    disconnectWifiNetwork(ssid);

    // TODO Remove from database
};

/****************************************Storage Utils */
const disk = require('diskusage');
const os = require('os');
const OSpath = os.platform() === 'win32' ? 'c:' : '/';

async function getStorage(){
    const data = await disk.check(OSpath);
    return { success: true, data };
};

module.exports = {
    getWifiNetworks,
    setWifiNetwork,
    disconnectWifiNetwork,
    getStorage
};