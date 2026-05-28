const LocationDatabaseManager = require('./locationDatabaseManager.js');

async function getWeatherSuggestions(queryString){
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${queryString}`;

    const response = await fetch(url);
    const responseJson = await response.json();

    return responseJson;
};

async function getWeatherData(){
    const locationInfoResponse = LocationDatabaseManager.getLocation();
    if(!locationInfoResponse.success || !locationInfoResponse.entries){ return { success: false, error: 'Failed to retrieve location from database' }; }

    const location = locationInfoResponse.entries;
    const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lng}&daily=temperature_2m_max,temperature_2m_min&models=gfs_seamless&current=temperature_2m,is_day,weather_code&timezone=America%2FNew_York&temperature_unit=fahrenheit`);
    const weatherResponseJson = await weatherResponse.json();

    // Only displaying the current weather info so I can prune everything else
    const currentWeatherInfo = {
        temperature: Math.round(weatherResponseJson.current.temperature_2m),
        maxTemperature: Math.round(weatherResponseJson.daily.temperature_2m_max[0]),
        minTemperature: Math.round(weatherResponseJson.daily.temperature_2m_min[0]),
        isDaytime: !!weatherResponseJson.current.is_day,
        forecast: getCategoryFromWMOCode(weatherResponseJson.current.weather_code)
    };

    return { success: true, data: currentWeatherInfo };
};

function getCategoryFromWMOCode(code) {
    if (code === 0 || code === 1 || code === 19){ return 'Clear sky'; }
    else if(code === 2 || code === 3){ return 'Partly cloudy'; }
    else if(code === 4 || code === 5){ return 'Overcast'; }
    else if((code >= 6 && code <= 9) || (code >= 30 && code <= 35)){ return 'Haze'; }
    else if((code >= 10 && code <= 12) || code === 28 || (code >= 40 && code <= 49)){ return 'Fog'; }
    else if(code === 20 || (code >= 50 && code <= 55) || (code >= 58 && code <= 59)){ return 'Drizzle'; }
    else if(code === 21 || code === 24 || (code >= 60 && code <= 65) || (code >= 80 && code <= 82)){ return 'Rain'; }
    else if(code === 22 || code === 23 || code === 56 || code === 57 || code === 66 || code === 67 || code === 68 || code === 69){ return 'Sleet'; }
    else if(code === 25 || code === 26 || (code >= 36 && code <= 39) || (code >= 70 && code <= 79) || (code >= 83 && code <= 88)){ return 'Snow'; }
    else if((code >= 13 && code <= 18) || code === 27 || code === 29 || (code >= 89 && code <= 99)){ return 'Thunderstorm'; }

    return 'Unknown Weather Code';
};

module.exports = {
    getWeatherSuggestions,
    getWeatherData
};