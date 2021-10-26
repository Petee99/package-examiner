export function checkKeywords(packages, dependencies){
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
                                console.log(pkg.Name + " - " + temp.Name);
                                console.log(keyword);
                                console.log(nMatches);
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
                        if(parent.length>0){
                            matches.push({Package: pkg.Name, Parent:parent, Keywords: pkg.Keywords, Match: temp.Name, MParent: mParent, MKeywords: temp.Keywords, IsDependent: isDependent});
                        }
                    }
                }
            }   
        }
    }
    console.log(matches);
    return matches;
}