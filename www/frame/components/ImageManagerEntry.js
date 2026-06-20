import AddStyle from '../js/Styles.js';

AddStyle(/*css*/`
    .image-manager-entry{
        padding: 10px;
        display: flex;
        align-items: center;
        background-color: var(--g);
        border: 2px solid var(--accent);
        border-radius: 20px;
        gap: 5px;
        cursor: pointer;
    }

    .image-manager-entry .image-display{
        height: 80px;
        width: 80px;
        overflow: hidden;
    }

    .image-manager-entry .image-display img{
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
    }

    .image-manager-entry .sent-on{
        flex: 1;
    }

    .image-manager-entry .icon{
        display: flex;
        justify-content: center;
        align-items: center;
    }
`);

export default class ImageManagerEntry extends HTMLElement{
    constructor(metadata){
        super();

        this.classList.add('image-manager-entry');

        this.innerHTML = /*html*/`
            <div class="image-display"><img loading="lazy" decoding="async" alt="Loading Image :)"></div>
            <div class="sent-on">${new Date(metadata.date_added).toDateString()}</div>
            <div class="icon"><svg xmlns="http://www.w3.org/2000/svg" width="2rem" height="1.75rem" viewBox="0 -860 960 960" style="transform:scaleX(-1)"><path d="M624-96 240-480l384-384 68 68-316 316 316 316-68 68Z"/></svg></div>
        `;

        this.querySelector('.image-display img').src = `${metadata.file_path}`;
    };
};
customElements.define('image-manager-entry', ImageManagerEntry);