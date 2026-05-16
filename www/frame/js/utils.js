export async function sendRequest(url, params={}){
    
    // serialize data and set headers
    if(params.body){
        params.method = 'POST';
        params.headers = {'Content-Type': 'application/json'};
        params.body = JSON.stringify(params.body);
    }
    else if(params.image && params.metadata){
        params.method = 'POST';

        const formData = new FormData();
        formData.append('imageFile', params.image);
        formData.append('metadata', JSON.stringify(params.metadata));
        delete params.image;

        params.body = formData;
    }
    
    let response;
    try{ response = await fetch(url, params); }
    catch(err){ return {success: false, error: err}; }

    let data;
    try{ data = await response.json(); }
    catch(err){ return {success: false, error: err}; }

    return data;
};