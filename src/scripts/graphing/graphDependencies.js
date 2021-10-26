import { Graph } from "./Graph";
import { getDependenciesTillDepth } from "../getDependencies";
import { analyseGraph } from "./analyseGraph";
import { calculateGraphData } from "./calculateGraphData";
import { checkKeywords } from "./checkKeywords";

export async function graphDependencies(pckg, dDepth, singleMode=true){
    let dependencies = await getDependenciesTillDepth(pckg, dDepth);
    let packages = dependencies[dependencies.length-1];
    dependencies.pop(dependencies[dependencies.length-1]);
    console.log(packages);
    //checkKeywords(packages, dependencies);

    let graphEntities = calculateGraphData(packages, dependencies, singleMode);
    let currentGraph = new Graph(graphEntities[0], graphEntities[1]);
    
    if(singleMode){
        analyseGraph(currentGraph);
    }

    return currentGraph;
}