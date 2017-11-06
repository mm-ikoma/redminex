document.addEventListener("DOMContentLoaded", async function(){
    let timeEntries = new TimeEntries("https://redmine.macromill.com/");
    timeEntries.display();
});
