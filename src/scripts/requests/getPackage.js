import fetchData from "./fetchData"
const semver = require('semver')
const registryUrl = "https://registry.npmjs.cf/";

/*
 * Gets data of a package from npm's registry using semantic versioning rules.
 * @param {string} packageName - Package's name
 * @param {string} packageVersion - Package's version, it isn't set by default
 * @param {string} requiredData - If set, this specific data will be returned
 * @returns {Object} pkg - Object containing the fetch response data
 * */
async function getPackage(packageName, packageVersion="", requiredData=""){  
    if(packageVersion!=""){
        let strArray = packageVersion.split('.');

        if(strArray.length!=3 || isNaN(strArray[0]) || isNaN(strArray[1]) || isNaN(strArray[2])){
            packageVersion = await findMaxSatisfying(packageName, packageVersion);
        }
    }    
    document.getElementById("showReq").innerHTML = "<b style=\"color:#2e946d\">Currently fetching:</b><br>"+packageName.replace("%2f","/")+" @ "+packageVersion+"'s npm data"

    let pkg = await fetchData(registryUrl+packageName+"/"+packageVersion)
    .then((resPKG) => {
        if(requiredData.length>0){
            return resPKG[requiredData];
        }else{
            return resPKG;
        }
    })
    .catch((error) => {
        console.error(error);
        return error;
    });

    return pkg;
}

/*
 * Find the highest possbile version number that satisfies the given range.
 * @param {string} packageName - Package's name
 * @param {string} range - Required version range
 * @returns {string} max - The version number that satisfies the criteria
 * */
async function findMaxSatisfying(packageName, range){
    let pkg = await fetchData(registryUrl+packageName);
    let versions = [];

    for(let version in pkg.versions){
        versions.push(version);
    }
    let max = semver.maxSatisfying(versions, range);
    return max;
}

export default getPackage;
