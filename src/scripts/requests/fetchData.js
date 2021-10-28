const aToken = "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";

async function fetchData(url, token=false){
    let headers = {"Content-Type": "application/json"};

    if(token){
        headers["Authorization"] = "token "+aToken;
    }
    
    let response = await fetch(url, {headers,});

    if (!response.ok) {
        throw new Error(response.status);
    }
    
    return response.json();
}

export default fetchData;