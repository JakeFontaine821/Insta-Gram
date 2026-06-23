import AddStyle from '../js/Styles.js';
import { sendRequest } from '../js/utils.js';

AddStyle(/*css*/`
    .slideshow-page{
        height: 100vh;
        width: 100vw;
        background-color: black;
        display: flex;
        position: relative;
        overflow: hidden;
    }

    .slideshow-page .photo-display{
        height: 100vh;
        width: 100vw;
        display: flex;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
    }

    .slideshow-page .header-row{
        position: absolute;
        width: 100%;
        height: 120px;
        background-color: #000000bb;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0px 20px;
        top: -120px;
        transition: top .2s;
    }

    .slideshow-page.tapped .header-row{
        top: 0px;
    }

    .slideshow-page .back-button{
        display: flex;
        align-items: center;
        background-color: var(--g);
        border: 2px solid var(--primary);
        border-radius: 40px;
        padding: 10px 25px 10px 20px;
        height: 90px;
        font-size: 2rem;
        cursor: pointer;
    }

    .slideshow-page .back-button div{
        padding-top: 4px;
    }

    .slideshow-page .header-row .metadata{
        display: flex;
        align-items: center;
        justify-content: end;
        gap: 20px;
        font-size: 3.5rem;
        font-weight: 600;
        color: var(--g);
        flex: 1;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .slideshow-page .footer-row{
        position: absolute;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        bottom: -140px;
        transition: bottom .2s;
    }

    .slideshow-page.tapped .footer-row{
        bottom: 0px;
        display: flex;
    }

    .slideshow-page .footer-row .pause-play-button{
        height: 140px;
        width: 140px;
        background-color: #000000bb;
        cursor: pointer;
    }

    .slideshow-page .footer-row .pause-play-button > div{
        padding: 10px;
    }

    .slideshow-page .footer-row .pause-play-button .pause-button{
        display: block;
    }

    .slideshow-page .footer-row .pause-play-button.paused .pause-button{
        display: none;
    }

    .slideshow-page .footer-row .pause-play-button .play-button{
        display: none;
    }

    .slideshow-page .footer-row .pause-play-button.paused .play-button{
        display: block;
    }
`);

export default class SlideshowPage extends HTMLElement{
    constructor(){
        super();

        this.classList.add('slideshow-page', 'hidden');

        this.innerHTML = /*html*/`
            <div class="photo-display"></div>
            <div class="header-row">
                <div class="back-button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="2rem" height="1.75rem" viewBox="0 -960 960 960"><path d="M624-96 240-480l384-384 68 68-316 316 316 316-68 68Z"/></svg>
                    <div>Back</div>
                </div>

                <div class="metadata">
                    Sent by
                    <div class="posted-by"></div>
                    on
                    <div class="posted-date"></div>
                </div>
            </div>
            <div class="footer-row">
                <div class="pause-play-button">
                    <div class="play-button"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#e3e3e3"><path d="m380-300 280-180-280-180v360ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg></div>
                    <div class="pause-button"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#e3e3e3"><path d="M360-320h80v-320h-80v320Zm160 0h80v-320h-80v320ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg></div>
                </div>
            </div>
        `;

        this.albumId = null;

        // Go back to the albums page
        this.querySelector('.back-button').addEventListener('click', () => this.dispatchEvent(Object.assign(new Event('switchpages'), { page: 'albums' })));

        // Set up showing and hiding the header and footer rows
        this.tapTimeout = null;
        this.addEventListener('click', () => {
            clearTimeout(this.tapTimeout);

            this.classList.add('tapped');
            this.tapTimeout = setTimeout(() => this.classList.remove('tapped'), 5000);
        });

        // Pause button
        const pausePlayButton = this.querySelector('.pause-play-button');
        this.querySelector('.pause-button').addEventListener('click', () => {
            pausePlayButton.classList.add('paused');
            this.stopSlideshow();
        });

        // Play button
        this.querySelector('.play-button').addEventListener('click', () => {
            pausePlayButton.classList.remove('paused');
            this.startSlideshow();
        });
    };

    async loadPhoto(){
        const imageMetadataResponse = await sendRequest(`/images/random?limit=1${this.albumId ? `&albumId=${this.albumId}` : ''}`);
        if(!imageMetadataResponse.success || !imageMetadataResponse.entries.length){ return this.loadImageTimeout = setTimeout(() => this.loadPhoto(), 10000); }

        const imageMetadata = imageMetadataResponse.entries[0];
        const photoDisplay = this.querySelector('.photo-display');
        photoDisplay.style.backgroundImage = `url(${imageMetadata.file_path})`;
        photoDisplay.style.animation = 'none';
        photoDisplay.offsetWidth;
        photoDisplay.style.animation = 'imageFade 10s forwards';

        this.querySelector('.posted-by').innerHTML = imageMetadata.sent_by;
        this.querySelector('.posted-date').innerHTML = new Date(imageMetadata.date_added).toDateString();

        this.loadImageTimeout = setTimeout(() => this.loadPhoto(), 10000);
    };

    startSlideshow(){
        this.loadImageTimeout = setTimeout(() => this.loadPhoto(), 10000);
        this.querySelector('.photo-display').style.animation = 'imageFade 10s forwards';
    };

    stopSlideshow(){
        this.querySelector('.photo-display').style.animation = 'none';
        clearTimeout(this.loadImageTimeout);
        this.loadImageTimeout = null;
    };

    async toggleVisible(showPage=true, albumId=null){
        if(showPage){
            this.classList.remove('hidden');
            this.albumId = albumId;
            this.loadPhoto();
        }
        else{
            if(this.classList.contains('hidden')){ return; } // Page already hidden, return

            // Hide the header and footer
            clearTimeout(this.tapTimeout);
            this.classList.remove('tapped');

            // Stop loading images
            this.stopSlideshow();

            this.classList.add('hidden');
        }
    };
};
customElements.define('slideshow-page', SlideshowPage);