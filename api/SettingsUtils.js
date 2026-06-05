/****************************************Wifi Utils TODO This is copied from the github, need to do some testing*/

// Setup Wifi
const wifi = require('node-wifi');
wifi.init({ iface: null });

// Get all Networks available and mark one as currently connected if necessary
async function getWifiNetworks(){
    const allNetworks = await wifi.scan();
    const filteredNetworks = allNetworks.filter(network => network.ssid !== '');

    const currentConnection = await wifi.getCurrentConnections();

    // If we're currently connected, assign a CONNECTED flag for the UI
    const foundNetwork = filteredNetworks.find(network => network.ssid === currentConnection[0].ssid)
    if(currentConnection.length && foundNetwork){ foundNetwork.CONNECTED = true; }

    return { success: true, networks: filteredNetworks };
};

// Get Current returns array with full object when connected
// Get Current returns [] when NOT connected

// Scan returns array of available networks
// Filter out wifi with ssid=''
// network quality is percentage of strength
// security='' when public network

// Try to connect to network then confirm connection succeeded
// Save Connection to database to automatically connect if necessary
async function setWifiNetwork(ssid=undefined, password=''){
    if(!ssid){ return { success: false, error: 'Missing required field \'ssid\'' }; }

    // Connect to wifi
    await wifi.connect({ ssid, password });

    const currentConnection = await wifi.getCurrentConnections();
    const success = currentConnection.length && ssid === currentConnection[0].ssid;

    return { success };
};

// Disconnect from current network
async function disconnectWifiNetwork(){
    const previousConnection = await wifi.getCurrentConnections();
    if(!previousConnection.length){ return { success: true }; }

    await wifi.disconnect();

    const currentConnection = await wifi.getCurrentConnections();
    const success = !currentConnection.length || currentConnection[0].ssid !== previousConnection[0].ssid;

    return { success };
};

async function forgetNetwork(ssid){
    if(!ssid){ return { success: false, error: 'Missing required field \'ssid\'' }; }

    await disconnectWifiNetwork();
    await wifi.deleteConnection({ ssid });

    return { success: true };
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
    forgetNetwork,
    getStorage
};

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