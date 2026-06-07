import AddStyle from '../js/Styles.js';
import { sendRequest } from '../js/utils.js';

AddStyle(/*css*/`
    .album-entry{
        display: flex;
        flex-direction: column;
        gap: 5px;
        padding: 20px;
        border-radius: 20px;
        background-color: var(--accent);
    }

    .album-entry .photo{
        width: 400px;
        height: 400px;
        border-radius: 15px;
        opacity: 0%;
        background-size: cover;
    }

    .album-entry .info-row{
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .album-entry .info-row .name{
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 350px;
    }

    .album-entry .photo-count{
        height: 30px;
        width: 30px;
        border-radius: 50%;
        border: 1px solid var(--g);
        font-size: 1.25rem;
        display: flex;
        justify-content: center;
        align-items: center;
    }
`);

export default class AlbumEntry extends HTMLElement{
    constructor(albumInfo={}){
        super();

        this.classList.add('album-entry');

        this.innerHTML = `
            <div class="photo"></div>
            <div class="info-row">
                <div class="name">${albumInfo.albumName}</div>
                <div class="photo-count">${albumInfo.numberOfPhotos}</div>
            </div>
        `;
        
        this.albumId = albumInfo.albumId;
        const photoDiv = this.querySelector('.photo');
        const loadPhoto = async () => {
            const imageMetadata = await sendRequest(`/images/random?limit=1${this.albumId ? `&albumId=${this.albumId}` : ''}`);
            if(!imageMetadata.success || !imageMetadata.entries.length){ return setTimeout(loadPhoto, 1000); }

            photoDiv.style.backgroundImage = `url(${imageMetadata.entries[0].file_path})`;
            photoDiv.style.animation = 'none';
            photoDiv.offsetWidth;
            photoDiv.style.animation = 'imageFade 10s';

            setTimeout(loadPhoto, 5000);
        };
        loadPhoto();
    };
};
customElements.define('album-entry', AlbumEntry);