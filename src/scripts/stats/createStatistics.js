import searchPackages from "../searchPackages"
import { graphDependencies } from "../graphing/graphDependencies"

async function createStats(size, sort, order){
    let packages = await searchPackages(size, sort, order);
    let pkgData = [];
    for(let pkg of packages){
        pkg = [pkg.name,pkg.latest_stable_release_number];
        pkgData.push(await graphDependencies(pkg, "", false));
    }
    document.getElementById("container").innerHTML = pkgData;
}

export default createStats;