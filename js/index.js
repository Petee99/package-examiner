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
        if(depth==='' && i>=1 && dependencies[i]==dependencies[i-1] || depth!=0 && i==depth){ //Breaks the loop when there're no unknown dependencies left or if it reaches the given depth level
            break;
        }
        else{
            if(i==0){ //First level, there probably won't be any duplicate package names
                dependencies = dependencies.concat(populateDependencies(package, i));
                packages.push({Name: package.Name.replace('%2f','/'), Version: package.Version, Level: i});
            }else{ //The rest of the levels. The function checks for duplicate packagenames, so it won't search for dependencies of a package, when it's already been done
              
                for(const dep of dependencies){
                    
                    if(dep.Depth == i){
                        
                        for(const pckg of packages){
                            if(dep.Name == pckg.Name){
                                alrdyExists = true;
                                break;
                            }
                        }
                        if(!alrdyExists){
                            package = {Name: dep.Name, Version: dep.Version};
                            dependencies = dependencies.concat(populateDependencies(package, i));
                            packages.push({Name: package.Name.replace('%2f','/'), Version: package.Version, Level: dep.Depth});
                            
                        }else{
                            alrdyExists = false;
                        }
                    }
                }
            }
        }
        i++;
    }
    for(const dep of dependencies){
        for(const pckg of packages){
            if(dep.Name == pckg.Name){
                alrdyExists = true;
                break;
            }
        }
        if(!alrdyExists){
            packages.push({Name: dep.Name.replace('%2f','/'), Version: dep.Version, Level: dep.Depth});
        }else{
            alrdyExists = false;
        }
    }
    dependencies.push(packages);
    console.log(dependencies);
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
            Depth: depth+1, 
            Parent: package.Name.replace('%2f', '/'), 
            ParentVersion: package.Version
        });
        n++;
    }
    return dependencies;
}

/*
This function handles the form responsible for getting and graphing the dependencies of a package, with the correct version and ceratin depth selected
*/
function drawDepGraph(event){
    event.preventDefault();
    var dDepth = document.getElementsByName("ddepth")[0].value;
    var package = document.getElementById("mySelect").value.split(" ");

    var dependencies = getDependenciesTillDepth(package, dDepth);
    var packages = dependencies[dependencies.length-1];
    document.getElementById("dTitle").innerHTML=package[0];
    dependencies.pop(dependencies[dependencies.length-1]);

    console.log(packages);

    if(document.getElementById("container").innerHTML != ""){
        document.getElementById("container").innerHTML = "";
    }

    var s = new sigma({ 
        container: 'container',
        renderer: {
          container: document.getElementById('container'),
          type: sigma.renderers.canvas,
        },
        settings: {
            defaultEdgeType: "arrow",
            minArrowSize: 10,
            defaultLabelColor: '#ccc'
        }
    });  

    var n = 0;
    var offset = 0;

    for (let i = 0; i < packages.length; i++) {
        if(i>0 &&packages[i].Level != packages[i-1].Level){
            offset = 0;
        }
        
        s.graph.addNode({
            // Main attributes:
            id: packages[i].Name,
            label: packages[i].Name,
            // Display attributes:
            x: 0+offset,
            y: 0+packages[i].Level/2,
            size: 1,
            color: '#2e946d'
        })
        offset+=0.1;
    }

    dependencies.forEach(dep => {
        s.graph.addEdge({
            id: 'edge_'+n,
            // Reference extremities:
            source: dep.Parent,
            target: dep.Name,
            color: '#ccc'
        });
        n++;
    });

    s.startForceAtlas2();
}