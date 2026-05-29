import AddStyle from '../js/Styles.js';
import { sendRequest } from '../js/utils.js';

AddStyle(/*css*/`
    .set-location-popup{
        height: 100vh;
        width: 100vw;
        background-color: #00000066;
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .set-location-popup .popup-container{
        height: 40vh;
        width: 40vw;
        padding: 20px;
        background-color: var(--background);
        border-radius: 30px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
    }

    .set-location-popup .popup-container input{
        width: 100%;
        border: 1px solid var(--primary);
        border-radius: 20px;
    }

    .set-location-popup .popup-container .lookup-list-outer{
        width: 100%;
        flex: 1;
        overflow-y: auto;
    }

    .set-location-popup .popup-container .lookup-list-inner{
        display: flex;
        flex-direction: column;
        gap: 5px;
    }

    .set-location-popup .popup-container .no-suggested-display{
        width: 100%;
        height: 100%;
        font-style: italic;
        color: #888;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .set-location-popup .popup-container .suggested-location{
        display: flex;
        justify-content: center;
        align-items: end;
        padding: 10px 0 0 0;
        border: 1px solid var(--accent);
        border-radius: 10px;
        cursor: pointer;
        background: var(--g);
    }

    .set-location-popup .popup-container .suggested-location .rest{
        font-size: 1.5rem;
    }

    .set-location-popup .popup-container .error-text{
        color: #aa3333;
        font-size: 1.5rem;
    }
`);

export default class SetLocationPopup extends HTMLElement{
    constructor(){
        super();

        this.classList.add('set-location-popup', 'hidden');

        this.innerHTML = `
            <div class="popup-container">
                <input class="location-search-input" placeholder="Search for City or Town" />
                <div class="lookup-list-outer">
                    <div class="lookup-list-inner hidden"></div>
                    <div class="no-suggested-display">No suggested locations found</div>
                </div>
                <div class="error-text"></div>
            </div>
        `;

        const locationSearchInput = this.querySelector('.location-search-input');
        const lookupListInner = this.querySelector('.lookup-list-inner');
        const noSuggestedDisplay = this.querySelector('.no-suggested-display');
        const errorText = this.querySelector('.error-text');

        let suggestTimeout = null;
        locationSearchInput.addEventListener('input', () => {
            const searchInput = locationSearchInput.value;
            if(searchInput.length < 3){ return this.SwapDisplay(true); }

            // Clear an existing timout to send an updated one instead
            if(suggestTimeout){ clearTimeout(suggestTimeout); }

            suggestTimeout = setTimeout(async () => {
                // Clear existing entries
                while(lookupListInner.firstChild){ lookupListInner.firstChild.remove(); }

                // Look up new entries for input
                const searchResponse = await sendRequest('/frame/weather/suggest', { body: { query: encodeURIComponent(searchInput) } });
                if(!searchResponse.results){ suggestTimeout = null; return this.SwapDisplay(true); }
                
                // Create a new divs for suggestions and hookup click listener
                for(const result of searchResponse.results){
                    const newDiv = document.createElement('div');
                    newDiv.classList.add('suggested-location');
                    newDiv.info = { town: result.name, state: result.admin1, country: result.country, lat: result.latitude, lng: result.longitude };
                    newDiv.innerHTML = `
                        <div class="town">${result.name}</div>
                        <div class="rest">,${result.admin1},${result.country}</div>
                    `;

                    newDiv.addEventListener('click', async () => {
                        const setWeatherResponse = await sendRequest('/frame/weather/set', { body: { locationInfo: newDiv.info } });

                        if(!setWeatherResponse.success){
                            console.error('Failed to set location', setWeatherResponse.error);
                            errorText.innerHTML = 'Failed to set location';
                            return;
                        }

                        errorText.innerHTML = '';
                        this.dispatchEvent(new Event('locationset'));
                        this.classList.add('hidden');
                    });

                    lookupListInner.appendChild(newDiv);
                }

                this.SwapDisplay();
                suggestTimeout = null;
            }, 500);
        });
    };

    SwapDisplay(showNoSuggested=false){
        this.querySelector('.lookup-list-inner').classList.toggle('hidden', showNoSuggested);
        this.querySelector('.no-suggested-display').classList.toggle('hidden', !showNoSuggested);
    };
};
customElements.define('set-location-popup', SetLocationPopup);