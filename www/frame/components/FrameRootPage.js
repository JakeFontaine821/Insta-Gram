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

        const pages = {
            'landing': document.querySelector('.landing-page'),
            'albums': document.querySelector('.album-page'),
            'slideshow': document.querySelector('.slideshow-page')
        };

        const swapPages = (page) => {
            console.log(page)
            for(const [ pageKey, pageElement ] of Object.entries(pages)){
                pageElement.toggleVisible(page === pageKey);
            }
            // LandingPage.toggleVisible(showLanding);
            // AlbumPage.toggleVisible(!showLanding); // Album page has special functions
        };

        for(const [ pageKey, pageElement ] of Object.entries(pages)){
            pageElement.addEventListener('switchpages', ({page}) => swapPages(page));
        }

        // LandingPage.addEventListener('photos', ({page}) => swapPages(page));
        // AlbumPage.addEventListener('back', ({page}) => swapPages(page));
    };
};
customElements.define('frame-root-page', FrameRootPage);