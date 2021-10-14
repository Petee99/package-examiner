const https = require('https')

/*
This is responsible for searching the registry for the given package, optionally you can set which version do you want and which data do you want back.
*/

function getJSON(url, cb){
    https.get(url, (resp) => {
        let data = '';
        let value = '';
        console.log(`statusCode: ${resp.statusCode}`);
        // A chunk of data has been received.
        resp.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            value = JSON.parse(data);
            cb(null, value);
        });

        }).on("error", (err) => {
            console.log("Error: " + err.message);
            cb(err);
    });
}

function getPackage(packageName, packageVersion="", requiredData=""){  
    var registryUrl = "https://registry.npmjs.cf/";
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", registryUrl+packageName+"/"+packageVersion, false ); // false for synchronous request
    
    xmlHttp.onreadystatechange = () => {
        if (xmlHttp.status === 404) {
            alert("There's no such package!");
        }
    };
    
    xmlHttp.send( null );   

    if(requiredData.length>0){
        return JSON.parse(xmlHttp.responseText)[requiredData];
    }else{
        return JSON.parse(xmlHttp.responseText);
    }


    /*
    
    const resPckg = getJSON(registryUrl+packageName+"/"+packageVersion, (err, value) => {
        if (err){
            return console.error(err);
        } 
        else{
            console.log(value);
            return value;
        }
    });
    */
}

export default getPackage;