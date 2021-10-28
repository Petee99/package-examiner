/**
 * Represents a Graph
 */
class Graph{
    constructor(nodes, edges){
        this.name = nodes[0].id;
        this.nodes = nodes;
        this.edges = edges;
    }
    getMaxDepth(){
        let maxDepth=0;
        for(let node of this.nodes){
            if(node.x>maxDepth){
                maxDepth = node.x;
            }
        }
        return maxDepth;
    }
    getLinksPerDepth(){
        let array = [];
    
        for(let edge of this.edges) {
            for(let node of this.nodes){
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
    getNodeDegrees(){
        let array = [];
    
        for(let i = 0; i<this.nodes.length; i++){
            for(let edge of this.edges) {
                if(array[i]==undefined){
                    array[i] = {Name: this.nodes[i].label, In: 0, Out:0};
                }            
                if(edge.target==this.nodes[i].label){
                    array[i].In++;
                }
                if(edge.source==this.nodes[i].label){
                    array[i].Out++;
                }   
            }
        }
        return array;
    }
}

export default Graph;