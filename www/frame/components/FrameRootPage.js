import AddStyle from '../js/Styles.js';

AddStyle(``);

export default class FrameRootPage extends HTMLElement{
    constructor(){
        super();

        this.classList.add('frame-root-page');

        this.innerHTML = `
            Frame type shit
        `;
    };
};
customElements.define('frame-root-page', FrameRootPage);