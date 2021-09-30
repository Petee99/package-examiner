/*
This function is responsible for searching the registry for the given package, optionally you can set which version do you want and which data do you want back.
*/
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
}

/*
This function handles the package search form, once it is called with a proper package name, it will populate a dropdown list on the page.
*/
function getPackageData(event){
    event.preventDefault();
    var packageName = document.getElementsByName("pname")[0].value;
    var packageObject = getPackage(packageName);
    populateVersionDOM(packageName, packageObject.versions);
}

/*
This function populates the dropdown list on the site with the versions of the given package
*/
function populateVersionDOM(packageName, versions){ 
    
    var versionArray =[];
    var i = 0;

    var selectList = document.getElementById("versionSelect");
    selectList.innerHTML="";

    for(version in versions){ //Populates the version array
        versionArray[i] = version;
        i++;
    }

    //Since the versions we got back are in ascending order, the program iterates through the array from bottom to top and appends it to the DOM
    for(i=versionArray.length-1; i>=0; i--){ 
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
    package.Version = package.Version.replace('^','').replace('~','');
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
    var i = 0;

    do{
        if(i==0){ //First level, there probably won't be any duplicate package names
            dependencies = dependencies.concat(populateDependencies(package, i));
            packages.push({Name: package.Name.replace('%2f','/'), Version: package.Version, Level: i});
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
                        package = {Name: dep.Name, Version: dep.Version};                        
                        packages.push({Name: package.Name.replace('%2f','/'), Version: package.Version, Level: dep.Depth}); 
                        
                        if(i+1<=depth || depth==0){ //If the there are no more iterations, don't add new dependencies
                            dependencies = dependencies.concat(populateDependencies(package, i)); 
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
function populateDependencies(package, depth){
    var dependencies = [];
    console.log(package);
    var currentDependencies = getDependencies(package);
    if (!currentDependencies){
        return [];
    }
    for(const dep of currentDependencies){ //Populates the dependencies array of the current package, also includes the current depth level
        dependencies.push({
            Name: dep.Name, 
            Version: dep.Version.replace('^','').replace('~',''), 
            Depth: depth+1, 
            Parent: package.Name.replace('%2f', '/'), 
            ParentVersion: package.Version
        });
    }
    return dependencies;
}

/*
This function handles the form responsible for getting and graphing the dependencies of a package, with the correct version and ceratin depth selected
*/
function drawDepGraph(event){
    event.preventDefault();
    var dDepth = document.getElementsByName("ddepth")[0].value;
    var package = document.getElementById("versionSelect").value.split(" ");

    var dependencies = getDependenciesTillDepth(package, dDepth);
    var packages = dependencies[dependencies.length-1];
    document.getElementById("dTitle").innerHTML=package[0];
    dependencies.pop(dependencies[dependencies.length-1]);

    if(document.getElementById("container").innerHTML != ""){
        document.getElementById("container").innerHTML = "";
    }

    console.log(dependencies);

    //Creates a new sigma.js instance, and configures it
    var s = new sigma({ 
        container: 'container',
        renderer: {
          container: document.getElementById('container'),
          type: sigma.renderers.canvas,
        },
        settings: {
            defaultEdgeType: "arrow",
            minArrowSize: 10,
            sideMargin: 5,
            defaultLabelColor: '#ccc',
            defaultNodeColor: '#2e946d',
        }
    });  

    // Create graph nodes from packages
    for (let i = 0; i < packages.length; i++) {
        s.graph.addNode({
            id: packages[i].Name,
            label: packages[i].Name,
            x: Math.random(),
            y: Math.random(),
            size: 1
        })
    }

    // Create graph edges from dependencies
    var n = 0;
    dependencies.forEach(dep => {
        s.graph.addEdge({
            id: 'edge_'+n,
            source: dep.Parent,
            target: dep.Name,
            color: '#ccc'
        });
        n++;
    });
    
    // Starts the algorithm, and kills it once it's drawn, to save resources:
    s.startForceAtlas2();
    window.setTimeout(function() {s.killForceAtlas2()}, 100);

    /*
        Következő lépés:

        A függőségi gráf komplexitására kellene mondani valamit. 
        Lehet nézni például: 
            függőségek számára vonatkozóan eloszlást, 
            gráf mélységét, 
            mennyire fáról vagy hálóról van szó.

    */

}