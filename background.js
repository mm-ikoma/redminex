chrome.runtime.onMessage.addListener((request, sender, sendResponse)=>{
    if (request === "showPageAction") {
        chrome.pageAction.show(sender.tab.id);
    }
});
