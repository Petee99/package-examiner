import Chart from 'chart.js/auto';

export function analyseGraph(nodes, edges){
    var graphData = [];
    var nodeDegrees = getNodeDegrees(nodes,edges);
    var linksPerDepth = getLinksPerDepth(nodes, edges);

    let dataDom = document.getElementById("graphData");
    //let listElement = document.createElement('ul');

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