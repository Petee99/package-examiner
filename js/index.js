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

function getDependencies(){
    var packageName = document.getElementById("mySelect").value.split(" ");
    var directDependencies = getPackage(packageName[0], packageName[1], "dependencies");

    if (document.contains(document.getElementById("directDepList"))) {
        document.getElementById("directDepList").remove();
    }

    var myDiv = document.getElementById("directDependencies");
    var depList = document.createElement("ul");
    depList.setAttribute("id", "directDepList");
    myDiv.appendChild(depList);

    for(dep in directDependencies){
        var listElement = document.createElement("li");
        listElement.innerHTML = dep;
        depList.appendChild(listElement)
    }
}