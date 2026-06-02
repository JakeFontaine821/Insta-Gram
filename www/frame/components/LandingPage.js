import AddStyle from '../js/Styles.js';
import { sendRequest, WeatherToIcon } from '../js/utils.js';

import './SetLocationPopup.js';
import './SettingsPopup.js';

AddStyle(/*css*/`
    /********************************* WHOLE PAGE ******************************/
    .landing-page{
        height: 100vh;
        width: 100vw;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 10vw;
        gap: 10px;
    }

    .landing-page > div{
        flex: 1;
        aspect-ratio: 1;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .landing-page > .right > div{
        flex: 1;
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .landing-page .button{
        flex: 1;
        aspect-ratio: 1;

        display: flex;
        align-items: center;
        justify-content: center;

        background: var(--background);
        border-radius: 20px;
    }

    /********************************* CLOCK BUTTON ******************************/
    .landing-page .clock-button{
        background: black;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
    }

    .landing-page .clock-button .container{
        height: 100%;
        width: 100%;
        transition: transform .2s;
    }

    .landing-page .clock-button.shift .container{
        transform: translateY(-100%);
    }

    .landing-page .clock-button .container > div{
        height: 100%;
        width: 100%;
    }

    .landing-page .analog{
        position: relative;
    }

    .landing-page .clock-button .analog svg{
        height: 100%;
        width: 100%;
        position: absolute;
    }

    .landing-page .digital{
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--background);
        font-size: 4.5rem;
    }

    /********************************* SETTINGS BUTTON ******************************/
    .landing-page .settings-button{
        background-color: #9c9c9c;
    }

    /********************************* CALENDER BUTTON ******************************/
    .landing-page .calender-button{
        flex-direction: column;
        justify-content: space-between;
        overflow: hidden;
        font-weight: 600;
    }

    .landing-page .calender-button .month{
        width: 100%;
        display: flex;
        justify-content: center;
        background: #f22;
        padding: 15px 0 10px;
        font-weight: 600;
        font-size: 4rem;
    }

    .landing-page .calender-button .date{
        font-size: 12rem;
    }

    .landing-page .calender-button .day{
        font-size: 3rem;
    }

    /********************************* WEATHER BUTTON ******************************/
    .landing-page .weather-button{
        text-align: center;
        transition: background-color 1s, color 1s;
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: 2.75rem;

        color: var(--text);
        background-color: #87CEEB;
        text-shadow: 0px 0px 5px #87CEEB;
        font-weight: 600;
    }

    .landing-page .weather-button.night{
        color: var(--g);
        background-color: #131862;
        text-shadow: 0px 0px 5px #131862;
    }

    .landing-page .weather-button > div{
        display: flex;
        width: 100%;
    }

    .landing-page .weather-button .top{
        justify-content: space-evenly;
        padding: 15px 0;
    }

    .landing-page .weather-button .middle{
        flex: 1;
        position: relative;
    }

    .landing-page .weather-button .middle .current-temp{
        position: absolute;
        bottom: 0;
        left: 10%;
        font-size: 8rem;
        z-index: 2;
    }

    .landing-page .weather-button .middle .icon{
        position: absolute;
        top: -20%;
        right: 0;
        width: 65%;
    }

    .landing-page .weather-button .bottom{
        justify-content: space-evenly;
        padding: 10px 0;
    }
`);

