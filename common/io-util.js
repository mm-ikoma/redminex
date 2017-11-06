const IOUtil = class IOUtil {

    async readAsText(file){
        console.log(file);
        return new Promise((resolve, reject) => {
            var reader = new FileReader();
            reader.onerror = function() {
                reject(file);
            }
            reader.onload = function() {
                resolve(reader.result);
            }
            reader.readAsText(file);
        });
    }

}
