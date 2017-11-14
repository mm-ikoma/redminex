const IssuesAPI = class IssuesAPI extends RedmineAPI {

    constructor(baseUrl) {
        super(baseUrl, "issues");
    }

    async relations(issue_id) {

        const me = this;

        return new Promise((resolve, reject) => {
            axios.get(`issues/${issue_id}/relations.json`).then((res) => {
                if (res.status == 200) {
                    resolve(res.data.relations);
                } else {
                    reject(res.data, res.status, res.statusText);
                }
            }).catch((error) => {
                reject(error);
            });
        });

    }

}
