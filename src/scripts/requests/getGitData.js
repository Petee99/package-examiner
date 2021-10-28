import fetchData from "./fetchData"
const gitUrl = "https://api.github.com/repos/"
const gitFileUrl = "https://api.github.com/repos/{repo}/git/trees/{branch}?recursive=1"

// https://raw.githubusercontent.com/lodash/lodash/master/.gitignore

async function getGitData(repo, urlType, branch=""){  
    let url;
    document.getElementById("showReq").innerHTML = "<b style=\"color:#2e946d\">Currently fetching:</b><br>"+repo+"'s git data" 

    switch (urlType) {
        case "data":
            url = gitUrl+repo;
            break;
        case "files":
            url = gitFileUrl.replace("{repo}", repo).replace("{branch}", branch); 
            break;
        default:
            break;
    }

    let pkg = await fetchData(url, true)
    .then((resPKG) => {
        console.log(resPKG);
        return resPKG;
    })
    .catch((error) => {
        console.error(error);
        return error;
    });

    return pkg;
}

export default getGitData;