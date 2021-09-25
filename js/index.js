/*
This function is responsible for searching the registry for the given package, optionally you can set which version do you want and which data do you want back.
*/
function getPackage(packageName, packageVersion="", requiredData=""){  
    var registryUrl = "https://registry.npmjs.cf/";
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", registryUrl+packageName+"/"+packageVersion, false ); // false for synchronous request
    xmlHttp.send( null );
    if(requiredData.length>0){
        return JSON.parse(xmlHttp.responseText)[requiredData];
    }else{
        return JSON.parse(xmlHttp.responseText);
    }   
}

/*
This function handles the package search form, once it is called with a proper package name, it will populate a dropdown list on the page.
*/
function getPackageData(event){
    event.preventDefault();
    var packageName = document.getElementsByName("pname")[0].value;
    var packageObject = getPackage(packageName);
    populateVersions(packageName, packageObject.versions);
}

/*
This function populates the dropdown list on the site with the versions of the given package
*/
function populateVersions(packageName, versions){ 
    if (document.contains(document.getElementById("mySelect"))) { //Checks if the list already exists, destroys it if it does
        document.getElementById("mySelect").remove();
    }
    var versionArray =[];
    var i = 0;
    var myDiv = document.getElementById("myDiv");
    var selectList = document.createElement("select");
    selectList.setAttribute("id", "mySelect");
    myDiv.appendChild(selectList);

    for(version in versions){ //Populates the version array
        versionArray[i] = version;
        i++;
    }

    for(i=versionArray.length-1; i>=0; i--){ //Since the versions we got back are in ascending order, the program iterates through the array from bottom to top
        var option = document.createElement("option");
        option.setAttribute("value", packageName+" "+versionArray[i]);
        option.text = versionArray[i];
        selectList.appendChild(option);
    }
}

/*
This function returns all dependencies of the given package, if there's any
*/
function getDependencies(package){   
    package.Name = package.Name.replace('/', '%2f');
    package.Version = package.Version.replace('^', '');
    var directDependencies = getPackage(package.Name, package.Version, "dependencies");
    var returnDeps = [];

    if(typeof(directDependencies) == "undefined"){
        return false;
    }

    const depVersions = Object.values(directDependencies);
    var vCount = 0;

    for(dep in directDependencies){
        returnDeps.push({Name: dep, Version: depVersions[vCount]});
        vCount++;
    }

    return returnDeps;
}

/*
This function returns an array containing all of the dependencies of a package till the given depth with each entry containing the package's name, version, dependent,
    dependent's version, and depth level
*/
function getDependenciesTillDepth(package, depth){ 
    package = {Name: package[0], Version: package[1]};
    
    var packages = [];
    var dependencies = [];
    var alrdyExists = false;
    var i = 0; 

    while(1){
        if(depth=='' && i>=1 && dependencies[i]==dependencies[i-1] || i==depth-1){ //Breaks the loop when there're no unknown dependencies left or if it reaches the given depth level
            break;
        }
        else{
            if(i==0){ //First level, there probably won't be any duplicate package names
                dependencies = dependencies.concat(populateDependencies(package, i));
                packages.push(package.Name.replace('%2f','/'));
            }else{ //The rest of the levels. The function checks for duplicate packagenames, so it won't search for dependencies of a package, when it's already been done
                for(const dep of dependencies){
                    
                    if(dep.Depth == i-1){
                        for(const pckg of packages){
                            if(dep.Name == pckg){
                                alrdyExists = true;
                                break;
                            }
                        }
                        if(!alrdyExists){
                            package = {Name: dep.Name, Version: dep.Version};
                            dependencies = dependencies.concat(populateDependencies(package, i));
                            packages.push(package.Name.replace('%2f','/'));
                        }else{
                            alrdyExists = false;
                        }
                    }
                }
            }
        }
        i++;
    }

    return dependencies;
}

/*
This function returns a subarray for getDependenciesTillDepth() containing the dependencies of a current package, but with the date represented in a more sophisticated way,
    with each entry containing the package's name, version, dependent, dependent's version, and depth level
*/
function populateDependencies(package, depth){
    var dependencies = [];
    var currentDependencies = getDependencies(package);
    var n = 0;
    if (!currentDependencies){
        return [];
    }
    for(const dep of currentDependencies){ //Populates the dependencies array of the current package, also includes the current depth level
        dependencies.push({
            Name: dep.Name, 
            Version: dep.Version.replace('^',''), 
            Depth: depth, 
            Parent: package.Name.replace('%2f', '/'), 
            ParentVersion: package.Version
        });
        n++;
    }
    return dependencies;
}

/*
This function handles the form responsible for getting the dependencies of a package, with the correct version and ceratin depth selected
*/
function populateDepList(event){
    event.preventDefault();
    var dDepth = document.getElementsByName("ddepth")[0].value;
    var package = document.getElementById("mySelect").value.split(" ");

    var dependencies = getDependenciesTillDepth(package, dDepth);
    console.log(dependencies);

    if (document.contains(document.getElementById("directDepList"))) {
        document.getElementById("directDepList").remove();
    }

}