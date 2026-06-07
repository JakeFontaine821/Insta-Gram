import AddStyle from '../js/Styles.js';

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

    .qr-popup .page-container{
        background-color: var(--background);
        padding: 20px;
        border-radius: 20px;
    }

    .qr-popup .page-container{
        background-color: var(--background);
        padding: 20px;
        border-radius: 20px;
    }
`);

export default class QrPopup extends HTMLElement{
    constructor(){
        super();

        this.classList.add('qr-popup', 'hidden');

        this.innerHTML = `
            <div class="page-container">
                <div class="qr-code" id="qr-code"></div>
                <div class="url"></div>
                <div class="">Scan QR code or enter the address in your browser to upload photos :)</div>
                <div class="You must be on the same network to access"></div>
            </div>
        `;
    };
};
customElements.define('qr-poup', QrPopup);