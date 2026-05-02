import AddStyle from '../js/Styles.js';
import { sendRequest } from '../js/utils.js';

AddStyle(/*css*/`
    .album-entry{
        height: 50px;
        width: 100%;
        display: flex;
        justify-content: space-around;
        align-items: center;
        border: 1px solid var(--accent);
        border-radius: 10px;
        cursor: pointer;
    }

    .album-entry .album-info{
        display: flex;
        align-items: center;
        gap: 5px;
    }

    .album-entry .album-name{
        width: 100px;
    }

    .album-entry .album-photo-count{
        font-size: .75rem;
        height: 20px;
        width: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid var(--accent);
        border-radius: 50%;
    }
`);

export default class AlbumEntry extends HTMLElement{
    constructor(albumObj){
        super();

        this.classList.add('album-entry');
        this.albumObj = albumObj;

        this.innerHTML = /*html*/`
            <input class="album-name-input" placeholder="Album Name" value="${this.albumObj.albumName}"/>
            <div class="select-button"><svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 100 108" fill="none"><path d="m10 45 35 40 45-70" style="stroke-width:15"/></svg></div>
        `;

    };

    get albumName() { this.albumObj.albumName; }
};
customElements.define('album-entry', AlbumEntry);