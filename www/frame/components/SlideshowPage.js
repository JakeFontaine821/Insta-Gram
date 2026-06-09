import AddStyle from '../js/Styles.js';

AddStyle(/*css*/`
    .slideshow-page{
        height: 100vh;
        width: 100vw;
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
    constructor(albumId){
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
    };
};
customElements.define('slideshow-page', SlideshowPage);