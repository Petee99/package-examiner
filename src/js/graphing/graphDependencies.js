import { getDependenciesTillDepth } from "../getDependencies";
import { analyseGraph } from "./analyseGraph";
import { drawGraph } from "./drawGraph";

export function graphDependencies(pckg, dDepth){
    var dependencies = getDependenciesTillDepth(pckg, dDepth);
    var packages = dependencies[dependencies.length-1];
    dependencies.pop(dependencies[dependencies.length-1]);

    var graphEntities = drawGraph(packages, dependencies);
    var graphData = analyseGraph(graphEntities[0], graphEntities[1]);
}