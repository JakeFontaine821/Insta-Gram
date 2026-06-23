import AddStyle from '../js/Styles.js';

AddStyle(/*css*/`
    .keyboard-overlay{
        height: 100vh;
        width: 100vw;
        display: flex;
        align-items: end;
        justify-content: center;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 9999;
    }

    .keyboard-overlay .keyboard{
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: #1e2227;
        padding: 10px;
        border-radius: 20px;
        gap: 5px;
    }

    .keyboard-overlay .keyboard > div{
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 5px;
    }

    .keyboard-overlay .keyboard .key{
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100px;
        aspect-ratio: 1;
        background-color: #2d333a;
        color: var(--background);
        border-radius: 20px;
        cursor: pointer;
        user-select: none;
        font-size: 3rem;
    }

    .keyboard-overlay .keyboard .key.big{
        aspect-ratio: 2/1;
        font-size: 2.5rem;
    }

    .keyboard-overlay .keyboard.capslock .key[code="caps"]{
        background-color: var(--background);
        color: #2d333a;
    }

    /*************STYLE FOR MAIN CHARACTER UNDER SHIFT AND CAPSLOCK */
    .keyboard-overlay .keyboard .key .main{
        display: inline;
    }

    .keyboard-overlay .keyboard.capslock .key .main{
        display: none;
    }

    .keyboard-overlay .keyboard.alt .key .main{
        display: none;
    }

    .keyboard-overlay .keyboard.capslock.alt .key .main{
        display: inline;
    }

    /*************STYLE FOR ALTERNATE CHARACTER UNDER SHIFT AND CAPSLOCK */
    .keyboard-overlay .keyboard .key .alt{
        display: none;
    }

    .keyboard-overlay .keyboard.capslock .key .alt{
        display: inline;
    }

    .keyboard-overlay .keyboard.alt .key .alt{
        display: inline;
    }

    .keyboard-overlay .keyboard.capslock.alt .key .alt{
        display: none;
    }
`);

export default class KeyboardOverlay extends HTMLElement{
    constructor(){
        super();

        this.classList.add('keyboard-overlay', 'hidden');

        this.innerHTML = /*html*/`
            <div class="keyboard">
                <div class="number-row">
                    <div class="key"><div class="main">1</div><div class="alt">!</div></div>
                    <div class="key"><div class="main">2</div><div class="alt">@</div></div>
                    <div class="key"><div class="main">3</div><div class="alt">#</div></div>
                    <div class="key"><div class="main">4</div><div class="alt">$</div></div>
                    <div class="key"><div class="main">5</div><div class="alt">%</div></div>
                    <div class="key"><div class="main">6</div><div class="alt">^</div></div>
                    <div class="key"><div class="main">7</div><div class="alt">&</div></div>
                    <div class="key"><div class="main">8</div><div class="alt">*</div></div>
                    <div class="key"><div class="main">9</div><div class="alt">(</div></div>
                    <div class="key"><div class="main">0</div><div class="alt">)</div></div>
                </div>
                <div class="top-row">
                    <div class="key big" code="backspace">Backspace</div>
                    <div class="key"><div class="main">q</div><div class="alt">Q</div></div>
                    <div class="key"><div class="main">w</div><div class="alt">W</div></div>
                    <div class="key"><div class="main">e</div><div class="alt">E</div></div>
                    <div class="key"><div class="main">r</div><div class="alt">R</div></div>
                    <div class="key"><div class="main">t</div><div class="alt">T</div></div>
                    <div class="key"><div class="main">y</div><div class="alt">Y</div></div>
                    <div class="key"><div class="main">u</div><div class="alt">U</div></div>
                    <div class="key"><div class="main">i</div><div class="alt">I</div></div>
                    <div class="key"><div class="main">o</div><div class="alt">O</div></div>
                    <div class="key"><div class="main">p</div><div class="alt">P</div></div>
                    <div class="key big" code="backspace">Backspace</div>
                </div>
                <div class="middle-row">
                    <div class="key big" code="caps">Caps Lock</div>
                    <div class="key"><div class="main">a</div><div class="alt">A</div></div>
                    <div class="key"><div class="main">s</div><div class="alt">S</div></div>
                    <div class="key"><div class="main">d</div><div class="alt">D</div></div>
                    <div class="key"><div class="main">f</div><div class="alt">F</div></div>
                    <div class="key"><div class="main">g</div><div class="alt">G</div></div>
                    <div class="key"><div class="main">h</div><div class="alt">H</div></div>
                    <div class="key"><div class="main">j</div><div class="alt">J</div></div>
                    <div class="key"><div class="main">k</div><div class="alt">K</div></div>
                    <div class="key"><div class="main">l</div><div class="alt">L</div></div>
                    <div class="key big" code="close">Close</div>
                </div>
                <div class="bottom-row">
                    <div class="key big" code="shift">Shift</div>
                    <div class="key"><div class="main">z</div><div class="alt">Z</div></div>
                    <div class="key"><div class="main">x</div><div class="alt">X</div></div>
                    <div class="key"><div class="main">c</div><div class="alt">C</div></div>
                    <div class="key"><div class="main">v</div><div class="alt">V</div></div>
                    <div class="key"><div class="main">b</div><div class="alt">B</div></div>
                    <div class="key"><div class="main">n</div><div class="alt">N</div></div>
                    <div class="key"><div class="main">m</div><div class="alt">M</div></div>
                    <div class="key big" code="shift">Shift</div>
                </div>
            </div>
        `;

        const KEYBOARD_ELEMENT = this.querySelector('.keyboard');

        const capsLock = this.querySelector('.key[code="caps"]');
        capsLock.addEventListener('click', () => KEYBOARD_ELEMENT.classList.toggle('capslock'));

        for(const shiftKey of this.querySelectorAll('.key[code="shift"]')){
            shiftKey.addEventListener('mousedown', () => KEYBOARD_ELEMENT.classList.add('alt'));
            shiftKey.addEventListener('mouseup', () => KEYBOARD_ELEMENT.classList.remove('alt'));
        }

        for(const backspaceKey of this.querySelectorAll('.key[code="backspace"]')){
            backspaceKey.addEventListener('click', () => {
                this.INPUT_ELEMENT.value = this.INPUT_ELEMENT.value.slice(0, -1);
                this.INPUT_ELEMENT.dispatchEvent(new Event('input'));
            });
        }

        for(const typeableKey of this.querySelectorAll('.key:not([code])')){
            typeableKey.addEventListener('click', () => {
                const charToAdd = !!KEYBOARD_ELEMENT.classList.contains('capslock') !== !!KEYBOARD_ELEMENT.classList.contains('alt') ? typeableKey.lastChild : typeableKey.firstChild;
                this.INPUT_ELEMENT.value += charToAdd.innerHTML;
                this.INPUT_ELEMENT.dispatchEvent(new Event('input'));
            });
        }

        // EVENT LISTENER TO HIDE/CLOSE KEYBOARD OVERLAY
        this.addEventListener('click', e => {
            if(e.target.classList.contains('keyboard-overlay')){ this.hide(); }
        });

        this.querySelector('.key[code="close"]').addEventListener('click', () => this.hide());
    };

    show(inputElement){
        this.INPUT_ELEMENT = inputElement;
        this.classList.remove('hidden');
    };

    hide(){
        if(this.INPUT_ELEMENT){
            this.INPUT_ELEMENT.dispatchEvent(new Event('change'));
            this.INPUT_ELEMENT = null;
        }

        this.querySelector('.keyboard').classList.remove('capslock', 'alt');

        this.classList.add('hidden');
    };
};
customElements.define('keyboard-overlay', KeyboardOverlay);