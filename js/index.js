$(document).ready(function (){
    $("#content").load("content.html");
    $("#footer").load("footer.html");

    $.each($(".navItem"), function(itemIndex, itemValue){
        $(itemValue).click(function(event){
            event.preventDefault();
            if($(this).find('a').attr("href") == "index.html"){
                $("#content").load("content.html");
            }
            else{
                $("#content").load($(this).find('a').attr("href"));
            }
        })           
    })
    
})

