const https = require('https')

/*
This is responsible for searching the registry for the given package, optionally you can set which version do you want and which data do you want back.
*/

async function getPackage(packageName, packageVersion="", requiredData=""){  
    var registryUrl = "https://registry.npmjs.cf/";
    let pkg = await fetchData(registryUrl+packageName+"/"+packageVersion).then((resPKG) => {
        if(requiredData.length>0){
            return resPKG[requiredData];
        }else{
            return resPKG;
        }
    })
    return pkg;
}

async function fetchData(url){
    let response = await fetch(url);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
}

export default getPackage;

/*
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
*/