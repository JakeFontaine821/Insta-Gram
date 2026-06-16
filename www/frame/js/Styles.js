
const styleNode = document.createElement('style');
document.querySelector('head').appendChild(styleNode);

const AddStyle = styleNode.styleSheet ? style => styleNode.styleSheet.cssText += style : style => styleNode.appendChild(document.createTextNode(style));
export default AddStyle;

AddStyle(/*css*/`
    /************************** GLOBAL STYLES **************************/
    @import url('https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,100..700;1,100..700&display=swap');

    :root{
        --text: #050315;
        --background: #fbfbfe;
        --primary: #713e7c;
        --secondary: #ceaad0;
        --accent: #bc87b0;

        --a: #82729e;
        --b: #c9b0b5;
        --c: #ad9187;
        
        --d: #a7abde;
        --e: #c8ceee;
        --f: #eadaf0;
        --g: #f3e4f5;
    }

    body{
        width: 100vw;
        height: 100vh;
        margin: 0;
        overflow-x: hidden;
        overflow-y: auto;
        background-color: var(--f);
        color: var(--text);
        fill: var(--text);

        font-family: "Josefin Sans", sans-serif;
        font-optical-sizing: auto;
        font-weight: 400;
        font-style: normal;
        font-size: 2rem;
    }

    body *{
        box-sizing: border-box;
    }

    body input{
        font-family: "Josefin Sans", sans-serif;
        font-optical-sizing: auto;
        font-weight: 400;
        font-style: normal;
        font-size: 1.75rem;

        height: 45px;
        text-align: center;
        border: 1px solid transparent;
        background-color: var(--background);
    }

    body select{
        font-family: "Josefin Sans", sans-serif;
        font-optical-sizing: auto;
        font-weight: 400;
        font-style: normal;
        font-size: 1.75rem;

        text-align: center;
        border: 1px solid transparent;
        background-color: var(--background);
    }

    body input:focus{
        outline: none;
    }

    body input::placeholder{
        font-style: italic;
    }

    body input[type="file"] {
        display: none;
    }

    body label{
        font-size: 1.25rem;
        border-bottom: 1px solid var(--accent);
        margin-bottom: 5px;
    }

    .hidden{
        display: none !important;
    }

    .invalid{
        border: 2px solid red;
    }

    *[disabled]{
        pointer-events: none;
        opacity: 30%;
    }

    .loading {
        position: relative;
    }

    .loading::after {
        content: "";
        position: absolute;
        left: 50%;
        top: 50%;
        height: var(--loading-size, 75%);
        aspect-ratio: 1;
        transform: translate(-50%, -50%) rotate(0deg);
        border-radius: 50%;
        box-sizing: border-box;
        border: var(--loading-thickness, 4px) solid transparent;
        border-top-color: var(--loading-color, black);
        clip-path: inset(0 0 50% 0);
        animation: loading-spin var(--loading-duration, 1s) linear infinite;
        pointer-events: none;
        z-index: 9998;
    }

    @keyframes loading-spin {
        to { transform: translate(-50%, -50%) rotate(360deg); }
    }

    @keyframes imageFade {
        0%   { opacity: 0%; }
        15%  { opacity: 100%; }
        85%  { opacity: 100%; }
        100% { opacity: 0%; }
    }

    /* Width of the scrollbar */
    ::-webkit-scrollbar {
        width: 5px;
    }

    /* Track (background of scrollbar) */
    ::-webkit-scrollbar-track {
        background: transparent;
        border-radius: 10px;
    }

    /* Thumb (the draggable handle) */
    ::-webkit-scrollbar-thumb {
        background: #888;
        border-radius: 10px;
    }

    /* Thumb on hover */
    ::-webkit-scrollbar-thumb:hover {
        background: #555;
    }
`);