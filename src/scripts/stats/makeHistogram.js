import Chart from 'chart.js/auto';

/*
 * Sets the data required for making a histogram.
 * @param {string} id - ID of html element, in which the histogram should be presented
 * @param {Object|Array} pData - Object or Array of objects containing data for making histograms  
 * */
function setHistogram(id, pData){
    let label;
    let labArray = [];
    let dataArray = [];
    switch (id) {
        case "depDistHistogram":
            pData = pData.getLinksPerDepth();
            for(let i=1; i<pData.length; i++){
                labArray.push(i);
                dataArray.push(pData[i]);
            }
            label="Number of Dependencies per Depth Level"
            break;
        case "nodeDegHistogramIn":
            pData = pData.getNodeDegrees();
            for(let data of pData){
                labArray.push(data.Name);
                dataArray.push(data.In);
            }
            label="Number of Incoming Edges"
            break;
        case "nodeDegHistogramOut":
            pData = pData.getNodeDegrees();
            for(let data of pData){
                labArray.push(data.Name);
                dataArray.push(data.Out);
            }
            label="Number of Outgoing Edges"
            break;
        case "depDistStatHistogram":
            for(let entry of pData.Graphs){
                labArray.push(entry.name);
                dataArray.push(entry.edges.length);
            }
            label="Number of Dependencies"
            break;
        case "depthHistogram":
            for(let entry of pData.Graphs){
                labArray.push(entry.name);
                dataArray.push(entry.getMaxDepth());
            }
            label="Depth"
            break;
        case "avgDegHistogram":
            for(let entry of pData.Graphs){
                labArray.push(entry.name);
                dataArray.push(entry.edges.length/entry.nodes.length);
            }
            label="Average Node Degree"
            break;
        case "pkgSize":
            for(let entry of pData.Files){
                labArray.push(entry.Package);
                dataArray.push(entry.Size);
            }
            label="Size of Package (MB)"
            break;
        case "pkgFiles":
            for(let entry of pData.Files){
                labArray.push(entry.Package);
                dataArray.push(entry.Files);
            }
            label="Number of Files"
            break;
        case "jsFiles":
            for(let entry of pData.Files){
                labArray.push(entry.Package);
                dataArray.push((entry.JS_Files/entry.Files*100).toFixed(2));
            }
            label="JS File Ratio (%)"
            break;
        case "tsFiles":
            for(let entry of pData.Files){
                labArray.push(entry.Package);
                dataArray.push((entry.TS_Files/entry.Files*100).toFixed(2));
            }
            label="TS File Ratio (%)"
            break;
        default:    
            break;
    }

    makeHistogram(id, dataArray, label, labArray);
}

/*
 * Draws the histogram using Chart.js.
 * @param {string} id - ID of html element, in which the histogram should be presented
 * @param {Array} dataArray - Array containing the data to represent 
 * @param {string} label - Label of the histogram
 * @param {Array} labArray - Array containing the labels for each entry
 * */
function makeHistogram(id, dataArray, label, labArray){
    const ctx = document.getElementById(id).getContext('2d');

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

export default setHistogram;