import searchPackages from "../requests/searchPackages"
import graphDependencies from "../graphing/graphDependencies"
import setHistogram from "./makeHistogram";
import analyseSource from "./analyseSource";

/*
 * Handles the statistical analysis of the given number of packages.
 * @param {number} size - Number of packages to return
 * @param {string} sortBy - Sort packages in the registry by this
 * */
async function createStats(size, order){
    let packages = await searchPackages(size, order);
    let pkgData = [];
    let n = 0;

    for(let pkg of packages){
        pkg = [pkg.name,pkg.latest_stable_release_number];
        pkgData.push(await graphDependencies(pkg, "", false));
        packages[n]['dependencies'] = pkgData[n].edges.length;
        n++;
    }

    packages.sort((a, b) => (a.dependencies < b.dependencies) ? 1 : -1);
    pkgData.sort((a, b) => (a.edges.length < b.edges.length) ? 1 : -1);
    pkgData = {Graphs: pkgData, Files: await analyseSource(packages)};

    var histograms = [];
    let dataDom = document.createElement('div');
    dataDom.id = "histCanvas";
    document.getElementById("container").innerHTML="";
    document.getElementById("showReq").innerHTML ="";
    document.getElementById("container").appendChild(dataDom);

    histograms[0] = document.createElement('h3');
    histograms[0].innerHTML = "Dependency distribution:";
    histograms[1] = document.createElement('canvas');
    histograms[1].id = "depDistStatHistogram"
    histograms[2] = document.createElement('h3');
    histograms[2].innerHTML = "Graph Depth distribution:";
    histograms[3] = document.createElement('canvas');
    histograms[3].id = "depthHistogram"
    histograms[4] = document.createElement('h3');
    histograms[4].innerHTML = "Average Node Degree distribution:";
    histograms[5] = document.createElement('canvas');
    histograms[5].id = "avgDegHistogram"

    histograms[6] = document.createElement('h3');
    histograms[6].innerHTML = "Size of Packages (in MB)";
    histograms[7] = document.createElement('canvas');
    histograms[7].id = "pkgSize"
    histograms[8] = document.createElement('h3');
    histograms[8].innerHTML = "Number of Files per Package:";
    histograms[9] = document.createElement('canvas');
    histograms[9].id = "pkgFiles"
    histograms[10] = document.createElement('h3');
    histograms[10].innerHTML = "JavaScript File Ratio (in %):";
    histograms[11] = document.createElement('canvas');
    histograms[11].id = "jsFiles"
    histograms[12] = document.createElement('h3');
    histograms[12].innerHTML = "TypeScript File Ratio (in %):";
    histograms[13] = document.createElement('canvas');
    histograms[13].id = "tsFiles"

    for(let i= 0; i<histograms.length; i++){
        dataDom.appendChild(histograms[i]);
        if(i%2!=0){
            console.log(histograms[i].id)
            setHistogram(histograms[i].id, pkgData);
        }
    }
}

export default createStats;