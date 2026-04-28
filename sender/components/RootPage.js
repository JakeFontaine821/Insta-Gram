import AddStyle from '../js/Styles.js';
import AlbumEntry from './AlbumEntry.js';
import { sendRequest } from '../js/utils.js';

AddStyle(`
    .root-page{
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 30px;
    }

    .header{
        font-size: 3rem;
    }

    .section{
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .row{
        display: flex;
        align-items: center;
        position: relative;
    }

    label{
        font-size: 1.25rem;
        border-bottom: 1px solid var(--accent);
        margin-bottom: 5px;
    }

    .row svg{
        position: absolute;
        right: -20px;
    }

    input{
        height: 20px;
        text-align: center;
        border: 1px solid transparent;
        background-color: var(--background);
    }

    .name-input{
        width: 200px;
    }

    input:focus{
        font-style: italic;
    }

    input[type="file"] {
        display: none;
    }

    .custom-file-upload-label {
        border: 2px solid var(--accent);
        border-radius: 15px;
        display: inline-block;
        padding: 6px 12px;
        cursor: pointer;
    }

    .list-outer{
        height: 200px;
        width: 300px;
        overflow-y: auto;
        overflow-x: hidden;
        border: 2px solid var(--primary);
        border-radius: 15px;
    }

    .list-inner > *{
        height: 60px;
        width: 100%;
        display: flex;
        justify-content: space-around;
        align-items: center;
        background: var(--secondary);
        border-top: 1px solid var(--accent);
        border-bottom: 1px solid var(--accent);
        cursor: pointer;
    }    
`);

export default class RootPage extends HTMLElement{
    constructor(){
        super();

        this.classList.add('root-page');

        this.innerHTML = `
            <div class="header">Insta-Gram</div>

            <div class="section">
                <label for="name-input">Enter You Name</label>
                <div class="row">
                    <input class="name-input" placeholder="Jake (her favorite grandson)"/>
                    <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>
                </div>
            </div>

            <div class="section album-section">
                <label class="album">Select Album</label>
                <div class="list-outer">
                    <div class="list-inner">
                        <div class="create-new-album-button">Create New Album<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px"><path d="M444-444H240v-72h204v-204h72v204h204v72H516v204h-72v-204Z"/></svg></div>
                    </div>
                </div>
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

        const albumList = this.querySelector('.album-section .list-inner');
        const createNewAlbumButton = this.querySelector('.create-new-album-button');
        createNewAlbumButton.addEventListener('click', () => albumList.insertBefore(new AlbumEntry(), createNewAlbumButton));

        // On load setup page where necessary
        (async () => {
            const albumResponse = await sendRequest('/sender/albums');
            if(!albumResponse.success){ return; }

            console.log(albumResponse);/*TODO*/
        })();
    };
};
customElements.define('root-page', RootPage);