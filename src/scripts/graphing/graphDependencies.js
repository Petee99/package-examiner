import Graph from "./Graph";
import getDependenciesTillDepth from "../getDependencies";
import analyseGraph from "./analyseGraph";
import calculateGraphData from "./calculateGraphData";
import checkKeywords from "./checkKeywords";

/*
 * Handles the whole dependency graphing process, only in single mode will the graph be drawn and analysed.
 * @param {string} pckg - The chosen package's name
 * @param {number} dDepth - Search's depth
 * @param {boolean} singleMode - Is the function called in single mode? 
 * @returns {Graph} currentGraph - The dependency graph of the chosen package
 * */
async function graphDependencies(pckg, dDepth, singleMode=true){
    let dependencies = await getDependenciesTillDepth(pckg, dDepth);
    let packages = dependencies[dependencies.length-1];
    dependencies.pop(dependencies[dependencies.length-1]);

    let graphEntities = calculateGraphData(packages, dependencies, singleMode);
    let currentGraph = new Graph(graphEntities[0], graphEntities[1]);
    
    if(singleMode){
        analyseGraph(currentGraph, checkKeywords(packages, dependencies));
    }

    return currentGraph;
}

export default graphDependencies;