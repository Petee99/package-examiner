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
        document.getElementById("progress").innerHTML=n+" / "+packages.length+" graph(s) done.";
        pkg = [pkg.name,pkg.latest_stable_release_number];
        pkgData.push(await graphDependencies(pkg, "", false));
        packages[n]['dependencies'] = pkgData[n].edges.length;
        n++;
    }

    packages.sort((a, b) => (a.dependencies < b.dependencies) ? 1 : -1);
    pkgData.sort((a, b) => (a.edges.length < b.edges.length) ? 1 : -1);
    pkgData = {Graphs: pkgData, Files: await analyseSource(packages)};
    let histogramData = analyseHistograms(pkgData);

    var histograms = [];
    var histogramStats = [];
    let dataDom = document.createElement('div');
    let histogramDataDom = document.createElement('div');
    dataDom.id = "histCanvas";
    document.getElementById("container").innerHTML="";
    document.getElementById("showReq").innerHTML ="";
    document.getElementById("progress").innerHTML="";
    document.getElementById("container").appendChild(dataDom);
    document.getElementById("progress").appendChild(histogramDataDom);

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
            setHistogram(histograms[i].id, pkgData);
        }
        else{
            histogramStats.push("<h3>"+histograms[i].innerHTML+"</h3>");
        }
    }

    let hgIndex = 0;
    Object.keys(histogramData.Averages).forEach(function(key){ 
        histogramStats[hgIndex] += "Average: "+histogramData.Averages[key];
        hgIndex++;
    });

    hgIndex = 0;
    Object.keys(histogramData.StandardDeviations).forEach(function(key){ 
        histogramStats[hgIndex] += "<br>Standard Deviation: "+histogramData.StandardDeviations[key];
        hgIndex++;
    });

    for(let entry of histogramStats){
        histogramDataDom.innerHTML += entry;
    }
}

/*
 * Calculates Means and Standard Deviations from Histogram data
 * @param {Object} data - Object containing package data
 * @returns{Object} - Object containing the averages and standard deviations
 * */
function analyseHistograms(data){
    
    let averages = {
        AvgDependencies : 0,
        AvgDepth : 0,
        AvgNodeDegree : 0,
        AvgSize : 0,
        AvgFileNum : 0,
        AvgJsRatio : 0,
        AvgTsRatio : 0
    };

    let sDeviations = {
        DependenciesDeviation : 0,
        DepthDeviation : 0,
        NodeDegreeDeviation : 0,
        SizeDeviation : 0,
        FileNumDeviation : 0,
        JsRatioDeviation : 0,
        TsRatioDeviation : 0
    };
    // Calculate Means
    for(let index = 0; index < data.Graphs.length; index++){

        if(isNaN(data.Files[index].Size)){
            console.log("isnan: "+data.Files[index].Size)
        }

        averages.AvgDependencies += data.Graphs[index].edges.length;
        averages.AvgDepth += data.Graphs[index].getMaxDepth();
        averages.AvgNodeDegree += data.Graphs[index].edges.length / data.Graphs[index].nodes.length;
        averages.AvgSize += parseFloat(data.Files[index].Size);
        averages.AvgFileNum += data.Files[index].Files;
        if(data.Files[index].Files > 0){
            averages.AvgJsRatio += data.Files[index].JS_Files / data.Files[index].Files;
            averages.AvgTsRatio += data.Files[index].TS_Files / data.Files[index].Files;
        }
    
        if(index == data.Graphs.length-1){
            averages.AvgDependencies = averages.AvgDependencies / data.Graphs.length; 
            averages.AvgDepth = averages.AvgDepth / data.Graphs.length; 
            averages.AvgNodeDegree = averages.AvgNodeDegree / data.Graphs.length;
            averages.AvgSize = averages.AvgSize / data.Graphs.length;
            averages.AvgFileNum = averages.AvgFileNum / data.Graphs.length;
            averages.AvgJsRatio = averages.AvgJsRatio / data.Graphs.length * 100;
            averages.AvgTsRatio = averages.AvgTsRatio / data.Graphs.length * 100;
        }
    }
    // Calculate Standard Deviatons
    for(let index = 0; index < data.Graphs.length; index++){
        sDeviations.DependenciesDeviation += Math.pow(data.Graphs[index].edges.length - averages.AvgDependencies, 2);
        sDeviations.DepthDeviation += Math.pow(data.Graphs[index].getMaxDepth() - averages.AvgDepth, 2);
        sDeviations.NodeDegreeDeviation += Math.pow(data.Graphs[index].edges.length / data.Graphs[index].nodes.length 
            - averages.AvgNodeDegree, 2);
        sDeviations.SizeDeviation += Math.pow(data.Files[index].Size - averages.AvgSize, 2);
        sDeviations.FileNumDeviation += Math.pow(data.Files[index].Files - averages.AvgFileNum, 2);
        if(data.Files[index].Files > 0){
            sDeviations.JsRatioDeviation += Math.pow(data.Files[index].JS_Files / data.Files[index].Files * 100 
                - averages.AvgJsRatio, 2);
            sDeviations.TsRatioDeviation += Math.pow(data.Files[index].TS_Files / data.Files[index].Files * 100
                - averages.AvgTsRatio, 2);
        }

        if(index == data.Graphs.length-1){
            sDeviations.DependenciesDeviation = Math.sqrt(sDeviations.DependenciesDeviation / index).toFixed(2); 
            sDeviations.DepthDeviation = Math.sqrt(sDeviations.DepthDeviation / index).toFixed(2); 
            sDeviations.NodeDegreeDeviation = Math.sqrt(sDeviations.NodeDegreeDeviation / index).toFixed(2);
            sDeviations.SizeDeviation = Math.sqrt(sDeviations.SizeDeviation / index).toFixed(2);
            sDeviations.FileNumDeviation = Math.sqrt(sDeviations.FileNumDeviation / index).toFixed(2);
            sDeviations.JsRatioDeviation = Math.sqrt(sDeviations.JsRatioDeviation / index).toFixed(2);
            sDeviations.TsRatioDeviation = Math.sqrt(sDeviations.TsRatioDeviation / index).toFixed(2);
        }
    }
    Object.keys(averages).forEach(function(key){ averages[key] = averages[key].toFixed(2)});

    console.log(averages);
    console.log(sDeviations);

    return {Averages: averages, StandardDeviations: sDeviations};
}

export default createStats;