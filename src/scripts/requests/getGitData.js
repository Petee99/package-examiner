import fetchData from "./fetchData"
const gitUrl = "https://api.github.com/repos/"
const gitFileUrl = "https://api.github.com/repos/{repo}/git/trees/{branch}?recursive=1"

/*
 * Gets data from Git Api, using different urls
 * @param {string} repo - Repo's owner/name
 * @param {string} urlType - Type of url to use for fetching
 * @param {string} branch - If searching for files, this is the branch's name
 * @returns {Object} pkg - Object containing the fetch response data
 * */
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