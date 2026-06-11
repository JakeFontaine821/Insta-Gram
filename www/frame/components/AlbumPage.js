import AddStyle from '../js/Styles.js';
import AlbumEntry from './AlbumEntry.js';
import { sendRequest } from '../js/utils.js';
import './QrPopup.js';

AddStyle(/*css*/`
    .album-page{
        height: 100vh;
        width: 100vw;
        display: flex;
        flex-direction: column;
    }

    .album-page > div{
        width: 100%;
    }

    .album-page .header-row{
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 20px;
    }

    .album-page .header-row{
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
    }

    .album-page .header-row > div{
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: var(--g);
        border: 2px solid var(--primary);
        border-radius: 35px;
        padding: 10px 20px 10px 15px;
        height: 70px;
        font-size: 2rem;
        cursor: pointer;
    }

    .album-page .header-row .back-button div{
        padding-top: 4px;
    }

    .album-page .album-list-outer{
        flex: 1;
        overflow-y: auto;
    }

    .album-page .album-list-outer .album-list-inner{
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 10px;
    }
`);

export default class AlbumPage extends HTMLElement{
    constructor(){
        super();

        this.classList.add('album-page', 'hidden');

        this.innerHTML = `
            <div class="header-row">
                <div class="back-button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="2rem" height="1.75rem" viewBox="0 -860 960 960"><path d="M624-96 240-480l384-384 68 68-316 316 316 316-68 68Z"/></svg>
                    <div>Back</div>
                </div>
                <div class="upload-photos-button">Upload Photos</div>
            </div>
            <div class="album-list-outer">
                <div class="album-list-inner"></div>
            </div>

            <qr-popup></qr-popup>
        `;

        this.querySelector('.back-button').addEventListener('click', () => this.dispatchEvent(Object.assign(new Event('switchpages'), { page: 'landing' })));
        this.querySelector('.upload-photos-button').addEventListener('click', () => this.querySelector('.qr-popup').classList.remove('hidden'));
    };

    async toggleVisible(showPage=true){
        const albumList = this.querySelector('.album-list-inner');

        if(showPage){
            this.classList.remove('hidden');

            const albumsResponse = await sendRequest('/frame/albums');
            if(!albumsResponse.success){ setTimeout(() => this.toggleVisible(), 500); return; }

            const photoCountResponse = await sendRequest('/frame/storage/count');
            if(!photoCountResponse.success){ setTimeout(() => this.toggleVisible(), 500); return; }

            // Create and handle an all photos album
            const allPhotosAlbum = new AlbumEntry({ albumName: 'All Photos', numberOfPhotos: photoCountResponse.count["COUNT(*)"] });
            allPhotosAlbum.addEventListener('click', () => this.dispatchEvent(Object.assign(new Event('switchpages'), { page: 'slideshow' })));
            albumList.appendChild(allPhotosAlbum);
            await new Promise(resolve => setTimeout(resolve, 100));

            // Create actual albums
            for(const album of albumsResponse.entries){
                const newAlbumEntry = new AlbumEntry(album);
                newAlbumEntry.addEventListener('click', () => this.dispatchEvent(Object.assign(new Event('switchpages'), { page: 'slideshow', albumId: newAlbumEntry.albumId })));
                albumList.appendChild(newAlbumEntry);

                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }
        else{
            if(this.classList.contains('hidden')){ return; } // Page already hidden, return
            
            while(albumList.firstChild){ albumList.firstChild.clear(); }
            this.classList.add('hidden');
        }
    };
};
customElements.define('album-page', AlbumPage);