import fetchData from "./fetchData"
const registryUrl = "https://libraries.io/api/search";

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
    
    if(pages>0){
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
            Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
            pkgs = pkgs.concat(await fetchData(url)
            .then((res) => {
                return res;
            }));
        }
    }else{
        let url = new URL(registryUrl);
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
        pkgs = pkgs.concat(await fetchData(url)
        .then((res) => {
            console.log(res);
            return res;
        }));
    }
    
    return pkgs;
}

export default searchPackages;
