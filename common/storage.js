const AppStorage = class AppStorage {

    constructor(name, version) {
        this.name = name;
        this.version = version;
        this.iDB = null;
        this.iDBFactory = indexedDB;
    }

    open(upgradeNeeded) {

        IDBObjectStore

        return new Promise((resolve, reject) => {
            let iDBOpenDBRequest = this.iDBFactory.open(this.name, this.version);
            //　DB名を指定して接続。DBがなければ新規作成される。
            iDBOpenDBRequest.onupgradeneeded = (event) => {
                upgradeNeeded(this.iDB = event.target.result);
            };
            iDBOpenDBRequest.onsuccess = (event) => {
                //onupgradeneededの後に実行。更新がない場合はこれだけ実行
                resolve(this.iDB = event.target.result);
            };
            iDBOpenDBRequest.onerror = function(event) {
                // 接続に失敗
                reject(event);
            };
        });

    }

    delete() {
        return new Promise((resolve, reject) => {
            let iDBOpenDBRequest = this.iDBFactory.deleteDatabase(this.name);
            iDBOpenDBRequest.onsuccess = function(event) {
                resolve(event);
            };
            iDBOpenDBRequest.onerror = function(event) {
                reject(event);
            };
        });
    }

    close() {
        if (this.iDB) {
            this.iDB.close();
        }
    }

}
