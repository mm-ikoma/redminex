document.addEventListener("DOMContentLoaded", ()=>{

    let params = {};
    location.search.substr(1).split("&").forEach((param)=>{
        let keyValue = param.split("=");
        params[keyValue[0]] = keyValue[1];
    });

    let issues = new Issues("https://redmine.macromill.com/", params);
    issues.display();

});
