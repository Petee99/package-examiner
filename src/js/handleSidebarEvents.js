import getPackage from "./getPackage";
import { graphDependencies } from "./graphing/graphDependencies";

export function submitForm(form){
    switch (form) {
        case "packageForm":
            getPackageData();
            break;
        case "graphingForm":
            makeGraph();
            break;
        default:
            break;
    }
}

/*
This function handles the package search form, once it is called with a proper package name, it will populate a dropdown list on the page.
*/
function getPackageData(){
    var packageName = document.getElementsByName("pname")[0].value;
    var packageObject = getPackage(packageName);
    console.log(packageObject);
    populateVersionDOM(packageName, packageObject.versions);
}

/*
This function handles the form responsible for getting and graphing the dependencies of a package, with the correct version and certain depth selected
*/
function makeGraph(){
    var dDepth = document.getElementsByName("ddepth")[0].value;
    var pckg = document.getElementById("versionSelect").value.split(" ");
    document.getElementById("dTitle").innerHTML=pckg[0];

    if(document.getElementById("container").innerHTML != ""){
        document.getElementById("container").innerHTML = "";
    }

    graphDependencies(pckg, dDepth);
}

/*
This function populates the dropdown list on the site with the versions of the given package
*/
function populateVersionDOM(packageName, versions){ 

    var versionArray =[];
    var i = 0;
    var selectList = document.getElementById("versionSelect");
    selectList.innerHTML="";

    for(let version in versions){ //Populates the version array
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