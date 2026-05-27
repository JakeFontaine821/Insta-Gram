async function getWeatherSuggestions(queryString){
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${queryString}`;
    const params = {
        'headers': {
            "User-Agent": "Insta-Gram/1.0 (Fontaine.JakeA@gmail.com)"
        },
        'body': null,
        'method': 'GET'
    };

    const response = await fetch(url, params);
    const responseJson = await response.json();

    return responseJson;
};

module.exports = {
    getWeatherSuggestions
};