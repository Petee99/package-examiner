import Chart from 'chart.js/auto';

export function analyseGraph(thisGraph){
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
    graphData[5].innerHTML = "Graph Node Degrees (Incoming and Outgoing):";
    graphData[6] = document.createElement('canvas');
    graphData[6].id = "nodeDegHistogramIn"
    graphData[7] = document.createElement('canvas');
    graphData[7].id = "nodeDegHistogramOut"

    for(let i= 0; i<graphData.length; i++){
        dataDom.appendChild(graphData[i]);
    }

    makeGraphDataHistogram("depDistHistogram",thisGraph.getLinksPerDepth());
    makeGraphDataHistogram("nodeDegHistogramIn",thisGraph.getNodeDegrees());
    makeGraphDataHistogram("nodeDegHistogramOut",thisGraph.getNodeDegrees());
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