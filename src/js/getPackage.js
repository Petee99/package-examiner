const https = require('https');
const semver = require('semver')
const registryUrl = "https://registry.npmjs.cf/";
/*
This is responsible for searching the registry for the given package, optionally you can set which version do you want and which data do you want back.
*/

async function getPackage(packageName, packageVersion="", requiredData=""){  
    if(packageVersion!=""){
        let strArray = packageVersion.split('.');
        
        if(strArray.length!=3 || isNaN(strArray[0]) || isNaN(strArray[1]) || isNaN(strArray[2])){
            packageVersion = await findMaxSatisfying(packageName, packageVersion);
        }
    }
    
    let pkg = await fetchData(registryUrl+packageName+"/"+packageVersion)
    .then((resPKG) => {
        console.log(resPKG);
        if(requiredData.length>0){
            return resPKG[requiredData];
        }else{
            return resPKG;
        }
    })

    return pkg;
}


async function findMaxSatisfying(packageName, range){
    let pkg = await fetchData(registryUrl+packageName);
    let versions = [];

    for(let version in pkg.versions){
        versions.push(version);
    }

    let max = semver.maxSatisfying(versions, range);
    return max;
}

async function fetchData(url){
    let response = await fetch(url);

    if (!response.ok) {
        throw new Error(response.status);
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