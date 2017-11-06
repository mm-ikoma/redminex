const features = [
    {
        trigger: "#issues",
        url: "issues/index.html?parents=" + [
            // 85174, // ［CORe］新UI/UX対応                            2016/06/27
            // 85179, // 【単体テスト】新UI/UX対応                      2017/09/15
            96349,  //【要検討課題】新UI/UX対応                       2017/08/18
            95625,  // 動作確認2                                      2017/09/26
            95626,  // ブラウザテスト                                 2017/09/29
            96718,  // 親チケット_FB対応の中ででてきた不具合（別事象）2017/10/04
            97480,  // FB残                                           2017/09/26
            100393, // UATフィードバック                              2017/11/02
        ].join(",")
    },
    {
        trigger: "#time-entries",
        url: "time_entries/index.html",
    },
    {
        trigger: "#memo",
        url: "memo/index.html",
    },
]

document.addEventListener("DOMContentLoaded", () => {

    for(const feature of features){
        document.querySelector(feature.trigger).addEventListener("click", ()=>{
            const url = typeof feature.url === "function" ? feature.url() : feature.url;
            chrome.tabs.create({
                url: encodeURI(url),
            });
        });
    }

});
