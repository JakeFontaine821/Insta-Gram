import AddStyle from '../js/Styles.js';
import { sendRequest } from '../js/utils.js';

AddStyle(/*css*/`
    .slideshow-page{
        height: 100vh;
        width: 100vw;
        display: flex;
        opacity: 0%;
        background-color: black;
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
    }

    .slideshow-page .header-row{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100px;
        background-color: #00000044;
        display: flex;
        align-items: center;
    }

    .slideshow-page .back-button{
        display: flex;
        align-items: center;
        background-color: var(--g);
        border: 2px solid var(--primary);
        border-radius: 35px;
        padding: 10px 20px 10px 15px;
        height: 70px;
        cursor: pointer;
    }

    .slideshow-page .back-button div{
        padding-top: 4px;
    }
`);

export default class SlideshowPage extends HTMLElement{
    constructor(){
        super();

        this.classList.add('slideshow-page', 'hidden');

        this.innerHTML = `
            <div class="header-row">
                <div class="back-button">
                    <svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="16px"><path d="M624-96 240-480l384-384 68 68-316 316 316 316-68 68Z"/></svg>
                    <div>Back</div>
                </div>
            </div>
        `;

        this.albumId = null;

        this.querySelector('.back-button').addEventListener('click', () => this.dispatchEvent(Object.assign(new Event('switchpages'), { page: 'albums' })));
    };

    async loadPhotos(){
        const imageMetadata = await sendRequest(`/images/random?limit=1${this.albumId ? `&albumId=${this.albumId}` : ''}`);
        if(!imageMetadata.success || !imageMetadata.entries.length){ return this.loadImageTimeout = setTimeout(() => this.loadPhotos(), 10000); }

        this.style.backgroundImage = `url(${imageMetadata.entries[0].file_path})`;
        this.style.animation = 'none';
        this.offsetWidth;
        this.style.animation = 'imageFade 10s';

        this.loadImageTimeout = setTimeout(() => this.loadPhotos(), 10000);
    };

    async toggleVisible(showPage=true){
        if(showPage){
            this.classList.remove('hidden');
            this.loadPhotos();
        }
        else{
            this.classList.add('hidden');
            clearTimeout(this.loadImageTimeout);
            this.loadImageTimeout = null;
        }
    };

    setAlbum(albumId){ // TODO, currently never called. Need to call lel
        this.albumId = albumId;
    };
};
customElements.define('slideshow-page', SlideshowPage);