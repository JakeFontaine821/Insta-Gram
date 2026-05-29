import AddStyle from '../js/Styles.js';
import './LandingPage.js';
import './SettingsPage.js';

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
            <settings-page></settings-page>
        `;

        const landingPage = this.querySelector('.landing-page');
        const settingsPage = this.querySelector('.settings-page');
        const swapPages = (settings=false) => {
            landingPage.classList.toggle('hidden', settings);
            settingsPage.classList.toggle('hidden', !settings);
        };

        landingPage.addEventListener('settings', () => swapPages(true));
        settingsPage.addEventListener('close', () => swapPages(false));
    };
};
customElements.define('frame-root-page', FrameRootPage);