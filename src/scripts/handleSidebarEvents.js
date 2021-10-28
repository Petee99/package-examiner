import getPackage from "./requests/getPackage";
import createStats from "./stats/createStatistics";
import graphDependencies from "./graphing/graphDependencies";

function submitForm(form){
    switch (form) {
        case "packageForm":
            getPackageData();
            break;
        case "graphingForm":
            makeGraph();
            break;
        case "statForm":
            makeStat();
            break;
        default:
            break;
    }
}

/*
    This function handles the package search form, once it is called with a proper package name, it will populate a dropdown list on the page.
*/
async function getPackageData(){
    document.getElementById("pklabel").innerHTML="Package Version:";
    let packageName = document.getElementsByName("pname")[0].value;
    let packageObject = await getPackage(packageName);

    if(packageObject.name != "Error"){
        populateVersionDOM(packageName, packageObject.versions);
    }
    else{
        alert("There's no such package.")
    }
    document.getElementById("showReq").innerHTML ="";
}

/*
    This function is responsible for getting a statistical analysis of many packages data, then presenting it with histograms.
*/
function makeStat(){
    if(document.getElementById("pQuantity").value>0){
        document.getElementById("container").innerHTML = `<div class="loader"></div>`;

        let size = document.getElementById("pQuantity").value;
        let sort = document.getElementById("pSort").value;

        createStats(size, sort);
    }else{
        alert("Choose a number first!");
    }
}


/*
This function handles the form responsible for getting and graphing the dependencies of a package, with the correct version and certain depth selected
*/
function makeGraph(){
    var dDepth = document.getElementsByName("ddepth")[0].value;
    var pckg = document.getElementById("versionSelect").value.split(" ");

    if(pckg[0]!=""){
        document.getElementById("dTitle").innerHTML=pckg[0];

        document.getElementById("container").innerHTML = `<div class="loader"></div>`;
        document.getElementById("graphData").innerHTML = `<div class="loader"></div>`;

        graphDependencies(pckg, dDepth);
    }
    else{
        alert("Please select a valid package!")
    }
}

/*
    This function populates the dropdown list on the site with the versions of the given package
*/
function populateVersionDOM(packageName, versions){ 

    let versionArray =[];
    let i = 0;
    let selectList = document.getElementById("versionSelect");
    selectList.innerHTML="";

    for(let version in versions){ //Populates the version array
        versionArray[i] = version;
        i++;
    }

    //Since the versions we got back are in ascending order, the program iterates through the array from bottom to top and appends it to the DOM
    for(i=versionArray.length-1; i>=0; i--){ 
        let option = document.createElement("option");
        option.setAttribute("value", packageName+" "+versionArray[i]);
        option.text = versionArray[i];
        selectList.appendChild(option);
    }
    document.getElementById("pklabel").innerHTML="<nobr><b style=\"color:#2e946d\">"+packageName+"</b> Version:</nobr>"
}

export default submitForm;