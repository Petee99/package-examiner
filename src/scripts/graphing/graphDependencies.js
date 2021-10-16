import { Graph } from "./Graph";
import { getDependenciesTillDepth } from "../getDependencies";
import { analyseGraph } from "./analyseGraph";
import { calculateGraphData } from "./calculateGraphData";

export async function graphDependencies(pckg, dDepth){
    var dependencies = await getDependenciesTillDepth(pckg, dDepth);
    var packages = dependencies[dependencies.length-1];
    dependencies.pop(dependencies[dependencies.length-1]);
    
    var graphEntities = calculateGraphData(packages, dependencies);
    var currentGraph = new Graph(graphEntities[0], graphEntities[1]);
    analyseGraph(currentGraph);
}