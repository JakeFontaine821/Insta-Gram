export async function sendRequest(url, params={}){
    
    // serialize data and set headers
    params.method = params.method ?? 'GET';
    if(params.method === 'POST'){ params.headers = {'Content-Type': 'application/json'}; }
    if(params.body){ params.body = JSON.stringify(params.body) };
    
    let response;
    try{ response = await fetch(url, params); }
    catch(err){ return {success: false, error: err}; }

    let data;
    try{ data = await response.json(); }
    catch(err){ return {success: false, error: err}; }

    return {success: true, data: data};
};