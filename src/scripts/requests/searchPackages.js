import fetchData from "./fetchData"
const registryUrl = "https://libraries.io/api/search";

/*
 * Searches the Libraries.IO registry for packages.
 * @param {number} size - Number of packages to return
 * @param {string} sortBy - Sort packages in the registry by this
 * @returns {Array} pkgs - Array containing objects with each package's information
 * */
async function searchPackages(size, sortBy){  
    let pkgs = [];
    let pages = Math.floor(size/100)+1;
    let params = {
        sort:sortBy, 
        per_page:size,
        page:1,
        platforms:"NPM",
        api_key:"576acbf22232eac6a3a6b05be774eecb"
    }

    if(pages>1){
        for(let i=1; i<=pages; i++){
            params.page = i;
            if(i==pages){
                if(size%100>0){
                    params.per_page=size%100;
                }else{
                    break
                }
            }
            else{
                params.per_page=100;
            }
            let url = new URL(registryUrl);
            document.getElementById("showReq").innerHTML = "<b style=\"color:#2e946d\">Currently fetching:</b><br>The "+i+". "+params.per_page+" packages Libraries.IO data"
            Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
            pkgs = pkgs.concat(await fetchData(url)
            .then((res) => {
                return res;
            }));
        }
    }else{
        let url = new URL(registryUrl);
        document.getElementById("showReq").innerHTML = "<b style=\"color:#2e946d\">Currently fetching:</b><br>"+params.per_page+" packages Libraries.IO data"
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
        pkgs = pkgs.concat(await fetchData(url)
        .then((res) => {
            return res;
        }));
    }
    
    return pkgs;
}

export default searchPackages;
