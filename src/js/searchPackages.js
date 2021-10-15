const registryUrl = "https://libraries.io/api/search";

//SORT parameter: one of rank, stars, dependents_count, dependent_repos_count, latest_release_published_at, contributions_count, created_at.
//ORDER parameter: ascending/descending

async function searchPackages(size, sortBy, order){  
    let url = new URL(registryUrl);
    let pkgs = [];
    let pages = Math.floor(size/100);
    let params = {
        sort:sortBy, 
        order:order,
        per_page:size,
        page:1,
        api_key:"576acbf22232eac6a3a6b05be774eecb"
    }
    
    if(pages>0){
        for(let i=1; i<=pages+1; i++){
            params.pages = i;
            if(i==pages+1){
                params.per_page=size-pages*100;
            }
            else{
                params.per_page=100;
            }
            Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
            pkgs = pkgs.concat(await fetchData(url)
            .then((res) => {
                return res;
            }));
        }
    }else{
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
        pkgs = pkgs.concat(await fetchData(url)
        .then((res) => {
            console.log(res);
            return res;
        }));
    }
    
    return pkgs;
}

async function fetchData(url){
    let response = await fetch(url);

    if (!response.ok) {
        throw new Error(response.status);
    }
    
    return response.json();
}

export default searchPackages;
