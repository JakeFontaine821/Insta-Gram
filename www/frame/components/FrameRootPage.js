import AddStyle from '../js/Styles.js';
import './LandingPage.js';

AddStyle(`
    .frame-root-page{
        height: 100vh;
        width: 100vw;
    }
`);

export default class FrameRootPage extends HTMLElement{
    constructor(){
        super();

        this.classList.add('frame-root-page');

        this.innerHTML = `
            <landing-page></landing-page>
        `;
    };
};
customElements.define('frame-root-page', FrameRootPage);