import AddStyle from '../js/Styles.js';

AddStyle(/*css*/`
    .settings-page{
        height: 100vh;
        width: 100vw;
        display: flex;
    }

    .settings-page > div{
        height: 100%;
    }

    .settings-page > .tabs{
        flex: 1;
        display: flex;
        flex-direction: column;
    }

    .settings-page > .panels{
        flex: 2;
    }
`);

export default class SettingsPage extends HTMLElement{
    constructor(){
        super();
        
        this.classList.add('settings-page', 'hidden');

        this.innerHTML = `
            <div class="tabs">
                <div class="back-tab">
                    <svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="16px"><path d="M624-96 240-480l384-384 68 68-316 316 316 316-68 68Z"/></svg>
                    <div>Back</div>
                </div>
                <div class="about-tab">about</div>
                <div class="wifi-tab">wifi</div>
                <div class="credits-tab">credits</div>
            </div>
            <div class="panels">
            </div>
        `;

        const backTab = this.querySelector('.back-tab');
        backTab.addEventListener('click', () => this.dispatchEvent(new Event('close')));
    };
};
customElements.define('settings-page', SettingsPage);