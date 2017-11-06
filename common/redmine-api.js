const RedmineAPI = class RedmineAPI {

    constructor(baseUrl, entity) {
        axios.defaults.baseURL = this.baseUrl = baseUrl;
        axios.defaults.headers.get['Content-Type'] = 'application/json';
        this.entity = entity;
    }

    async all(params, callbacks){

        const me = this;

        return new Promise((resolve, reject) => {

            var request = function(offset) {
                return axios.get(`${me.entity}.json`, {
                    params: _.merge(params,{
                        "offset": offset,
                        "limit": 25
                    })
                });
            };

            var records = [];
            var handleRequest = (res) => {
                var nextOffset = res.data.offset + res.data.limit;
                if (callbacks && _.isFunction(callbacks.start) && res.data.offset == 0) {
                    callbacks.start(res.data.total_count);
                }
                if (callbacks && _.isFunction(callbacks.progress) && res.data.offset != 0) {
                    callbacks.progress(records.length);
                }
                records = records.concat(res.data[me.entity]);
                if (records.length < res.data.total_count) {
                    request(nextOffset).then(handleRequest).catch(console.error);
                } else {
                    if (callbacks && _.isFunction(callbacks.end)) {
                        callbacks.end(records.length);
                    }
                    resolve(records);
                }
            };

            request(0).then(handleRequest).catch(console.error);

        });

    }

    async create(params) {

        const me = this;

        return new Promise((resolve, reject) => {
            axios.post(`${me.entity}.json`, params).then((res) => {
                if (res.status == 201) {
                    resolve(res.data.time_entry);
                } else {
                    reject(res.data, res.status, res.statusText);
                }
            }).catch((error) => {
                reject(error);
            });
        });

    }

}
