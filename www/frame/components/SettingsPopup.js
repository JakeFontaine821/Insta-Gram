import AddStyle from '../js/Styles.js';
import { sendRequest } from '../js/utils.js';
import WifiEntry from './WifiEntry.js';

AddStyle(/*css*/`
    .settings-popup{
        height: 100vh;
        width: 100vw;
        background-color: #00000066;
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
    }

    .settings-popup .popup-container{
        height: 80vh;
        width: 70vw;
        background-color: var(--background);
        border-radius: 30px;
        display: flex;
        gap: 10px;
    }

    .settings-popup .popup-container > div{
        height: 100%;
    }

    .settings-popup .popup-container > .tabs{
        flex: 1;
        display: flex;
        flex-direction: column;
    }

    .settings-popup .popup-container .back-tab{
        padding: 10px;
        border-right: 2px solid var(--accent);
    }

    .settings-popup .popup-container .back-button{
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: var(--g);
        border: 2px solid var(--primary);
        border-radius: 35px;
        padding: 10px 20px 10px 15px;
        height: 70px;
        font-size: 2rem;
        cursor: pointer;
    }

    .settings-popup .popup-container .back-button div{
        padding-top: 4px;
    }

    .settings-popup .popup-container > .tabs > .tab{
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        border-top: 2px solid var(--accent);
        border-right: 2px solid var(--accent);
        cursor: pointer;
    }

    .settings-popup .popup-container > .tabs > .tab.selected{
        border-right: 2px solid transparent
    }

    .settings-popup .popup-container > .tabs > .last{
        border-bottom: 2px solid var(--accent);
    }

    .settings-popup .popup-container > .tabs > .empty{
        border-top: 2px solid transparent;
        border-right: 2px solid var(--accent);
        flex: 1;
    }

    .settings-popup .popup-container > .panels{
        flex: 3;
    }

    .settings-popup .popup-container > .panels > div{
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 15px;
        padding: 20px;
        text-align: center;
        font-size: 1.75rem;
    }

    .settings-popup .popup-container .wifi-panel .list-outer{
        width: 100%;
        flex: 1;
        overflow-y: auto;
    }

    .settings-popup .popup-container .wifi-panel .list-inner{
        display: flex;
        flex-direction: column;
        gap: 5px;
    }

    .settings-popup .popup-container .storage-panel > .bar{
        width: 100%;
        height: 30px;
        position: relative;
        border: 1px solid black;
    }

    .settings-popup .popup-container .storage-panel .fill{
        position: absolute;
        top: 0;
        height: 100%;
        background-color: var(--accent);
    }

    .settings-popup .popup-container .storage-panel .background{
        width: 100%;
        height: 100%;
        background-color: #efefef;
    }

    .settings-popup .popup-container .power-panel .power-button{
        background: red;
        border: 2px solid black;
        border-radius: 15px;
        padding: 20px;
        cursor: pointer;
    }
`);

