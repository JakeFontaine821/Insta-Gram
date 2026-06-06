import AddStyle from '../js/Styles.js';

AddStyle(/*css*/`
    .albums-page{
        height: 100vh;
        width: 100vw;
        display: flex;
        flex-direction: column;
    }

    .albums-page > div{
        width: 100%;
    }
`);

export default class AlbumsPage extends HTMLElement{
    constructor(){
        super();

        this.classList.add('albums-page');

        this.innerHTML = ``;
    };
};
customElements.define('albums-page', AlbumsPage);