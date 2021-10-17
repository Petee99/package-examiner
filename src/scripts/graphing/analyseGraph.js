import makeHistogram from "../stats/makeHistogram";

export function analyseGraph(thisGraph){
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
    graphData[4].id = "depDistHistogram"
    graphData[5] = document.createElement('h3');
    graphData[5].innerHTML = "Incoming Node Degrees:";
    graphData[6] = document.createElement('canvas');
    graphData[6].id = "nodeDegHistogramIn"
    graphData[7] = document.createElement('h3');
    graphData[7].innerHTML = "Outgoing Node Degrees:";
    graphData[8] = document.createElement('canvas');
    graphData[8].id = "nodeDegHistogramOut"

    for(let i= 0; i<graphData.length; i++){
        dataDom.appendChild(graphData[i]);
        if(i>2 && i%2==0){
            setHistogram(graphData[i].id, thisGraph);
        }
    }
}

function setHistogram(id, graphData){
    let labArray = [];
    let dataArray = [];
    var label;
    
    switch (id) {
        case "depDistHistogram":
            graphData = graphData.getLinksPerDepth();
            for(let i=1; i<graphData.length; i++){
                labArray.push(i);
                dataArray.push(graphData[i]);
            }
            label="Number of Dependencies"
            break;
        case "nodeDegHistogramIn":
            graphData = graphData.getNodeDegrees();
            for(let data of graphData){
                labArray.push(data.Name);
                dataArray.push(data.In);
            }
            label="Number of Incoming Edges"
            break;
        case "nodeDegHistogramOut":
            graphData = graphData.getNodeDegrees();
            for(let data of graphData){
                labArray.push(data.Name);
                dataArray.push(data.Out);
            }
            label="Number of Outgoing Edges"
            break;    
        default:
            break;
    }
    makeHistogram(id, dataArray, label, labArray);
}