export default class SettingsPopup extends HTMLElement{
    constructor(){
        super();
        
        this.classList.add('settings-popup', 'hidden');

        this.innerHTML = `
            <div class="popup-container">
                <div class="tabs">
                    <div class="back-tab">
                        <div class="back-button">
                            <svg xmlns="http://www.w3.org/2000/svg" width="2rem" height="1.75rem" viewBox="0 -860 960 960"><path d="M624-96 240-480l384-384 68 68-316 316 316 316-68 68Z"/></svg>
                            <div>Back</div>
                        </div>
                    </div>
                    <div class="about-tab tab selected" panel="about-panel">About</div>
                    <div class="wifi-tab tab" panel="wifi-panel">Wifi</div>
                    <div class="storage-tab tab" panel="storage-panel">Storage</div>
                    <div class="credits-tab tab" panel="credits-panel">Credits</div>
                    <div class="power-tab tab last" panel="power-panel">Power Off</div>
                    <div class="empty"></div>
                </div>
                <div class="panels">

                    <div class="about-panel">
                        <div>Insta-Gram is a digital picture frame made inspite of all the frames my grandmother has tried in the past</div>
                        <div>We've had very poor luck with all frames encountering serious issues</div>
                        <div>Finally I thought, I can build a better one, so I did. Hope you enjoy :)</div>
                    </div>

                    <div class="wifi-panel hidden">
                        Available Wifi Networks
                        <div class="list-outer">
                            <div class="list-inner"></div>
                        </div>
                    </div>

                    <div class="storage-panel hidden">
                        <div class="bar">
                            <div class="background"></div>
                            <div class="fill"></div>
                        </div>
                        <div class="storage-info"></div>
                        <div class="image-info"></div>
                    </div>

                    <div class="credits-panel hidden">
                        <div>All Hardware and assembly was done by</div>
                        <div>Jake :)</div>
                        <div></div>
                        <div>All Software for the application was written by</div>
                        <div>Jake :)</div>
                        <div></div>
                        <div>Building the frame was contributed by TODO</div>
                        <div></div>
                        <div>The name "Insta-Gram" was coined by</div>
                        <div>Jason :)</div>
                    </div>

                    <div class="power-panel hidden">
                        <div>Button to gracefully shutdown the system :)</div>
                        <div class="power-button">Power Off</div>
                    </div>

                </div>
            </div>
        `;

        const backButton = this.querySelector('.back-button');
        backButton.addEventListener('click', () => this.classList.add('hidden'));

        for(const tabClass of ['.about-tab', '.wifi-tab', '.storage-tab', '.credits-tab', '.power-tab']){
            const tab = this.querySelector(tabClass);

            tab.addEventListener('click', () => {
                const selectedTab = this.querySelector('.tabs .selected');
                this.querySelector(`.panels .${selectedTab.getAttribute('panel')}`).classList.add('hidden');
                selectedTab.classList.remove('selected');

                tab.classList.add('selected');
                this.querySelector(`.panels .${tab.getAttribute('panel')}`).classList.remove('hidden');
            });
        }

        this.querySelector('.power-button').addEventListener('click', () => sendRequest('/frame/poweroff'));
    };

    async loadStoragePanel(){
        const storageResponse = await sendRequest('/frame/storage');
        const free = storageResponse.data.free / 1000000000; // converting bytes to gigabytes
        const total = storageResponse.data.total / 1000000000; // converting bytes to gigabytes

        const imageCountResponse = await sendRequest('/frame/storage/count');
        const photoCount = imageCountResponse.count;

        const percentStorageUsed = ((total - free) / total) * 100;
        const fillBar = this.querySelector('.storage-panel .bar .fill');
        fillBar.style.width = `${percentStorageUsed}%`;
        fillBar.style.backgroundColor = percentStorageUsed < 75 ? 'green' : percentStorageUsed < 85 ? 'yellow' : percentStorageUsed < 95 ? 'orange' : 'red';

        this.querySelector('.storage-panel .storage-info').innerHTML = `You've used ${Math.round(total - free)}gb of storage and there is ${Math.round(free)}gb remaining`;
        this.querySelector('.storage-panel .image-info').innerHTML = photoCount ? `There are currently ${photoCount} photos uploaded, you can upload about ${Math.round((total / free) * photoCount)} more photos` : '';
    };
    
    async loadWifiPanel(){
        const wifiResponse = await sendRequest('/frame/wifi');
        const a = [{
            ssid: 'network 1',
            CONNECTED: true,
            quality: 80,
            security: 'WP0'
        },{
            ssid: 'network 2',
            CONNECTED: false,
            quality: 50,
            security: 'WP0'
        },{
            ssid: 'network 3',
            CONNECTED: false,
            quality: 30,
            security: ''
        },{
            ssid: 'network 4',
            CONNECTED: false,
            quality: 70,
            security: 'WP0'
        }];

        const wifiList = this.querySelector('.wifi-panel .list-inner');
        while(wifiList.firstChild){ wifiList.firstChild.remove(); }

        for(const network of a/*wifiResponse.networks*/){
            const newWifiEntry = new WifiEntry(network);

            newWifiEntry.addEventListener('reload', () => this.loadWifiPanel());

            wifiList.appendChild(newWifiEntry);
        }
    };

    show(){
        this.classList.remove('hidden');
        this.loadStoragePanel();
        this.loadWifiPanel();
    };
};
customElements.define('settings-popup', SettingsPopup);