const sigma = require("sigma");
const colors = ['#2e946d','#F0A30A','#2980B9','#A20025','#FFAB91','yellow','blue','pink','#795548','#607D8B'];

export function calculateGraphData(packages, dependencies, drawGraph = true){
    //Creates a new sigma.js instance, and configures it
    
    if(drawGraph){
        document.getElementById("container").innerHTML="";
    }

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

    // Create graph nodes from packages
    for (let i = 0; i < packages.length; i++) {

        s.graph.addNode({
            // Main attributes:
            id: packages[i].Name,
            label: packages[i].Name,
            // Display attributes:
            y: 0,
            x: 0+packages[i].Level,
            size: 1
        })        
    }
  
    // Create graph edges from dependencies
    for (let i = 0; i < dependencies.length; i++) {
        
        s.graph.addEdge({
            id: 'edge_'+i,
            source: dependencies[i].Parent,
            target: dependencies[i].Name
        });
    }

    // MY Graph layout algorithm for arranging nodes to their proper level
    // Positioning nodes vertically
    var changes = true;
    while(changes){
        changes=false;
        for(let edge of s.graph.edges()) {
            let source;
            let target;
            for(let node of s.graph.nodes()){
                if(edge.source == node.label){
                    source = node;
                }else if(edge.target == node.label){
                    target = node;  
                }  
                if(typeof source == "object" && typeof target == "object"){
                    
                    if(source.x == target.x){
                        target.x+=1;;
                        changes=true;    
                    }
                    else if(target.x<source.x){
                        target.x = source.x+1;
                        changes=true;
                    }
                    edge.color = colors[source.x];                       
                    break;
                }
            }
        }
    }

    // Positioning nodes horizontally
    let nodes = s.graph.nodes().sort((a,b) => (a.x > b.x) ? 1 : ((b.x > a.x) ? -1 : 0))
    let edges = s.graph.edges();
    let nArray = [];
    for(let i = 0; i<nodes.length; i++){
        
        if(i<nodes.length-1 && nodes[i].x == nodes[i+1].x){
            nArray.push(nodes[i]);
        }else if(nArray.length>0){
            nArray.push(nodes[i]);
            let offset;
            if(nArray[0].x%2==0){
                offset = 2/nArray.length;
            }else{
                offset = 3/nArray.length;
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

    if(drawGraph){
        s.refresh();
    }else{
        s.graph.clear();
    }

    return [nodes, edges];
}
