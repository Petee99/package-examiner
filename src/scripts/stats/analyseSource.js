import getGitData from "../requests/getGitData";

/*
 * Gets data about the package's files.
 * @param {Array} packages - Array containing objects of pacakge information
 * @returns {Array} pkgData - Array containing objects with package files data
 * */
async function analyseSource(packages){
    let gitData = [];
    let files;
    let pkgData = [];
    let n=0;
    for(let pkg of packages){
        let numOfFiles=0;
        let numOfJS=0;
        let numOfTS=0;

        document.getElementById("progress").innerHTML=n+" / "+packages.length+" package's git data is fetched.";
        pkg = pkg.repository_url.replace("https://github.com/","");
        gitData.push(await getGitData(pkg, "data"));
        files = await getGitData(pkg, "files", gitData[n].default_branch);
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
        pkgData.push({Package: packages[n].name, Size: (gitData[n].size/1024).toFixed(2), Files: numOfFiles, JS_Files: numOfJS, TS_Files: numOfTS});
        n++;
    }
    return pkgData;
}

export default analyseSource;