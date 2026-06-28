import AddStyle from '../js/Styles.js';
import { sendRequest } from '../js/utils.js';

AddStyle(/*css*/`
    .qr-popup{
        height: 100vh;
        width: 100vw;
        background-color: #00000066;
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
    }

    .qr-popup .popup-container{
        background-color: var(--background);
        padding: 20px;
        border-radius: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 15px;
    }

    .qr-popup .popup-container .top-row{
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        gap: 5px;
    }

    .qr-popup .popup-container .back-button{
        display: flex;
        align-items: center;
        background-color: var(--g);
        border: 2px solid var(--primary);
        border-radius: 35px;
        padding: 10px 20px 10px 15px;
        height: 70px;
    }

    .qr-popup .popup-container .back-button div{
        padding-top: 4px;
    }
`);

export default class QrPopup extends HTMLElement{
    constructor(){
        super();

        this.classList.add('qr-popup', 'hidden');

        this.innerHTML = `
            <div class="popup-container">
                <div class="top-row">
                    <div class="back-button">
                        <svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="16px"><path d="M624-96 240-480l384-384 68 68-316 316 316 316-68 68Z"/></svg>
                        <div>Back</div>
                    </div>
                    <div class="url"></div>
                </div>
                <div class="qr-code" id="qr-code"></div>
                <div>Scan QR code or enter the address in your browser to upload photos :)</div>
                <div>You must be on the same network to access</div>
            </div>
        `;

        this.querySelector('.back-button').addEventListener('click', () => this.classList.add('hidden'));

        (async () => {
            const addressResponse = await sendRequest('/frame/host');

            const url = `http://${addressResponse.host}:${addressResponse.port}/sender`;

            this.querySelector('.url').innerHTML = addressResponse.host !== 'localhost' ? url : 'Please connect to a wifi';
            new QRCode(this.querySelector('.qr-code'), url);
        })();

    };
};
customElements.define('qr-popup', QrPopup);