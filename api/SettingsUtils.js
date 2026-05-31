const wifi = require('node-wifi');
wifi.init({ iface: null });

const disk = require('diskusage');
const os = require('os');
let path = os.platform() === 'win32' ? 'c:' : '/';

async function getWifiNetworks(){
    const wifiResponse = await wifi.scan();
    console.log('scan', wifiResponse);

    return { success: true };
};

async function setWifiNetwork(ssid, password){
    const connectResponse = await wifi.connect({ ssid, password });
    console.log('connectResponse', connectResponse);

    const confirmResponse = await wifi.getCurrentConnections();
    console.log('confirmResponse', confirmResponse);
    
    return { success: true };
};

async function disconnectWifiNetwork(){
    wifi.deleteConnection({ ssid: 'ssid' }, error => {
        if (error) {
          console.log(error);
        } else {
          console.log('Deleted');
        }
    });
};

async function getStorage(){
    const data = await disk.check(path);
    return { success: true, data };
};

module.exports = {
    getWifiNetworks,
    setWifiNetwork,
    disconnectWifiNetwork,
    getStorage
};