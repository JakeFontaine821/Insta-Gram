import AddStyle from '../js/Styles.js';
import { sendRequest } from '../js/utils.js';

AddStyle(/*css*/`
    .selectable-album-entry{
        height: 50px;
        width: 100%;
        display: flex;
        justify-content: space-around;
        align-items: center;
        border: 1px solid var(--accent);
        border-radius: 10px;
        cursor: pointer;
        background: var(--g);
    }

    .selectable-album-entry .album-info{
        width: 50%;
        display: flex;
        align-items: center;
        gap: 5px;
    }

    .selectable-album-entry .album-name{
        width: 80%;
        text-align: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .selectable-album-entry .album-photo-count{
        font-size: .75rem;
        height: 20px;
        width: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid var(--accent);
        border-radius: 50%;
    }

    .selectable-album-entry .select-button{
        height: 30px;
        width: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid var(--primary);
        border-radius: 10px;
        stroke: none;
    }

    .selectable-album-entry.selected .select-button{
        stroke: var(--text);
        background: var(--secondary);
    }
`);

export default class SelectableAlbumEntry extends HTMLElement{
    constructor(albumObj){
        super();

        this.classList.add('selectable-album-entry');
        this.albumObj = albumObj;

        this.innerHTML = /*html*/`
            <div class="album-info">
                <div class="album-photo-count">${albumObj.numberOfPhotos}</div>
                <div class="album-name">${albumObj.albumName}</div>
            </div>
            <div class="select-button"><svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 9 9" width="24" fill="none"><path d="m1 4 2.5 2.5L8 2"/></svg></div>
        `;

        const albumNameInput = this.querySelector('.album-name-input');
        const saveButton = this.querySelector('.save-button');

        this.addEventListener('click', () => this.classList.toggle('selected'));
    };

    get id(){
        if(!this.albumObj){ return null; }
        return this.albumObj.albumId;
    };
};
customElements.define('selectable-album-entry', SelectableAlbumEntry);