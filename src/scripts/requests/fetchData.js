const crypto = require('crypto');
const aToken = {iv: 'f5b6e325361358db71d1a35319277946', content: '3c6ffb13bfff3e4de26f5d6a499f1bbe7191a2177e882b522e449df7d255984f6ec5e0a80ee5867f'};

/*
 * Fetches data from different APIs.
 * @param {string} url - The function makes a get request using this url
 * @param {boolean} token - If true an authorization token will be used in the request header
 * @returns {json} response - JSON object containing the information from the reponse
 * */
async function fetchData(url, token=false){
    let headers = {"Content-Type": "application/json"};

    if(token){
        headers["Authorization"] = "token "+getToken();
    }
    
    let response = await fetch(url, {headers,});

    if (!response.ok) {
        throw new Error(response.status);
    }
    
    return response.json();
}

/*
 * Decrypts auth token. This token is only good for letting the program make 5000 request an hour, no other priviliges set.
 * @returns {string} decrypted.toString() - Decrypted auth token string
 * */
function getToken(){
    const decipher = crypto.createDecipheriv('aes-256-ctr', 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3', Buffer.from(aToken.iv, 'hex'));
    const decrypted = Buffer.concat([decipher.update(Buffer.from(aToken.content, 'hex')), decipher.final()]);

    return decrypted.toString();
}
export default fetchData;