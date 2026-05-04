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
    constructor(albumObj=null){
        super();

        this.classList.add('album-entry');
        this.albumObj = albumObj ?? {};

        this.innerHTML = /*html*/`
            <div class="album-info">
                <input class="album-name-input" placeholder="Album Name" value="${albumObj?.albumName ?? ''}"/>
                <div class="album-photo-count">${albumObj?.numberOfPhotos ?? 0}</div>
            </div>
            <div class="save-button" disabled>Save Name</div>
        `;

        const albumNameInput = this.querySelector('.album-name-input');
        const saveButton = this.querySelector('.save-button');

        // Disable the save button if its the same as whats saved
        albumNameInput.addEventListener('input', () => {
            if(!this.albumObj){ return; }
            saveButton.toggleAttribute('disabled', albumNameInput.value === this.albumObj.albumName);
        });

        // Save handler for updating the name of album, can only run if its updating
        const saveAlbum = async () => {
            const response = await sendRequest('/sender/albums/rename', { body: { albumId: this.albumObj.albumId, albumName: albumNameInput.value } });
            if(!response.success){ console.error('Failed to save'); }
        };

        if(albumObj){
            saveButton.addEventListener('click', async () => saveAlbum());
        }
        else{
            const createAlbum = async () => {
                const response = await sendRequest('/sender/albums/create', { body: { albumName: albumNameInput.value } });
                if(!response.success){ return console.error('Failed to create'); }

                saveButton.removeEventListener('click', createAlbum);
                saveButton.addEventListener('click', () => saveAlbum());
                saveButton.setAttribute('disabled', '');

                this.albumObj = response.config;
            };

            saveButton.addEventListener('click', createAlbum);
        }
    };

    get albumId(){
        if(!this.albumObj){ return null; }
        return this.albumObj.albumId;
    };
};
customElements.define('album-entry', AlbumEntry);