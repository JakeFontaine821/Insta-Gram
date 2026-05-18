import AddStyle from '../js/Styles.js';

AddStyle(`
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

    .landing-page .clock-button{
        background: black;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .landing-page .clock-button .clock{
        flex: .9;
        aspect-ratio: 1;
        background: white;
        border-radius: 50%;
        position: relative;
    }

    .landing-page .clock-button .time-line{
        position: absolute;
        top: -2px;
        left: calc(50% - 3px);
        height: calc(100% + 4px);
        width: 6px;
        background-image: linear-gradient( black 10%, white 10%, white 90%, black 90%);
    }

    .landing-page .clock-button .hour-hand{
        position: absolute;
        top: -2px;
        left: calc(50% - 3px);
        height: calc(100% + 4px);
        width: 6px;
        background-image: linear-gradient( transparent 30%, #2f2f2f 30%, #2f2f2f 52%, transparent 52%);
    }

    .landing-page .clock-button .minute-hand{
        position: absolute;
        top: -2px;
        left: calc(50% - 3px);
        height: calc(100% + 4px);
        width: 6px;
        background-image: linear-gradient( transparent 10%, #2f2f2f 10%, #2f2f2f 52%, transparent 52%);
    }

    .landing-page .clock-button .second-hand{
        position: absolute;
        top: -2px;
        left: calc(50% - 2px);
        height: calc(100% + 4px);
        width: 4px;
        background-image: linear-gradient( transparent 5%, #f44 5%, #f44 52%, transparent 52%);
    }
`);

export default class LandingPage extends HTMLElement{
    constructor(){
        super();

        this.classList.add('landing-page');

        this.innerHTML = `
            <div class="left">
                <div class="button">Photos</div>
            </div>
            <div class="right">
                <div class="top">
                    <div class="button">Weather</div>
                    <div class="button">Calender</div>
                </div>
                <div class="bottom">
                    <div class="button clock-button">
                        <div class="clock">
                            <div class="time-line"></div>
                            <div class="time-line" style="rotate: 30deg;"></div>
                            <div class="time-line" style="rotate: 60deg;"></div>
                            <div class="time-line" style="rotate: 90deg;"></div>
                            <div class="time-line" style="rotate: 120deg;"></div>
                            <div class="time-line" style="rotate: 150deg;"></div>

                            <div class="second-hand"></div>
                            <div class="minute-hand"></div>
                            <div class="hour-hand"></div>
                        </div>
                    </div>
                    <div class="button">Settings</div>
                </div>
            </div>
        `;

        // Clock Button
        const hourHand = this.querySelector('.hour-hand');
        const minuteHand = this.querySelector('.minute-hand');
        const secondHand = this.querySelector('.second-hand');
        const setTime = () => {
            const currentTime = new Date();
            const hours = currentTime.getHours();
            const minutes = currentTime.getMinutes();
            const seconds = currentTime.getSeconds();

            hourHand.style.rotate = `${(((hours / 24) * 360) - 15) + ((minutes / 60) * 30)}deg`;
            minuteHand.style.rotate = `${(minutes / 60) * 360}deg`;
            secondHand.style.rotate = `${(seconds / 60) * 360}deg`;
        };
        setTime();
        setInterval(setTime, 1000);
    };
};
customElements.define('landing-page', LandingPage);