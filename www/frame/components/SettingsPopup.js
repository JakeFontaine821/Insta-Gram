import AddStyle from '../js/Styles.js';

AddStyle(/*css*/`
    .settings-popup{
        height: 100vh;
        width: 100vw;
        background-color: #00000066;
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .settings-popup .popup-container{
        height: 50vh;
        width: 50vw;
        background-color: var(--background);
        border-radius: 30px;
        display: flex;
        gap: 10px;
    }

    .settings-popup .popup-container > div{
        height: 100%;
    }

    .settings-popup .popup-container > .tabs{
        flex: 1;
        display: flex;
        flex-direction: column;
    }

    .settings-popup .popup-container .back-tab{
        padding: 10px;
        border-right: 1px solid var(--accent);
    }

    .settings-popup .popup-container .back-button{
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid var(--primary);
        border-radius: 20px;
        padding: 5px 10px 5px 5px;
        font-size: 1.5rem;
    }

    .settings-popup .popup-container .back-button div{
        padding-top: 4px;
    }

    .settings-popup .popup-container > .tabs > .tab{
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 10px;
        border-top: 1px solid var(--accent);
        border-right: 1px solid var(--accent);
    }

    .settings-popup .popup-container > .tabs > .tab.selected{
        border-right: 1px solid transparent
    }

    .settings-popup .popup-container > .tabs > .last{
        border-bottom: 1px solid var(--accent);
    }

    .settings-popup .popup-container > .tabs > .empty{
        border-top: 1px solid transparent;
        border-right: 1px solid var(--accent);
        flex: 1;
    }

    .settings-popup .popup-container > .panels{
        flex: 3;
    }
`);

export default class SettingsPopup extends HTMLElement{
    constructor(){
        super();
        
        this.classList.add('settings-popup', 'hidden');

        this.innerHTML = `
            <div class="popup-container">
                <div class="tabs">
                    <div class="back-tab">
                        <div class="back-button">
                            <svg xmlns="http://www.w3.org/2000/svg" width="2rem" height="1.75rem" viewBox="0 -860 960 960"><path d="M624-96 240-480l384-384 68 68-316 316 316 316-68 68Z"/></svg>
                            <div>Back</div>
                        </div>
                    </div>
                    <div class="about-tab tab selected" panel="about-panel">About</div>
                    <div class="wifi-tab tab" panel="wifi-panel">Wifi</div>
                    <div class="storage-tab tab" panel="storage-panel">Storage</div>
                    <div class="credits-tab tab last" panel="credits-panel">Credits</div>
                    <div class="empty"></div>
                </div>
                <div class="panels">
                    <div class="about-panel">About panel</div>
                    <div class="wifi-panel hidden">wifi panel</div>
                    <div class="storage-panel hidden">storage panel</div>
                    <div class="credits-panel hidden">credits panel</div>
                </div>
            </div>
        `;

        const backButton = this.querySelector('.back-button');
        backButton.addEventListener('click', () => this.classList.add('hidden'));

        for(const tabClass of ['.about-tab', '.wifi-tab', '.storage-tab', '.credits-tab']){
            const tab = this.querySelector(tabClass);

            tab.addEventListener('click', () => {
                const selectedTab = this.querySelector('.tabs .selected');
                this.querySelector(`.panels .${selectedTab.getAttribute('panel')}`).classList.add('hidden');
                selectedTab.classList.remove('selected');

                tab.classList.add('selected');
                this.querySelector(`.panels .${tab.getAttribute('panel')}`).classList.remove('hidden');
            });
        }
    };
};
customElements.define('settings-popup', SettingsPopup);