import getPackage from "./requests/getPackage";

/*
 * Gets dependencies for a given package, with the individual package names as their last entry.
 * @param {Array} pckg - Array containing the package name and version
 * @param {number} depth - The given search depth
 * @returns {Array} - Array containing all dependencies and the individual package name
 * */
async function getDependenciesTillDepth(pckg, depth){ 
    pckg = {Name: pckg[0], Version: pckg[1]};
    
    var packages = [];
    var dependencies = [];
    var pkgData;
    var i = 0;

    do{
        if(i==0){ //First level, there probably won't be any duplicate package names
            pkgData =  await getData(pckg, i);
            dependencies = dependencies.concat(pkgData.Dependencies);
            packages.push({Name: pckg.Name.replace('%2f','/'), Version: pckg.Version, Level: i,  Keywords: pkgData.Keywords});
        }
        else{ //The rest of the levels. The function checks for duplicate packagenames, so it won't search for dependencies of a package, when it's already been done             
            for(const dep of dependencies){  
                var alrdyExists = false;
                if(dep.Depth == i){
                    for(const pckg of packages){
                        if(dep.Name == pckg.Name){
                            alrdyExists = true;
                            break;
                        }
                    }
                    if(!alrdyExists){
                        pckg = {Name: dep.Name, Version: dep.Version};
                        pkgData =  await getData(pckg, i);                        
                        packages.push({Name: pckg.Name.replace('%2f','/'), Version: pckg.Version, Level: dep.Depth,  Keywords: pkgData.Keywords}); 
                        
                        if(i+1<=depth || depth==0){ //If the there are no more iterations, don't add new dependencies
                            dependencies = dependencies.concat(pkgData.Dependencies);
                        }   
                    }
                }
            }
        }
        i++;
    }while(depth==0 && dependencies[i]!==dependencies[i-1] || depth!=0 && i<=depth); //The loop will stop if it reaches the given depth level or there are no more dependencies
    dependencies.push(packages);
    return dependencies;
}

/*
 * Returns all keywords and dependencies of the given package, if there's any.
 * @param {Object} pckg - The package object
 * @param {number} depth - The current search depth
 * @returns {Object} - Object containing all keywords and dependencies
 * */
async function getData(pckg, depth){   
    pckg.Name = pckg.Name.replace('/', '%2f');
    pckg.Version = pckg.Version;

    var pkgData = await getPackage(pckg.Name, pckg.Version);
    var returnDeps = [];

    if(typeof(pkgData.dependencies) != "undefined"){
        const depVersions = Object.values(pkgData.dependencies);
        var vCount = 0;

        for(let dep in pkgData.dependencies){
            returnDeps.push({
                Name: dep, 
                Version: depVersions[vCount],
                Depth: depth+1, 
                Parent: pckg.Name.replace('%2f', '/'), 
                ParentVersion: pckg.Version
            });
            vCount++;
        }
    }
    
    return {Keywords: pkgData.keywords, Dependencies: returnDeps};
}

export default getDependenciesTillDepth;