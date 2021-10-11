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

    drawGraph(packages, dependencies);
}

function drawGraph(packages, dependencies){
    var colors = ['#2e946d','#F0A30A','#2980B9','#A20025','#FFAB91','yellow','blue','pink','#795548','#607D8B'];
    //Creates a new sigma.js instance, and configures it
    var s = new sigma({ 
        container: 'container',
        renderer: {
          container: document.getElementById('container'),
          type: sigma.renderers.canvas,
        },
        settings: {
            defaultEdgeType: "arrow",
            minArrowSize: 5,
            sideMargin: 5,
            defaultNodeColor: '#ccc',
            defaultLabelColor: '#ccc',
        }
    }); 

    // Create graph nodes from packages
    for (let i = 0; i < packages.length; i++) {

        s.graph.addNode({
            // Main attributes:
            id: packages[i].Name,
            label: packages[i].Name,
            // Display attributes:
            y: 0,
            x: 0+packages[i].Level,
            size: 1
        })        
    }
  
    // Create graph edges from dependencies
    for (let i = 0; i < dependencies.length; i++) {
        
        s.graph.addEdge({
            id: 'edge_'+i,
            source: dependencies[i].Parent,
            target: dependencies[i].Name
        });
    }

    // MY Graph layout algorithm for arranging nodes to their proper level
    // Positioning nodes vertically
    var changes = true;
    while(changes){
        changes=false;
        for(let edge of s.graph.edges()) {
            let source;
            let target;
            for(let node of s.graph.nodes()){
                if(edge.source == node.label){
                    source = node;
                }else if(edge.target == node.label){
                    target = node;  
                }  
                if(typeof source == "object" && typeof target == "object"){
                    
                    if(source.x == target.x){
                        target.x+=1;;
                        changes=true;    
                    }
                    else if(target.x<source.x){
                        target.x = source.x+1;
                        changes=true;
                    }
                    edge.color = colors[source.x];                       
                    break;
                }
            }
        }
    }

    // Positioning nodes horizontally
    let nodes = s.graph.nodes().sort((a,b) => (a.x > b.x) ? 1 : ((b.x > a.x) ? -1 : 0))
    let nArray = [];
    for(let i = 0; i<nodes.length; i++){
        
        if(i<nodes.length-1 && nodes[i].x == nodes[i+1].x){
            nArray.push(nodes[i]);
        }else if(nArray.length>0){
            nArray.push(nodes[i]);
            let offset;
            if(nArray[0].x%2==0){
                offset = 2/nArray.length;
            }else{
                offset = 3/nArray.length;
            }
            
            for(let j=0; j<nArray.length; j++){
                if(j==0){
                    nArray[j].y = Math.random() * (0.5 - -0.5) -0.5;
                }else{
                    if(j%2 == 0){
                        nArray[j].y = nArray[j-2].y+offset;
                    }else{
                        if(j==1){
                            nArray[j].y = nArray[j-1].y-offset;
                        }else{
                            nArray[j].y = nArray[j-2].y-offset;
                        }
                    }  
                }             
            }
            nArray=[];
        }    
    }

    s.refresh();
    analyseGraph(nodes, s.graph.edges());
}


function analyseGraph(nodes, edges){
    var graphData = [];
    var nodeDegrees = getNodeDegrees(nodes,edges);
    var linksPerDepth = getLinksPerDepth(nodes, edges);

    dataDom = document.getElementById("graphData");
    listElement = document.createElement('ul');

    if(dataDom.innerHTML!=""){
        dataDom.innerHTML=""
    }

    graphData[0] = document.createElement('h3');
    graphData[0].innerHTML = "Number of nodes: <b nowrap>"+nodes.length+"</b>";
    graphData[1] = document.createElement('h3');
    graphData[1].innerHTML = "Number of links: <b nowrap>"+edges.length+"</b>";
    graphData[2] = document.createElement('h3');
    graphData[2].innerHTML = "Depth of graph: <b nowrap>"+getMaxDepth(nodes)+"</b>";
    graphData[3] = document.createElement('h3');
    graphData[3].innerHTML = "Dependency distribution:";
    graphData[4] = document.createElement('canvas');
    graphData[4].id = "depDistHistogram"
    graphData[5] = document.createElement('h3');
    graphData[5].innerHTML = "Graph Node Degrees (Incoming and Outgoing):";
    graphData[6] = document.createElement('canvas');
    graphData[6].id = "nodeDegHistogramIn"
    graphData[7] = document.createElement('canvas');
    graphData[7].id = "nodeDegHistogramOut"

    for(let i= 0; i<graphData.length; i++){
        dataDom.appendChild(graphData[i]);
    }

    makeGraphDataHistogram("depDistHistogram",linksPerDepth);
    makeGraphDataHistogram("nodeDegHistogramIn",nodeDegrees);
    makeGraphDataHistogram("nodeDegHistogramOut",nodeDegrees);
}

function getMaxDepth(nodes){
    let maxDepth=0;
    for(let node of nodes){
        if(node.x>maxDepth){
            maxDepth = node.x;
        }
    }
    return maxDepth;
}

function getLinksPerDepth(nodes, edges){
    let array = [];

    for(let edge of edges) {
        for(let node of nodes){
            if(edge.target==node.label){
                if(isNaN(array[node.x])){
                    array[node.x] = 1;
                }
                else{
                    array[node.x]++;
                }
                
            }   
        }
    }
    return array;
}

function getNodeDegrees(nodes, edges){
    let array = [];

    for(let i = 0; i<nodes.length; i++){
        for(let edge of edges) {
            if(array[i]==undefined){
                array[i] = {Name: nodes[i].label, In: 0, Out:0};
            }            
            if(edge.target==nodes[i].label){
                array[i].In++;
            }
            if(edge.source==nodes[i].label){
                array[i].Out++;
            }   
        }
    }
    return array;
}

function makeGraphDataHistogram(id, inputArray){
    const ctx = document.getElementById(id).getContext('2d');
    let labArray = [];
    let dataArray = [];
    var label;
    
    switch (id) {
        case "depDistHistogram":
            console.log(inputArray);
            for(let i=1; i<inputArray.length; i++){
                labArray.push(i);
                dataArray.push(inputArray[i]);
            }
            label="Number of Dependencies"
            break;
        case "nodeDegHistogramIn":
            for(let data of inputArray){
                labArray.push(data.Name);
                dataArray.push(data.In);
            }
            label="Number of Incoming Edges"
            break;
        case "nodeDegHistogramOut":
            for(let data of inputArray){
                labArray.push(data.Name);
                dataArray.push(data.Out);
            }
            label="Number of Outgoing Edges"
            break;    
        default:
            break;
    }

    const chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: labArray,
        datasets: [{
        label: label,
        data: dataArray,
        backgroundColor: '#2e946d',
        }]
    },
    options: {
        scales: {
        xAxes: [{
            display: false,
            barPercentage: 1.3,
            ticks: {
            max: 3,
            }
        }, {
            display: true,
            ticks: {
            autoSkip: false,
            max: 4,
            }
        }],
        yAxes: [{
            ticks: {
            beginAtZero: true,
            max: 2,
            }
        }]
        }
    }
    });
}
