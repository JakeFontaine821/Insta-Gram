import AddStyle from '../js/Styles.js';
import { sendRequest } from '../js/utils.js';

import './SetLocationPopup.js';

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
        border: 1px solid var(--text);
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
        height: calc(100% - 6px);
        aspect-ratio: 1;
        border-radius: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        font-size: 3rem;
        background-image: repeating-linear-gradient( 135deg, #ccc, #777);
    }

    .landing-page .settings-button svg{
        flex: .8;
    }

    /********************************* CALENDER BUTTON ******************************/
    .landing-page .calender-button{
        flex-direction: column;
        justify-content: space-between;
        overflow: hidden;
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
        background-color: #87CEEB;
        display: flex;
        justify-content: center;
        align-items: center;
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
                        Set Location
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
                                <svg class="second-hand" xmlns="http://www.w3.org/2000/svg" width="260" height="260" viewBox="0 0 260 260" fill="#eadaf0" stroke-width="6"><path stroke="#bc87b0" stroke-width="3" d="M130 130V40"/><circle cx="130" cy="40" r="1.5" fill="#bc87b0"/></svg>
                                <svg class="hour-hand" xmlns="http://www.w3.org/2000/svg" width="260" height="260" viewBox="0 0 260 260" fill="#eadaf0" stroke-width="6"><circle cx="130" cy="130" r="5"/><circle cx="130" cy="130" r="2" fill="#38293d"/><path stroke="#eadaf0" d="M130 127V95"/><circle cx="130" cy="95" r="3"/></svg>
                                <svg class="minute-hand" xmlns="http://www.w3.org/2000/svg" width="260" height="260" viewBox="0 0 260 260" fill="#eadaf0" stroke-width="6"><circle cx="130" cy="130" r="5"/><path stroke="#eadaf0" stroke-width="4" d="M130 127V65"/><circle cx="130" cy="65" r="2"/><circle cx="130" cy="130" r="2" fill="#38293d"/></svg>
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
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z"/></svg>
                        Settings
                    </div>

                </div>
            </div>

            <set-location-popup></set-location-popup>
        `;

        // Clock Button
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

        (async () => {
            // const gridPoint = await sendRequest(`https://api.weather.gov/points/${43.97947500053334},${-71.120682}`);
            // console.log(gridPoint);
            // const properties = gridPoint.properties;
            // console.log(properties)
            // const forcast = await sendRequest(`https://api.weather.gov/gridpoints/${properties.gridId}/${properties.gridX},${properties.gridY}/forecast`);
            // console.log(forcast);

            // const apiKey = '71f92ea9dd2f4790b92ea9dd2f779061';
            // const typedQuery = 'Dighton';
            // const a = await sendRequest(`https://api.weather.com/v3/location/search?query=${typedQuery}&language=en-US&format=json&apiKey=${apiKey}&locationType=city%2Clocality%2Cneighborhood%2Cpostal%2Cairport%2Caddress`)
            // console.log(a)
        })();

        const weatherButton = this.querySelector('.weather-button');
        const setLocationPopup = this.querySelector('.set-location-popup');
        weatherButton.addEventListener('click', () => setLocationPopup.classList.remove('hidden'));
    };

    
};
customElements.define('landing-page', LandingPage);