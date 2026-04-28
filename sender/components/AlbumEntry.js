import AddStyle from '../js/Styles.js';

AddStyle(`
    .album-entry .album-info{
        display: flex;
        align-items: center;
    }

    .album-entry .album-name{
        width: 100px;
        background: var(--secondary);
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
    constructor(albumObj=null){
        super();

        this.classList.add('album-entry');
        this.albumObj = albumObj ?? {};

        this.innerHTML = `
            <div class="album-info">
                <input class="album-name" placeholder="Album Name" value="${this.albumObj.albumName ?? ''}"/>
                <div class="album-photo-count">${this.albumObj.numberOfPhotos ?? '0'}</div>
            </div>
            <div class="save-button ${!albumObj ? '' : 'hidden'}">Save Changes</div>
            <div class="select-button ${albumObj ? '' : 'hidden'}"><svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px"><path d="M389-267 195-460l51-52 143 143 325-324 51 51-376 375Z"/></svg></div>
        `;

        //TODO save button
        // TODO select button
    };
};
customElements.define('album-entry', AlbumEntry);