import AddStyle from '../js/Styles.js';
import { sendRequest } from '../js/utils.js';

AddStyle(/*css*/`
    .image-entry{
        height: 30px;
        width: 100%;
        display: flex;
        justify-content: space-around;
        align-items: center;
        border: 1px solid var(--accent);
        border-radius: 10px;
        cursor: pointer;
        background: var(--g);
    }

    .image-entry .image-info{
        width: 50%;
        display: flex;
        align-items: center;
        gap: 5px;
    }

    .image-entry img{
        height: 20px;
        width: 20px;
        display: block;
    }

    .image-entry .image-name{
        max-width: 80%;
        text-align: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .image-entry .remove-button{
        height: 24px;
        width: 24px;
        fill: black;
    }
`);

export default class ImageEntry extends HTMLElement{
    constructor(index, file){
        super();

        this.classList.add('image-entry');

        this.innerHTML = /*html*/`
            <div class="image-info">
                <img src="#" alt="Loading Image...">
                <div class="image-name">${file.name}</div>
            </div>
            <div class="remove-button"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg></div>
        `;

        const imageDisplay = this.querySelector('img');
        const tempUrl = URL.createObjectURL(file);

        imageDisplay.onload = () => URL.revokeObjectURL(tempUrl);
        imageDisplay.src = tempUrl;

        this.querySelector('.remove-button').addEventListener('click', () => this.dispatchEvent(Object.assign(new Event('remove'), { index })));
    };
};
customElements.define('image-entry', ImageEntry);