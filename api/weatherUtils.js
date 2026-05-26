async function getWeatherSuggestions(query){
    const apiKey = '71f92ea9dd2f4790b92ea9dd2f779061';
    const url = `https://api.weather.com/v3/location/search?query=${query}&language=en-US&format=json&apiKey=${apiKey}&locationType=city%2Clocality%2Cneighborhood%2Cpostal`;
    const params = {
        'headers': {
            'accept': '*/*',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9',
            'origin': 'https://weather.com',
            'priority': 'u=1, i',
            'referer': 'https://weather.com/',
            'sec-ch-ua': '"Chromium";v="148", "Google Chrome";v="148", "Not/A)Brand";v="99"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-site',
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36'
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