import AddStyle from '../js/Styles.js';
import { sendRequest, WifiStrengthToIcon } from '../js/utils.js';

AddStyle(/*css*/`
    .wifi-entry{
        border: 2px solid var(--accent);
        height: 80px;
        transition: height .5s;
        overflow: hidden;
        border-radius: 20px;
        cursor: pointer;
        background: var(--g);
        font-size: 2.5rem;
    }

    .wifi-entry.expand{
        height: 160px;
    }

    .wifi-entry > div{
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        height: 76px;
        padding: 0 10px;
    }

    .wifi-entry .ssid{
        flex: 1;
        text-align: start;
    }

    .wifi-entry .connected{
        font-style: italic;
        font-size: 1.5rem;
        color: gray;
    }

    .wifi-entry .strength{
        height: 35px;
        width: 35px;
        position: relative;
    }

    .wifi-entry .strength svg{
        position: absolute;
        height: 100%;
        width: 100%;
        top: 0;
        left: 0;
    }

    .wifi-entry .protected{
        height: 40px;
        width: 40px;
    }

    .wifi-entry *:is(.forget-network-button, .disconnect-button){
        font-size: 1.25rem;
        border: 2px solid var(--accent);
        padding: 15px;
        border-radius: 10px;
        background-color: var(--secondary);
    }

    .wifi-entry .password-input-container{
        width: 100%;
        font-size: 1.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .wifi-entry .password-input-container > div{
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .wifi-entry .password-input.error{
        border: 2px solid red;
    }

    .wifi-entry .connect-button{
        font-size: 1.25rem;
        border: 2px solid var(--accent);
        padding: 10px;
        border-radius: 10px;
        background-color: var(--secondary);
    }
`);

export default class WifiEntry extends HTMLElement{
    constructor(network){
        super();

        this.classList.add('wifi-entry');
        this.network = network;

        this.innerHTML = `
            <div class="main-row">
                <div class="ssid">${network.ssid}</div>
                <div class="connected">${network.CONNECTED ? 'connected' : ''}</div>
                <div class="strength">${WifiStrengthToIcon(network.quality)}</div>
                <div class="protected">${network.security !== '' ? '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm0-80h480v-400H240v400Zm296.5-143.5Q560-327 560-360t-23.5-56.5Q513-440 480-440t-56.5 23.5Q400-393 400-360t23.5 56.5Q447-280 480-280t56.5-23.5ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80ZM240-160v-400 400Z"/></svg>' : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M240-160h480v-400H240v400Zm296.5-143.5Q560-327 560-360t-23.5-56.5Q513-440 480-440t-56.5 23.5Q400-393 400-360t23.5 56.5Q447-280 480-280t56.5-23.5ZM240-160v-400 400Zm0 80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h280v-80q0-83 58.5-141.5T720-920q83 0 141.5 58.5T920-720h-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80h120q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Z"/></svg>'}</div>
            </div>
            <div class="config-row">
                <div class="forget-network-button">Forget Network</div>
                <div class="disconnect-button">Disconnect Network</div>
                <div class="password-input-container">
                    <div class="connect-container">
                        <input class="password-input" placeholder="password" />
                        <div class="connect-button">Connect</div>
                    </div>
                </div>
            </div>
        `;

        const forgetNetworkButton = this.querySelector('.forget-network-button');
        const disconnectButton = this.querySelector('.disconnect-button');
        const passwordInputContainer = this.querySelector('.password-input-container');

        forgetNetworkButton.classList.toggle('hidden', !this.network.CONNECTED);
        disconnectButton.classList.toggle('hidden', !this.network.CONNECTED);
        passwordInputContainer.classList.toggle('hidden', !!this.network.CONNECTED);

        // Expand if password protected OR if already connected. Otherwise connect
        this.querySelector('.main-row').addEventListener('click', async () => {
            if(this.network.security !== '' || this.network.CONNECTED){ return this.classList.toggle('expand'); }

            this.classList.add('loading');

            const connectResponse = await sendRequest('/frame/wifi/connect', { body: { ssid: this.network.ssid, password: '', saveConnection: false } });
            if(connectResponse.success){ this.dispatchEvent(new Event('reload')); }

            this.classList.remove('loading');
        });

        // Disconnect and Forget network
        forgetNetworkButton.addEventListener('click', async () => {
            this.classList.add('loading');

            const forgetResponse = await sendRequest('/frame/wifi/forget', { body: { ssid: this.network.ssid } });
            if(forgetResponse.success){ this.dispatchEvent(new Event('reload')); }

            this.classList.remove('loading');
        });

        // Disconnect network
        disconnectButton.addEventListener('click', async () => {
            this.classList.add('loading');

            const disconnectResponse = await sendRequest('/frame/wifi/disconnect');
            console.log(disconnectResponse)
            if(disconnectResponse.success){ this.dispatchEvent(new Event('reload')); }

            this.classList.remove('loading');
        });

        // Connect to password protected network
        const passwordInput = this.querySelector('.password-input');
        this.querySelector('.connect-button').addEventListener('click', async () => {
            if(passwordInput.value === ''){ return passwordInput.classList.add('error'); }
            passwordInput.classList.remove('error');

            this.classList.add('loading');

            const connectResponse = await sendRequest('/frame/wifi/connect',
                { body: { 
                    ssid: this.network.ssid,
                    password: passwordInput.value,
                } }
            );
            if(connectResponse.success){ this.dispatchEvent(new Event('reload')); }

            this.classList.remove('loading');
        });
    };
};
customElements.define('wifi-entry', WifiEntry);