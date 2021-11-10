const sigma = require("sigma");
const colors = ['#2e946d','#F0A30A','#2980B9','#A20025','#FFAB91','yellow','blue','pink','#795548','#607D8B'];

/*
 * Calculates the dependency graphs nodes and edges. It only draws the graph if shouldDrawGraph is true.
 * @param {Array} packages - Array of the individual packages from dependencies
 * @param {Array} dependencies - Array of dependency relations between the packages
 * @param {boolean} shouldDrawGraph - Boolean which tells the function if it should draw the graph (true by default)
 * @returns {Array} [nodes, edges] - Array containing the dependency graphs nodes and edges
 * */
function calculateGraphData(packages, dependencies, shouldDrawGraph = true){

    if(shouldDrawGraph){
        document.getElementById("container").innerHTML="";
        document.getElementById("showReq").innerHTML ="";
    }

    let graphNodes = [];
    let graphEdges = [];

    // Create graph nodes from packages
    for (let i = 0; i < packages.length; i++) {
        graphNodes[i] =  {id: packages[i].Name, label: packages[i].Name, y:0, x:0+packages[i].Level, size:1};
    }

    // Create graph edges from dependencies
    for (let i = 0; i < dependencies.length; i++) {
        graphEdges[i] =  {id: 'edge_'+i, source: dependencies[i].Parent, target: dependencies[i].Name, color:"#333"};
    }

    // MY Graph layout algorithm for arranging nodes to their proper level
    // Positioning nodes vertically
    var changes = true;
    let changelog = [];

    let num = 0;
    while(changes){
        changes=false;
        let currentlog = [];

        for(let edge of graphEdges) {
            let source;
            let target;
            for(let node of graphNodes){

                if(edge.source == node.label){
                    source = node;
                }else if(edge.target == node.label){
                    target = node;
                }
                if(typeof source == "object" && typeof target == "object" && target.label!=graphNodes[0].label){

                    if(source.x == target.x){
                        target.x+=1;;
                        currentlog.push(source.label);
                        currentlog.push(target.label);
                        changes=true;
                    }
                    else if(target.x<source.x){
                        currentlog.push(source.label);
                        currentlog.push(target.label);
                        target.x = source.x+1;
                        changes=true;
                    }
                    edge.color = colors[source.x];
                    break;
                }
            }
        }

        changelog.push(currentlog);

        if(num>0 && changelog[num].length == changelog[num-1].length){
            let identical = true;
            for(let i = 0; i<changelog[num].length; i++){
                if(changelog[num][i] != changelog[num-1][i]){
                    identical = false;
                    break;
                }
            }
            if(identical){
                break;
            }
        }
        num++;
    }


    // Positioning nodes horizontally
    let nodes = graphNodes.sort((a,b) => (a.x > b.x) ? 1 : ((b.x > a.x) ? -1 : 0))
    let edges = graphEdges;
    let nArray = [];
    for(let i = 0; i<nodes.length; i++){

        if(i<nodes.length-1 && nodes[i].x == nodes[i+1].x){
            nArray.push(nodes[i]);
        }else if(nArray.length>0){
            nArray.push(nodes[i]);
            let offset;
            if(nArray[0].x%2==0){
                offset = nArray.length/5/nArray.length;
            }else{
                offset = nArray.length/6/nArray.length;
            }

            for(let j=0; j<nArray.length; j++){
                if(j==0){
                    nArray[j].y = Math.random() * (0.5 - -0.5) -0.5;
                }else{
                    if(j%2 == 0){
                        nArray[j].y = nArray[j-2].y+offset;
                    }else{
                        if(j==1){
                            nArray[j].y = nArray[j-1].y-offset;
                        }else{
                            nArray[j].y = nArray[j-2].y-offset;
                        }
                    }
                }
            }
            nArray=[];
        }
    }

    if(shouldDrawGraph){
        drawGraph(graphNodes, graphEdges);
    }

    return [nodes, edges];
}

/*
 * Draws the dependency graph using the calculated graph data.
 * @param {Array} graphNodes - Array of objects containing each node's data
 * @param {Array} graphEdges - Array of objects containing each edge's data
 * */
function drawGraph(graphNodes, graphEdges){
    var s = new sigma({
        container: 'container',
        renderer: {
            container: document.getElementById('container'),
            type: sigma.renderers.canvas,
        },
        settings: {
            defaultEdgeType: "arrow",
            minArrowSize: 5,
            sideMargin: 5,
            defaultNodeColor: '#757575',
            defaultLabelColor: '#757575',
            defaultLabelSize: 15,
            defaultLabelBGColor: '#ddd',
            defaultLabelHoverColor: '#000',
        }
    });

    for(let node of graphNodes){
        s.graph.addNode(node);
    }

    for(let edge of graphEdges){
        s.graph.addEdge(edge);
    }

    s.refresh();
}

export default calculateGraphData;
