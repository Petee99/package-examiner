import fetchData from "./fetchData"
const gitUrl = "https://api.github.com/repos/"
const gitFileUrl = "https://api.github.com/repos/{repo}/git/trees/master?recursive=1"

// https://raw.githubusercontent.com/lodash/lodash/master/.gitignore

async function getGitData(repo, urlType, rqPar=""){  
    let url; 

    switch (urlType) {
        case "data":
            url = gitUrl+repo;
            break;
        case "files":
            url = gitFileUrl.replace("{repo}", repo); 
            break;
        default:
            break;
    }

    let pkg = await fetchData(url, true)
    .then((resPKG) => {
        console.log(resPKG);
        if(rqPar.length>0){
            return resPKG[rqPar];
        }else{
            return resPKG;
        }
    })
    .catch((error) => {
        console.error(error);
        return error;
    });

    return pkg;
}

export default getGitData;