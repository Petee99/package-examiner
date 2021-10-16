// I'm tired, postponing this until tomorrow

export function makeHistogram(id, inputArray){
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