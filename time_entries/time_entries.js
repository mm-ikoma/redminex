const TimeEntries = class TimeEntries {

    constructor(baseUrl) {
        this.api = new TimeEntriesAPI(this.baseUrl = baseUrl);
    }

    async display() {

        const me = this;
        const activities = await this.api.activities();

        const vm = new Vue({
            el: "#root",
            components: {
                "x-time-entry": {
                    template: "#x-time-entry-template",
                    props: {
                        entry: {
                            type: Object,
                            required: true
                        },
                    },
                    computed: {
                        issuesURL(){
                            return `${me.baseUrl}issues/${this.entry.issue.id}`;
                        }
                    },
                    methods: {
                        onRegister(entry){
                            this.$emit("register-entry", entry);
                        },
                        onEdit(entry){
                            this.$emit("edit-entry", entry);
                        },
                        onDelete(entry){
                            this.$emit("delete-entry", entry);
                        },
                    }
                },
            },
            data: {
                baseUrl: this.baseUrl,
                month: DateUtil.toMonthString(new Date()),
                entries: [],
                newEntry: {
                    id : 0,
                    issue_id: 0,
                    spent_on: null,
                    hours: 0,
                    comments: "",
                    activity: null,
                },
                activities: activities,
                loading: {
                    isShown: false,
                    withProgress: true,
                    progressMax: 1,
                    progressValue: 0,
                    autoHide: true
                }
            },
            methods: {
                onMonthChange(value){
                    this.onReload();
                },
                async onReload(){
                    let month = new Date(this.month);
                    let firstDate = DateUtil.toDateString(DateUtil.getFirstDate(month));
                    let lastDate = DateUtil.toDateString(DateUtil.getLastDate(month));
                    this.entries = await me.api.all({
                        "user_id": "me",
                        "spent_on": `><${firstDate}|${lastDate}`,
                        "sort": "spent_on:desc",
                    })
                },
                async onRegisterEntry(entry){
                    let created = await me.api.create(entry);
                    entry.created_on = created.created_on;
                    entry.id = created.id;
                    entry.issue = created.issue;
                    entry.project = created.project;
                    entry.updated_on = created.updated_on;
                    entry.user = created.user;
                },
                async onEditEntry(entry){
                    console.log("edit", entry);
                },
                async onDeleteEntry(entry){
                    console.log("delete", entry);
                },
                async onImport(evt){
                    this.entries.length = 0;
                    let file = evt.target.files[0];
                    let reader = new XFileReader()
                    let result = await reader.readAsText(file);
                    let lines = result.split("\r\n");
                    for(let i = 0; i < lines.length; i++){
                        // 日付,チケットID,時間,活動,コメント,
                        let cells = lines[i].split(",");
                        if (cells.length >= 5) {
                            let entry = {
                                id: null,
                                spent_on: cells[0],
                                issue_id: parseInt(cells[1]),
                                hours: parseFloat(cells[2]),
                                activity: _.find(this.activities, (activity)=>{
                                    return activity.id == cells[3];
                                }),
                                comments: cells[4],
                            };
                            if (this.validEntry(entry)) {
                                this.entries.push(entry);
                            }
                        }
                    }
                },
                async onBulkRegister(){
                },

                validEntry(e){
                    return 0 < e.issue_id && e.spent_on && 0 < e.hours && e.activity && e.activity.id;
                }
            },
            computed: {
                listEntries: function() {
                    return this.entries;
                },
            },
            created(){
                this.onReload();
            }
        });

    }

}
