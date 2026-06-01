import AddStyle from '../js/Styles';

AddStyle(``);

export default class WifiEntry extends HTMLElement{
    constructor(config){
        super();

        this.classList.add('wifi-entry');

        this.innerHTML = `Wifi Entry :)`;
    };
};
customElements.define('wifi-entry', WifiEntry);