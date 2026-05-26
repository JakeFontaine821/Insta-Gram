import AddStyle from '../js/Styles.js';
import { sendRequest } from '../js/utils.js';

AddStyle(`
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

    .set-location-popup .popup-container .no-suggested-display{
        width: 100%;
        height: 100%;
        font-style: italic;
        color: #888;
        display: flex;
        justify-content: center;
        align-items: center;
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
            </div>
        `;

        const locationSearchInput = this.querySelector('.location-search-input');
        const lookupListInner = this.querySelector('.lookup-list-inner');
        const noSuggestedDisplay = this.querySelector('.no-suggested-display');

        locationSearchInput.addEventListener('input', async () => {
            const searchInput = locationSearchInput.value;
            if(searchInput.length < 3){ return this.SwapDisplay(true); }

            // Clear existing entries
            while(lookupListInner.firstChild){ lookupListInner.firstChild.remove(); }

            // Look up new entries for input
            const searchResponse = await sendRequest(`/frame/weather/suggest?query=${searchInput}`);
            if(searchResponse.errors){ return this.SwapDisplay(true); }

            // Prune unwanted locations clean data
            const suggestedLocations = [];
            for (let i = 0; i < searchResponse.location.address.length; i++) {
                if(searchResponse.location.countryCode[i] !== 'US'){ continue; }

                suggestedLocations.push({
                    town:    searchResponse.location.displayName[i],
                    state:   searchResponse.location.adminDistrict[i],
                    country: searchResponse.location.country[i],
                    lat:     searchResponse.location.latitude[i],
                    lng:     searchResponse.location.longitude[i]
                });
            }

            // Create Display for suggestions
            console.log(suggestedLocations)
            for(const location of suggestedLocations){
                const newDiv = document.createElement('div');
                newDiv.classList.add('suggested-location');
                newDiv.innerHTML = `${location.town},${location.state},${location.country}`;

                lookupListInner.appendChild(newDiv);
            }

            // Swap in the suggestions if there are any
            this.SwapDisplay(suggestedLocations.length ? false : true);
        });
    };

    SwapDisplay(showNoSuggested=false){
        this.querySelector('.lookup-list-inner').classList.toggle('hidden', showNoSuggested);
        this.querySelector('.no-suggested-display').classList.toggle('hidden', !showNoSuggested);
    };
};
customElements.define('set-location-popup', SetLocationPopup);