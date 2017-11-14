document.addEventListener("DOMContentLoaded", async function(){
    let memo = new Memo();
    memo.display();
    // let storage = new AppStorage("test", 1);
    // let connection = await storage.open((iDB)=>{
    //     iDB.createObjectStore('memo', {
    //         keyPath : 'id',
    //         autoIncrement: true,
    //     });
    // });
});
