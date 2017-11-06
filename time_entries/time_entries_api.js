const TimeEntriesAPI = class TimeEntriesAPI extends RedmineAPI {

    constructor(baseUrl) {
        super(baseUrl, "time_entries");
    }

    async activities() {
        return new Promise((resolve, reject) => {
            axios.get("enumerations/time_entry_activities.json").then((res) => {
                resolve(res.data.time_entry_activities);
            }).catch(reject);
        });
    }

    async create(entry) {
        return super.create({
            time_entry: {
                // issue_id or project_id (only one is required): the issue id or project id to log time on
                issue_id: entry.issue_id,
                spent_on: entry.spent_on, // the date the time was spent (default to the current date)
                hours: entry.hours, // the number of spent hours
                activity_id: entry.activity.id, // the id of the time activity. This parameter is required unless a default activity is defined in Redmine.
                comments: entry.comments, // short description for the entry (255 characters max)
            }
        });
    }

}
