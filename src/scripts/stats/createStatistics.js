import searchPackages from "../searchPackages"
import { graphDependencies } from "../graphing/graphDependencies"
import makeHistogram from "./makeHistogram";

async function createStats(size, sort, order){
    let packages = await searchPackages(size, sort, order);
    let pkgData = [];
    for(let pkg of packages){
        pkg = [pkg.name,pkg.latest_stable_release_number];
        pkgData.push(await graphDependencies(pkg, "", false));
    }

    var histograms = [];
    let dataDom = document.createElement('div');
    dataDom.id = "histCanvas";
    document.getElementById("container").innerHTML="";
    document.getElementById("container").appendChild(dataDom);

    histograms[0] = document.createElement('h3');
    histograms[0].innerHTML = "Dependency distribution:";
    histograms[1] = document.createElement('canvas');
    histograms[1].id = "depDistHistogram"
    histograms[2] = document.createElement('h3');
    histograms[2].innerHTML = "Graph Depth distribution:";
    histograms[3] = document.createElement('canvas');
    histograms[3].id = "depthHistogram"
    histograms[4] = document.createElement('h3');
    histograms[4].innerHTML = "Average Node Degree distribution:";
    histograms[5] = document.createElement('canvas');
    histograms[5].id = "avgDegHistogram"

    for(let i= 0; i<histograms.length; i++){
        dataDom.appendChild(histograms[i]);
        if(i%2!=0){
            console.log(histograms[i].id)
            setHistogram(histograms[i].id, pkgData);
        }
    }
}

function setHistogram(id, pkgData){
    let label;
    let labArray = [];
    let dataArray = [];
    switch (id) {
        case "depDistHistogram":
            for(let data of pkgData){
                labArray.push(data.name);
                dataArray.push(data.edges.length);
            }
            label="Number of Dependencies"
            break;
        case "depthHistogram":
            for(let data of pkgData){
                labArray.push(data.name);
                dataArray.push(data.getMaxDepth());
            }
            label="Depth"
            break;
        case "avgDegHistogram":
            for(let data of pkgData){
                labArray.push(data.name);
                dataArray.push(data.edges.length/data.nodes.length);
            }
            label="Average Node Degree"
            break;    
        default:
            break;
    }

    makeHistogram(id, dataArray, label, labArray);
}

export default createStats;