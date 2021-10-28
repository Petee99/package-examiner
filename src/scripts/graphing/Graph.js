/* *
 * Class representing a Graph
 */
class Graph{
    /*
     * Create a Graph.
     * @param {array} nodes - Graph's nodes
     * @param {array} edges - Graph's edges
     * */
    constructor(nodes, edges){
        this.name = nodes[0].id;
        this.nodes = nodes;
        this.edges = edges;
    }
    /*
     * Gets the dependency graph's depth
     * @returns {number} maxdepth - Graph's depth
     * */
    getMaxDepth(){
        let maxDepth=0;
        for(let node of this.nodes){
            if(node.x>maxDepth){
                maxDepth = node.x;
            }
        }
        return maxDepth;
    }
    /*
     * Gets the dependency graph's depth
     * @returns {Array} array - Array containing dependencies per depth level
     * */
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
    /*
     * Gets the each node's incoming and outgoing node degrees
     * @returns {Object} array - Array of objects containing each nodes nodedegrees
     * */
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