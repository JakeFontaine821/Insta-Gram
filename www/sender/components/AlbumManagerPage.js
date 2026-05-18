import AddStyle from '../js/Styles.js';
import EditableAlbumEntry from './EditableAlbumEntry.js';
import { sendRequest } from '../js/utils.js';

AddStyle(/*css*/`
    .album-manager-page{
        position: relative;
        height: 100vh;
        width: 100vw;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 10vh 0;
        gap: 5px;
    }

    .album-manager-page .header{
        font-size: 2.5rem;
        font-weight: 500;
    }

    .album-manager-page .back-button{
        position: absolute;
        top: 10px;
        left: 10px;
        display: flex;
        align-items: center;
        border: 1px solid var(--accent);
        border-radius: 5px;
        padding: 5px 10px 5px 5px;
    }

    .album-manager-page .back-button div{
        padding-top: 4px;
    }

    .album-manager-page .list-outer{
        width: 90vw;
        flex: 1;
        overflow-y: auto;
        overflow-x: hidden;
        padding: 2px;
        border: 2px solid var(--primary);
        border-radius: 15px;
    }

    .album-manager-page .list-inner{
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 5px;
    }

    .album-manager-page .list-inner > div{
        height: 60px;
        width: 100%;
        display: flex;
        justify-content: space-around;
        align-items: center;
        border-top: 1px solid var(--accent);
        border-bottom: 1px solid var(--accent);
        cursor: pointer;
        background-image: linear-gradient(to bottom, var(--secondary), var(--background) 8%, var(--background) 92%, var(--secondary));
    }
`);

export default class AlbumManagerPage extends HTMLElement{
    constructor(){
        super();

        this.classList.add('album-manager-page', 'hidden');

        this.innerHTML = /*html*/`
            <div class="header">Manage Albums</div>
            <div class="back-button">
                <svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="16px"><path d="M624-96 240-480l384-384 68 68-316 316 316 316-68 68Z"/></svg>
                <div>Back</div>
            </div>
            <div class="list-outer">
                <div class="list-inner">
                    <div class="create-new-album-button">Create New Album<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px"><path d="M444-444H240v-72h204v-204h72v204h204v72H516v204h-72v-204Z"/></svg></div>
                </div>
            </div>
        `;

        const albumList = this.querySelector('.list-inner');
        const createNewAlbumButton = this.querySelector('.create-new-album-button');
        createNewAlbumButton.addEventListener('click', () => albumList.insertBefore(new EditableAlbumEntry(), createNewAlbumButton));

        this.querySelector('.back-button').addEventListener('click', () => this.dispatchEvent(new Event('close')));

        this.loadAlbums();
    };

    async loadAlbums(){
        const albumResponse = await sendRequest('/sender/albums');
        if(!albumResponse.success){ return; }

        const albumList = this.querySelector('.list-inner');
        while(albumList.firstChild){ albumList.firstChild.remove(); }

        // recreate the create button
        const createButton = document.createElement('div');
        createButton.innerHTML = `<div class="create-new-album-button">Create New Album<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px"><path d="M444-444H240v-72h204v-204h72v204h204v72H516v204h-72v-204Z"/></svg></div>`;
        createButton.addEventListener('click', () => albumList.insertBefore(new EditableAlbumEntry(), createButton));
        albumList.appendChild(createButton);

        // add in the albums
        for(const entry of albumResponse.entries){ albumList.insertBefore(new EditableAlbumEntry(entry), createButton); }
    };
};
customElements.define('album-manager-page', AlbumManagerPage);