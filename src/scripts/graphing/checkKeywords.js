/*
 * Checks if there are packages that have very similar functionality based on their keywords.
 * @param {Array} packages - Array of objects containing information about the current packages
 * @param {Array} dependencies - Array of objects containing information about the current dependencies
 * @returns {Array} matches - Array of objects containing information about possibly redundant package pairs 
 * */
function checkKeywords(packages, dependencies){
    let matches = [];
    let nMatches;
    for(let pkg of packages){
        if(typeof pkg.Keywords != "undefined" && pkg.Keywords.length>2){
            for(let temp of packages){
                nMatches = 0;
                if(typeof temp.Keywords != "undefined" && temp.Keywords.length>2 && pkg.Name != temp.Name){
                    pkg.Keywords.forEach(keyword => {
                        temp.Keywords.forEach(tempKw => {
                            if(keyword == tempKw){
                                nMatches++;
                            }
                        });
                    });
                }
                if(nMatches > pkg.Keywords.length/2){
                    let exists = false;
                    for(let match of matches){
                        if(match.Package == temp.Name && match.Match == pkg.Name){
                            exists = true;
                        }
                    }
                    if(!exists){
                        let isDependent = false;
                        let parent = [];
                        let mParent = [];
                        for(let dep of dependencies){
                            if(dep.Parent == pkg.Name && dep.Name == temp.Name || dep.Parent == temp.Name && dep.Name == pkg.Name){
                                isDependent = true;
                            }
                            if(dep.Name == pkg.Name){
                                parent.push(dep.Parent);
                            }
                            else if(dep.Name == temp.Name){
                                mParent.push(dep.Parent);
                            }
                        }
                        if(parent.length>0 && !isDependent){
                            matches.push({Package: pkg.Name, Parent:parent, Match: temp.Name, MParent: mParent, Overlap: (nMatches/pkg.Keywords.length*100).toFixed(2)+" %"});
                        }
                    }
                }
            }   
        }
    }
    return matches;
}

export default checkKeywords;