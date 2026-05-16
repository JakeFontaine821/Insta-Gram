import AddStyle from '../js/Styles.js';
import SelectableAlbumEntry from './SelectableAlbumEntry.js';
import ImageEntry from './imageEntry.js';
import { sendRequest } from '../js/utils.js';

AddStyle(/*css*/`
    .sender-root-page{
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 30px;
        padding: 10vh 0;
    }

    .sender-root-page .header{
        font-size: 3rem;
        font-weight: 500;
    }

    .sender-root-page .section{
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .sender-root-page .row{
        display: flex;
        align-items: center;
        position: relative;
    }

    .sender-root-page .row svg{
        position: absolute;
        right: -20px;
    }

    .sender-root-page .input-wrapper{
        padding: 10px 15px;
        border: 1px solid var(--primary);
        border-radius: 8px;
    }

    .sender-root-page .name-input{
        width: 70vw;
    }

    .sender-root-page .custom-file-upload-label {
        border: 2px solid var(--accent);
        border-radius: 15px;
        display: inline-block;
        padding: 6px 12px;
        cursor: pointer;
        background: var(--f);
    }

    .sender-root-page .list-outer{
        width: 90vw;
        overflow-y: auto;
        overflow-x: hidden;
        border: 2px solid var(--primary);
        border-radius: 15px;
        padding: 2px;
        margin-bottom: 5px;
    }

    .sender-root-page .album-section .list-outer{
        height: 300px;
    }

    .sender-root-page .image-section .list-outer{
        max-height: 200px;
    }

    .sender-root-page .image-section .list-outer.empty{
        border: 2px solid transparent;
    }

    .sender-root-page .list-inner{
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 5px;
    }

    .sender-root-page .album-manager-button{
        cursor: pointer;
    }

    .sender-root-page .error-text{
        color: red;
    }
`);

export default class SenderRootPage extends HTMLElement{
    constructor(){
        super();

        this.classList.add('sender-root-page');

        this.innerHTML = /*html*/`
            <div class="header">Insta-Gram</div>

            <div class="section">
                <label for="name-input">Enter You Name</label>
                <div class="row">
                    <div class="input-wrapper"><input class="name-input" placeholder="Jake (Gram's favorite grandkid)"/></div>
                    <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>
                </div>
                <div class="name error-text"></div>
            </div>

            <div class="section album-section">
                <label class="album">Select Album</label>
                <div class="list-outer">
                    <div class="list-inner">
                        <div class="no-albums-text">Go create some albums :)</div>
                    </div>
                </div>
                <div class="album-manager-button">Manage Albums</div>
            </div>

            <div class="section image-section">
                <label for="file-upload" class="custom-file-upload-label">Upload Images</label>
                <input type="file" id="file-upload" class="image-upload" accept="image/png, image/jpeg" multiple />

                <div class="list-outer empty">
                    <div class="list-inner"></div>
                </div>
                <div class="images error-text"></div>
            </div>

            <div class="section send-button" style="flex-direction: row;">
                Send To Frame
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg>
            </div>
        `;

        const albumManagerButton = this.querySelector('.album-manager-button');
        albumManagerButton.addEventListener('click', () => this.dispatchEvent(new Event('createalbum')));

        const imageUploadInput = this.querySelector('.image-upload');
        const imageList = this.querySelector('.image-section .list-inner');
        imageUploadInput.addEventListener('change', () => {
            while(imageList.firstChild){ imageList.firstChild.remove(); }
            this.querySelector('.image-section .list-outer').classList.toggle('empty', !imageUploadInput.files.length);

            for(const [i, file] of Array.from(imageUploadInput.files).entries()){
                const newImageEntry = new ImageEntry(i, file);

                newImageEntry.addEventListener('remove', ({ index }) => {
                    const dataTransfer = new DataTransfer();
                    for (let i = 0; i < imageUploadInput.files.length; i++) {
                        if (i !== index) { dataTransfer.items.add(imageUploadInput.files[i]); }
                    }

                    imageUploadInput.files = dataTransfer.files;
                    imageUploadInput.dispatchEvent(new Event('change'));
                });

                imageList.appendChild(newImageEntry);
            }
        });

        const sendButton = this.querySelector('.send-button');
        const nameInput = this.querySelector('.name-input');
        const nameErrorText = this.querySelector('.name.error-text');
        const albumList = this.querySelector('.album-section .list-inner');
        const imagesErrorText = this.querySelector('.images.error-text');
        sendButton.addEventListener('click', async () => {
            if(!nameInput.value.length || !imageUploadInput.files.length){
                nameErrorText.innerHTML = !nameInput.value.length ? 'Need to input a name!' : '';
                imagesErrorText.innerHTML = !imageUploadInput.files.length ? 'Need to select images!' : '';
                return;
            }
            else{ nameErrorText.innerHTML = ''; imagesErrorText.innerHTML = ''; }

            sendButton.classList.add('loading');

            const imageList = Array.from(imageUploadInput.files, (file, i) => ({ file, i, success: false }));
            for(const fileObj of imageList){
                // Send to frame
                const response = await sendRequest('/sender/photo/save', {
                    image: fileObj.file,
                    metadata: {
                        sentBy: nameInput.value,
                        albumIds: JSON.stringify(Array.from(albumList.querySelectorAll('.selected'), albumEntry => albumEntry.id)),
                        dateAdded: Date.now(),
                    }
                });
                if(!response.success){ imagesErrorText.innerHTML = 'Failed to send these images^'; console.error(' You suck ', response.error); continue; }
                fileObj.success = true;

                // if send success remove from list
                const dataTransfer = new DataTransfer();
                for(const obj of imageList.filter(obj => !obj.success)){ dataTransfer.items.add(obj.file); }

                imageUploadInput.files = dataTransfer.files;
                imageUploadInput.dispatchEvent(new Event('change'));
                await new Promise(resolve => setTimeout(() => resolve(), 200));
            }

            sendButton.classList.remove('loading');
        });

        this.loadAlbums();
    };

    async loadAlbums(){
        const albumResponse = await sendRequest('/sender/albums');
        if(!albumResponse.success || !albumResponse.entries.length){ return; }

        const albumList = this.querySelector('.album-section .list-inner');
        while(albumList.firstChild){ albumList.firstChild.remove(); }
        for(const entry of albumResponse.entries){ albumList.appendChild(new SelectableAlbumEntry(entry)); }
    };
};
customElements.define('sender-root-page', SenderRootPage);