import AddStyle from '../js/Styles.js';
import AlbumEntry from './AlbumEntry.js';
import { sendRequest } from '../js/utils.js';

AddStyle(/*css*/`
    .root-page{
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 30px;
        padding-top: 10vh;
    }

    .root-page .header{
        font-size: 3rem;
        font-weight: 500;
    }

    .root-page .section{
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .root-page .row{
        display: flex;
        align-items: center;
        position: relative;
    }

    .root-page .row svg{
        position: absolute;
        right: -20px;
    }

    .root-page .input-wrapper{
        padding: 10px 15px;
        border: 1px solid var(--primary);
        border-radius: 8px;
    }

    .root-page .name-input{
        width: 70vw;
    }

    .root-page .custom-file-upload-label {
        border: 2px solid var(--accent);
        border-radius: 15px;
        display: inline-block;
        padding: 6px 12px;
        cursor: pointer;
    }

    .root-page .list-outer{
        height: 300px;
        width: 90vw;
        overflow-y: auto;
        overflow-x: hidden;
        border: 2px solid var(--primary);
        border-radius: 15px;
    }

    .root-page .list-inner{
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 5px;
    }

    .root-page .album-manager-button{
        cursor: pointer;
    }
`);

export default class RootPage extends HTMLElement{
    constructor(){
        super();

        this.classList.add('root-page');

        this.innerHTML = /*html*/`
            <div class="header">Insta-Gram</div>

            <div class="section">
                <label for="name-input">Enter You Name</label>
                <div class="row">
                    <div class="input-wrapper"><input class="name-input" placeholder="Jake (her favorite grandkid)"/></div>
                    <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>
                </div>
            </div>

            <div class="section album-section">
                <label class="album">Select Album</label>
                <div class="list-outer">
                    <div class="list-inner">
                    </div>
                </div>
                <div class="album-manager-button">Manage Albums</div>
            </div>

            <div class="section image-section">
                <label for="file-upload" class="custom-file-upload-label">Upload Images</label>
                <input type="file" id="file-upload" class="image-upload" accept="image/png, image/jpeg" multiple />
            </div>

            <div class="section upload-button" style="flex-direction: row;">
                Send To Frame
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg>
            </div>
        `;

        //<div class="select-button"><svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 100 108" fill="none"><path d="m10 45 35 40 45-70" style="stroke-width:15"/></svg></div>
        const albumList = this.querySelector('.album-section .list-inner');

        const albumManagerButton = this.querySelector('.album-manager-button');
        albumManagerButton.addEventListener('click', () => this.dispatchEvent(new Event('createalbum')));

        // On load setup page where necessary
        (async () => {
            const albumResponse = await sendRequest('/sender/albums');
            if(!albumResponse.success){ return; }

            console.log(albumResponse);/*TODO*/
        })();
    };
};
customElements.define('root-page', RootPage);