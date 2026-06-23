import AddStyle from '../js/Styles.js';
import './LandingPage.js';
import './AlbumPage.js';
import './SlideshowPage.js';
import './KeyboardOverlay.js';

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
            <keyboard-overlay></keyboard-overlay>
        `;

        const pages = {
            'landing': document.querySelector('.landing-page'),
            'albums': document.querySelector('.album-page'),
            'slideshow': document.querySelector('.slideshow-page')
        };
        const keyboardOverlay = document.querySelector('keyboard-overlay');

        const swapPages = (page, albumId) => {
            for(const [ pageKey, pageElement ] of Object.entries(pages)){
                pageElement.toggleVisible(page === pageKey, albumId);
            }
        };

        for(const [ pageKey, pageElement ] of Object.entries(pages)){
            pageElement.addEventListener('switchpages', ({page, albumId}) => swapPages(page, albumId));

            // an input was selected, show the keyboard overlay and set the element to edit
            pageElement.addEventListener('showkeyboard', ({element}) => keyboardOverlay.show(element));
        }
    };
};
customElements.define('frame-root-page', FrameRootPage);