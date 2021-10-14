import getPackage from "./getPackage";
const semver = require('semver')
/*
This function returns an array containing all of the dependencies of a package till the given depth with each entry containing the package's name, version, dependent,
    dependent's version, and depth level, as well as an array containing the package names
*/
export async function getDependenciesTillDepth(pckg, depth){ 
    pckg = {Name: pckg[0], Version: pckg[1]};
    
    var packages = [];
    var dependencies = [];
    var i = 0;

    do{
        if(i==0){ //First level, there probably won't be any duplicate package names
            dependencies = dependencies.concat(await populateDependencies(pckg, i));
            packages.push({Name: pckg.Name.replace('%2f','/'), Version: pckg.Version, Level: i});
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
                        packages.push({Name: pckg.Name.replace('%2f','/'), Version: pckg.Version, Level: dep.Depth}); 
                        
                        if(i+1<=depth || depth==0){ //If the there are no more iterations, don't add new dependencies
                            dependencies = dependencies.concat(await populateDependencies(pckg, i)); 
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
This function returns a subarray for getDependenciesTillDepth() containing the dependencies of a current package, but with the date represented in a more sophisticated way,
    with each entry containing the package's name, version, dependent, dependent's version, and depth level
*/
async function populateDependencies(pckg, depth){
    var dependencies = [];
    var currentDependencies = await getDependencies(pckg);
    if (!currentDependencies){
        return [];
    }
    for(const dep of currentDependencies){ //Populates the dependencies array of the current package, also includes the current depth level
       dependencies.push({
            Name: dep.Name, 
            Version: semver.valid(semver.coerce(dep.Version)), 
            Depth: depth+1, 
            Parent: pckg.Name.replace('%2f', '/'), 
            ParentVersion: pckg.Version
        });
    }
    return dependencies;
}

/*
This function returns all dependencies of the given package, if there's any
*/
async function getDependencies(pckg){   
    pckg.Name = pckg.Name.replace('/', '%2f');
    pckg.Version = semver.valid(semver.coerce(pckg.Version));

    var directDependencies = await getPackage(pckg.Name, pckg.Version, "dependencies");
    var returnDeps = [];

    if(typeof(directDependencies) == "undefined"){
        return false;
    }

    const depVersions = Object.values(directDependencies);
    var vCount = 0;

    for(let dep in directDependencies){
        returnDeps.push({Name: dep, Version: depVersions[vCount]});
        vCount++;
    }
    return returnDeps;
}

