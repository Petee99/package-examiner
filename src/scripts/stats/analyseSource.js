import getGitData from "../requests/getGitData";

export async function analyseSource(packages){
    let gitData = [];
    let files;
    let pkgData = [];
    let n=0;
    console.log(packages);
    for(let pkg of packages){
        let numOfFiles=0;
        let numOfJS=0;
        let numOfTS=0;

        pkg = pkg.repository_url.replace("https://github.com/","");
        gitData.push(await getGitData(pkg, "data"));
        files = await getGitData(pkg, "files");
        if(files.name != "Error"){
            for(let entry of files.tree){
                if(entry.type == "blob"){
                    numOfFiles++;
                    if(entry.path.slice(-3) == ".js"){
                        numOfJS++
                    }
                    else if(entry.path.slice(-3) == ".ts"){
                        numOfTS++;
                    }
                }
            }
        }
        
        //numOfFiles = await getGitData(pkg, "files").totalcount;
        //numOfJS = await getGitData(pkg, "files", "javascript").totalcount;
        //numOfTS = await getGitData(pkg, "files", "typescript").totalcount;
        pkgData.push({Package: packages[n].name, Size: gitData[n].size/1024, Files: numOfFiles, JS_Files: numOfJS, TS_Files: numOfTS});
        n++;
    }

    console.log(pkgData);
}