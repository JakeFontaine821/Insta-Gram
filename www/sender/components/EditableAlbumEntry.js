import AddStyle from '../js/Styles.js';
import { sendRequest } from '../js/utils.js';

AddStyle(/*css*/`
    .editable-album-entry{
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

    .editable-album-entry.error{
        border: 1px solid #af3333;
    }

    .editable-album-entry .album-info{
        width: 50%;
        display: flex;
        align-items: center;
        gap: 5px;
    }

    .editable-album-entry .album-name-input{
        width: 80%;
        background: var(--g);
    }

    .editable-album-entry .album-photo-count{
        font-size: .75rem;
        height: 20px;
        width: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid var(--accent);
        border-radius: 50%;
    }

    .editable-album-entry .save-button{
        padding: 5px;
        border: 1px solid var(--accent);
        border-radius: 10px;
    }
`);

export default class EditableAlbumEntry extends HTMLElement{
    constructor(albumObj=null){
        super();

        this.classList.add('editable-album-entry');
        this.albumObj = albumObj ?? {};
        if(this.albumObj){ this.classList.add(this.albumObj.albumId); }

        this.innerHTML = /*html*/`
            <div class="album-info">
                <div class="album-photo-count">${albumObj?.numberOfPhotos ?? 0}</div>
                <input class="album-name-input" placeholder="Album Name" value="${albumObj?.albumName ?? ''}"/>
            </div>
            <div class="save-button" disabled>Save</div>
        `;

        const albumNameInput = this.querySelector('.album-name-input');
        const saveButton = this.querySelector('.save-button');

        // Disable the save button if its the same as whats saved, or blank
        albumNameInput.addEventListener('input', () => {
            saveButton.toggleAttribute('disabled', albumNameInput.value === '' || albumNameInput.value === this.albumObj?.albumName);
        });

        // Save handler for updating the name of album, can only run if its updating
        const saveAlbum = async () => {
            const response = await sendRequest('/sender/albums/rename', { body: { albumId: this.albumObj.albumId, albumName: albumNameInput.value } });
            this.classList.toggle('error', !response.success);
            if(!response.success){ return console.error('Failed to save'); }

            // Reset entries state
            saveButton.setAttribute('disabled', '');
            this.albumObj = response.config;

            // update root page
            this.dispatchEvent(new Event('update', { bubbles: true }));
        };

        if(albumObj){
            saveButton.addEventListener('click', async () => saveAlbum());
        }
        else{
            const createAlbum = async () => {
                const response = await sendRequest('/sender/albums/create', { body: { albumName: albumNameInput.value } });
                this.classList.toggle('error', !response.success);
                if(!response.success){ return console.error('Failed to create'); }

                // Swap out eventlister createhandler for updatehandler
                saveButton.removeEventListener('click', createAlbum);
                saveButton.addEventListener('click', () => saveAlbum());

                // Reset entries state
                saveButton.setAttribute('disabled', '');
                this.albumObj = response.config;

                // Reset entries state
                this.dispatchEvent(new Event('update', { bubbles: true }));
            };

            saveButton.addEventListener('click', createAlbum);
        }
    };

    updateCount(count){
        this.querySelector('.album-photo-count').innerHTML = count;
    };

    get albumId(){
        if(!this.albumObj){ return null; }
        return this.albumObj.albumId;
    };
};
customElements.define('editable-album-entry', EditableAlbumEntry);