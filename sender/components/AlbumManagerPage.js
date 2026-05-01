import AddStyle from '../js/Styles.js';
import { sendRequest } from '../js/utils.js';

AddStyle(/*css*/`
    .album-manager-page{
        position: relative;
        height: 100vh;
        width: 100vw;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top: 10vh;
    }

    .album-manager-page .header{
        font-size: 3rem;
        font-weight: 500;
    }

    .album-manager-page .back-button{
        position: absolute;
        top: 10px;
        left: 10px;
        display: flex;
        align-items: center;
    }
`);

export default class AlbumManagerPage extends HTMLElement{
    constructor(){
        super();

        this.classList.add('album-manager-page', 'hidden');

        this.innerHTML = /*html*/`
            <div class="header">Manage Albums</div>
            <div class="back-button">
                <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px"><path d="M624-96 240-480l384-384 68 68-316 316 316 316-68 68Z"/></svg>
                Back
            </div>
        `;
    };
};
customElements.define('album-manager-page', AlbumManagerPage);