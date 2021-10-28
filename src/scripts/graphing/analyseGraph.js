import setHistogram from "../stats/makeHistogram";

/*
 * Studies the dependency graph, represents the analysis with histograms.
 * @param {Graph} thisGraph - The Graph object to be analyzed
 * @param {Array} kwMatches - Array of objects containing information about possibly redundant package pairs 
 * */
function analyseGraph(thisGraph, kwMatches){
    document.getElementById("graphData").innerHTML = "";
    var graphData = [];
    let dataDom = document.getElementById("graphData");

    if(dataDom.innerHTML!=""){
        dataDom.innerHTML=""
    }

    graphData[0] = document.createElement('h3');
    graphData[0].innerHTML = "Number of nodes: <b nowrap>"+thisGraph.nodes.length+"</b>";
    graphData[1] = document.createElement('h3');
    graphData[1].innerHTML = "Number of links: <b nowrap>"+thisGraph.edges.length+"</b>";
    graphData[2] = document.createElement('h3');
    graphData[2].innerHTML = "Depth of graph: <b nowrap>"+thisGraph.getMaxDepth()+"</b>";
    graphData[3] = document.createElement('h3');
    graphData[3].innerHTML = "Dependency distribution:";
    graphData[4] = document.createElement('canvas');
    graphData[4].id = "depDistHistogram";
    graphData[5] = document.createElement('h3');
    graphData[5].innerHTML = "Incoming Node Degrees:";
    graphData[6] = document.createElement('canvas');
    graphData[6].id = "nodeDegHistogramIn";
    graphData[7] = document.createElement('h3');
    graphData[7].innerHTML = "Outgoing Node Degrees:";
    graphData[8] = document.createElement('canvas');
    graphData[8].id = "nodeDegHistogramOut";
    
    if(kwMatches.length>0){
        graphData[9] = document.createElement('h3');
        graphData[9].innerHTML = "Possbile Functionality Overlaps";
        graphData[10] = document.createElement('div');
        graphData[10].innerHTML = `
            <h4>These are the packages where a match exists, they are not in a dependent relation and over half of the keywords are the same the match's keywords</h4>
            <h5>The keywords in a package are used to represent the package's functionality, so it is possible that these dependencies are redundant.</h5>
            <h5>It's just based on the keywords, so further investigation is needed!</h5>
        `;
        graphData[11] = document.createElement('div');

        for(let entry of kwMatches){
            graphData[11].innerHTML += `
                <b style=\"color:#2e946d\">Name:</b> ${entry.Package}<br>
                <b style=\"color:#2e946d\">Match:</b> ${entry.Match}<br>
                <b style=\"color:#2e946d\">Overlap:</b> ${entry.Overlap}<br>
                <br>
            `;
        }
    }
    
    for(let i= 0; i<graphData.length; i++){
        dataDom.appendChild(graphData[i]);
        if(i>2 && i%2==0 && i<10){
            setHistogram(graphData[i].id, thisGraph);
        }
    }
}

export default analyseGraph;