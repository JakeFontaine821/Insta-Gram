import AddStyle from '../js/Styles.js';
import './LandingPage.js';
import './AlbumPage.js';
import './SlideshowPage.js';

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
            <album-page></album-page>
            <slideshow-page></slideshow-page>
        `;

        const LandingPage = document.querySelector('.landing-page');
        const AlbumPage = document.querySelector('.album-page');
        const SlideshowPage = document.querySelector('.slideshow-page');

        const swapPages = (showLanding=true) => {
            LandingPage.classList.toggle('hidden', !showLanding);
            AlbumPage.toggleVisible(!showLanding); // Album page has special functions
        };

        LandingPage.addEventListener('photos', () => swapPages(false));
        AlbumPage.addEventListener('back', () => swapPages(true));
    };
};
customElements.define('frame-root-page', FrameRootPage);