export default class LandingPage extends HTMLElement{
    constructor(){
        super();

        this.classList.add('landing-page');
        const date = new Date();
        const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][date.getMonth()];
        const day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()];

        this.innerHTML = `
            <div class="left">
                <div class="button">Photos</div>
            </div>
            <div class="right">
                <div class="top">

                    <div class="button weather-button">
                        Getting Weather Information
                    </div>

                    <div class="button calender-button">
                        <div class="month">${month}</div>
                        <div class="date">${date.getDate()}</div>
                        <div class="day">${day}</div>
                    </div>

                </div>
                <div class="bottom">

                    <div class="button clock-button">
                        <div class="container">
                            <div class="analog">
                                <svg class="clock" xmlns="http://www.w3.org/2000/svg" width="260" height="260" viewBox="0 0 260 260" fill="#eadaf0" stroke-width="6"><circle cx="130" cy="130" r="120" fill="#38293d"/><text x="113" y="44" font-size="36">12</text><text dx="223" dy="142.5" font-size="36">3</text><text dx="120" dy="242" font-size="36">6</text><text dx="18" dy="142.5" font-size="36">9</text><path d="m180 43.397-5 8.66M80 216.604l5-8.66M216.603 80l-8.66 5M43.396 180l8.66-5m164.547 5-8.66-5M43.396 80l8.66 5M180 216.603l-5-8.66M80 43.396l5 8.66" stroke="#eadaf0" stroke-linecap="round"/></svg>
                                <svg class="second-hand" xmlns="http://www.w3.org/2000/svg" width="260" height="260" viewBox="0 0 260 260" fill="#eadaf0" stroke-width="6"><path stroke="#bc87b0" stroke-width="4" d="M130 130V40"/><circle cx="130" cy="40" r="1.5" fill="#bc87b0"/></svg>
                                <svg class="hour-hand" xmlns="http://www.w3.org/2000/svg" width="260" height="260" viewBox="0 0 260 260" fill="#eadaf0" stroke-width="6"><circle cx="130" cy="130" r="5"/><circle cx="130" cy="130" r="2" fill="#38293d"/><path stroke="#eadaf0" d="M130 127V85"/><circle cx="130" cy="85" r="3"/></svg>
                                <svg class="minute-hand" xmlns="http://www.w3.org/2000/svg" width="260" height="260" viewBox="0 0 260 260" fill="#eadaf0" stroke-width="6"><circle cx="130" cy="130" r="5"/><path stroke="#eadaf0" stroke-width="5" d="M130 127V55"/><circle cx="130" cy="55" r="2"/><circle cx="130" cy="130" r="2" fill="#38293d"/></svg>
                            </div>
                            <div class="digital">
                                <div class="hour">00</div>
                                :
                                <div class="minute">00</div>
                                <div class="am-or-pm">am</div>
                            </div>
                        </div>
                    </div>

                    <div class="button settings-button">
                        <svg viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="b" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eadaf0"/><stop offset="100%" stop-color="#a7abde"/></linearGradient><filter id="a" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="6" stdDeviation="6" flood-opacity=".08"/></filter></defs><g filter="url(#a)" transform="translate(57 32)"><path d="M56 0c5 0 9 4 9 9v10c5 2 9 4 13 7l9-9c4-4 10-4 14 0l10 10c4 4 4 10 0 14l-9 9c3 4 5 8 7 13h10c5 0 9 4 9 9v14c0 5-4 9-9 9h-10c-2 5-4 9-7 13l9 9c4 4 4 10 0 14l-10 10c-4 4-10 4-14 0l-9-9c-4 3-8 5-13 7v10c0 5-4 9-9 9H42c-5 0-9-4-9-9v-10c-5-2-9-4-13-7l-9 9c-4 4-10 4-14 0l-10-10c-4-4-4-10 0-14l9-9c-3-4-5-8-7-13h-10c-5 0-9-4-9-9V72c0-5 4-9 9-9h10c2-5 4-9 7-13l-9-9c-4-4-4-10 0-14l10-10c4-4 10-4 14 0l9 9c4-3 8-5 13-7V9c0-5 4-9 9-9z" fill="url(#b)"/><circle cx="49" cy="79" r="33" fill="#82729e"/><circle cx="49" cy="79" r="28" fill="#9c9c9c"/></g><g filter="url(#a)" transform="matrix(.75 0 0 .75 138 108)"><path d="M56 0c5 0 9 4 9 9v10c5 2 9 4 13 7l9-9c4-4 10-4 14 0l10 10c4 4 4 10 0 14l-9 9c3 4 5 8 7 13h10c5 0 9 4 9 9v14c0 5-4 9-9 9h-10c-2 5-4 9-7 13l9 9c4 4 4 10 0 14l-10 10c-4 4-10 4-14 0l-9-9c-4 3-8 5-13 7v10c0 5-4 9-9 9H42c-5 0-9-4-9-9v-10c-5-2-9-4-13-7l-9 9c-4 4-10 4-14 0l-10-10c-4-4-4-10 0-14l9-9c-3-4-5-8-7-13h-10c-5 0-9-4-9-9V72c0-5 4-9 9-9h10c2-5 4-9 7-13l-9-9c-4-4-4-10 0-14l10-10c4-4 10-4 14 0l9 9c4-3 8-5 13-7V9c0-5 4-9 9-9z" fill="url(#b)"/><circle cx="49" cy="79" r="33" fill="#82729e"/><circle cx="49" cy="79" r="28" fill="#9c9c9c"/></g></svg>
                    </div>

                </div>
            </div>

            <set-location-popup></set-location-popup>
            <settings-popup></settings-popup>
        `;

        /***************************************************************************************/
        /*                              CLOCK BUTTON                                           */
        /***************************************************************************************/
        const clockButton = this.querySelector('.clock-button');
        clockButton.addEventListener('click', () => clockButton.classList.toggle('shift'));

        const hourHandAnalog = this.querySelector('.analog .hour-hand');
        const minuteHandAnalog = this.querySelector('.analog .minute-hand');
        const secondHandAnalog = this.querySelector('.analog .second-hand');
        const hourDigital = this.querySelector('.digital .hour');
        const minuteDigital = this.querySelector('.digital .minute');
        const amOrPm = this.querySelector('.digital .am-or-pm');
        const setTime = () => {
            const currentTime = new Date();
            const hours = currentTime.getHours() % 12;
            const minutes = currentTime.getMinutes();
            const seconds = currentTime.getSeconds();

            hourHandAnalog.style.rotate = `${((hours / 12) * 360) + ((minutes / 60) * 30)}deg`;
            minuteHandAnalog.style.rotate = `${(minutes / 60) * 360}deg`;
            secondHandAnalog.style.rotate = `${(seconds / 60) * 360}deg`;

            const adjustedHours = hours === 0 || hours % 12 === 0 ? 12 : hours % 12;
            hourDigital.innerHTML = `${adjustedHours}`.padStart(2, '0');
            minuteDigital.innerHTML = `${minutes}`.padStart(2, '0');
            amOrPm.innerHTML = currentTime.getHours() >= 12 ? 'pm' : 'am';
        };
        setTime();
        setInterval(setTime, 1000);

        /***************************************************************************************/
        /*                              WEATHER BUTTON                                         */
        /***************************************************************************************/
        const weatherButton = this.querySelector('.weather-button');
        const setLocationPopup = this.querySelector('.set-location-popup');
        weatherButton.addEventListener('click', () => setLocationPopup.classList.remove('hidden'));

        const loadWeather = async () => {
            weatherButton.classList.add('loading');
            const weatherResponse = await sendRequest('/frame/weather');

            if(!weatherResponse.success){ // Failed to get info, display to user and try again in a minute
                weatherButton.innerHTML = 'Failed to get weather information';
                setTimeout(loadWeather, 60000); // Try again in a minute

                return weatherButton.classList.remove('loading');
            }

            console.log(weatherResponse);
            weatherButton.innerHTML = `
                <div class="top">
                    <div class="word">${weatherResponse.data.forecast}</div>
                </div>
                <div class="middle">
                    <div class="current-temp">${weatherResponse.data.temperature}°</div>
                    <div class="icon">${WeatherToIcon(weatherResponse.data.forecast, weatherResponse.data.isDaytime)}</div>
                </div>
                <div class="bottom">
                    <div class="max-temp">H:${weatherResponse.data.maxTemperature}°</div>
                    <div class="min-temp">L:${weatherResponse.data.minTemperature}°</div>
                </div>
            `;

            weatherButton.classList.toggle('night', !weatherResponse.data.isDaytime);
            weatherButton.classList.remove('loading');

            // Load weather again in an hour to keep up to date :)
            setTimeout(loadWeather, 3600000);
        };

        setLocationPopup.addEventListener('locationset', loadWeather);
        loadWeather();

        /***************************************************************************************/
        /*                              SETTINGS BUTTON                                        */
        /***************************************************************************************/
        const settingsButton = this.querySelector('.settings-button');
        const settingsPopup = this.querySelector('.settings-popup');
        settingsButton.addEventListener('click', () => settingsPopup.show());
    };
};
customElements.define('landing-page', LandingPage);