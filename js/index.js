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

function getPackageData(event){
    event.preventDefault();
    var packageName = document.getElementsByName("pname")[0].value;
    var packageObject = getPackage(packageName);
    populateVersions(packageName, packageObject.versions);
}

function populateVersions(packageName, versions){
    if (document.contains(document.getElementById("mySelect"))) {
        document.getElementById("mySelect").remove();
    }
    var versionArray =[];
    var i = 0;
    var myDiv = document.getElementById("myDiv");
    var selectList = document.createElement("select");
    selectList.setAttribute("id", "mySelect");
    myDiv.appendChild(selectList);

    for(version in versions){
        versionArray[i] = version;
        i++;
    }

    for(i=versionArray.length-1; i>=0; i--){
        var option = document.createElement("option");
        option.setAttribute("value", packageName+" "+versionArray[i]);
        option.text = versionArray[i];
        selectList.appendChild(option);
    }
}

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

function getDependenciesTillDepth(depth=6){
    var package = document.getElementById("mySelect").value.split(" ");
    package = {Name: package[0], Version: package[1]};
    var packages = [];
    var dependencies = [];
    var alrdyExists = false;
    
    for(let i=0; i<depth; i++){

        if(i==0){
            dependencies = dependencies.concat(populateDependencies(package, i));
            packages.push(package.Name.replace('%2f','/'));
        }else{
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
    console.log(dependencies);  
    console.log(packages);
    return dependencies;
}

function populateDependencies(package, depth){
    var dependencies = [];
    var currentDependencies = getDependencies(package);
    var n = 0;
    if (!currentDependencies){
        return [];
    }
    for(const dep of currentDependencies){
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


/*if (document.contains(document.getElementById("directDepList"))) {
        document.getElementById("directDepList").remove();
    }

    var myDiv = document.getElementById("directDependencies");
    var depList = document.createElement("ul");
    depList.setAttribute("id", "directDepList");
    myDiv.appendChild(depList);*/