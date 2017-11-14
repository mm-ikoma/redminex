const Issues = class Issues {

    constructor(baseUrl, params) {

        let base = document.createElement("base");
        base.href = baseUrl;
        document.head.appendChild(base);

        this.api = new IssuesAPI(baseUrl);
        this.params = params;
        this.columns = [
            {
                name: "selected",
                header: {
                    width: "4rem",
                    render: "選択",
                },
                order: {
                    valueProvider: function(issue) {
                        return issue.selected;
                    },
                    priority: -1,
                    direction: ""
                },
                view: {
                    component: {
                        tagName: "x-input-select",
                        options: {
                            template: "#x-input-select-template",
                            props: {
                                issue: {
                                    type: Object,
                                    required: true
                                }
                            },
                            methods: {
                                onChange: function() {
                                    localStorage.setItem(`selected-${this.issue.id}`, this.issue.selected);
                                }
                            }
                        }
                    }
                },
                export: function(issue) {
                    return issue.selected ? "✓" : "";
                }
            }, {
                name: "id",
                header: {
                    width: "8rem",
                    render: "ID",
                },
                order: {
                    priority: -1,
                    direction: ""
                },
                view: {
                    html: {
                        render: function(issue) {
                            return `<a href="issues/${issue.id}" target="_blank" tabindex="-1">${issue.id}</a>`;
                        },
                        classes: [
                            "number"
                        ]
                    }
                },
                export: function(issue) {
                    return issue.id;
                },
                suggest: {
                    use: true,
                    text: "",
                    placeholder: "例:777",
                    styles: {
                        width:"4rem",
                    }
                }
            }, {
                name: "parent",
                header: {
                    width: "6rem",
                    render: "Parent ID",
                },
                order: {
                    valueProvider: function(issue) {
                        if (issue.parent) {
                            return issue.parent.id;
                        }
                        return 0;
                    },
                    priority: -1,
                    direction: ""
                },
                view: {
                    html: {
                        render: function(issue) {
                            if (issue.parent) {
                                return `<a href="issues/${issue.parent.id}" target="_blank" tabindex="-1">${issue.parent.id}</a>`;
                            }
                        },
                        classes: [
                            "number"
                        ]
                    }
                },
                export: function(issue) {
                    return issue.parent.id;
                },
                filter: {
                    create: function(issues) {
                        return _(issues).filter(function(issue) {
                            return issue.parent;
                        }).map(function(issue) {
                            return {id: issue.parent.id, name: issue.parent.id};
                        }).uniqBy("id").orderBy(["id"], ["asc"]).value();
                    },
                    includes: []
                }
            }, {
                name: "priority",
                header: {
                    width: "4rem",
                    render: "優先度",
                },
                order: {
                    valueProvider: function(issue) {
                        return issue.priority.id;
                    },
                    priority: -1,
                    direction: ""
                },
                view: {
                    html: {
                        render: function(issue) {
                            return issue.priority.name;
                        }
                    }
                },
                filter: {
                    create: function(issues) {
                        return _(issues).filter(function(issue) {
                            return issue.priority;
                        }).map(function(issue) {
                            return {id: issue.priority.id, name: issue.priority.name};
                        }).uniqBy("id").orderBy(["id"], ["asc"]).value();
                    },
                    includes: []
                }
            }, {
                name: "status",
                header: {
                    width: "6rem",
                    render: "ステータス",
                },
                order: {
                    valueProvider: function(issue) {
                        return issue.status.id;
                    },
                    priority: -1,
                    direction: ""
                },
                view: {
                    html: {
                        render: function(issue) {
                            return issue.status.name;
                        }
                    }
                },
                filter: {
                    create: function(issues) {
                        return _(issues).filter(function(issue) {
                            return issue.status;
                        }).map(function(issue) {
                            return {id: issue.status.id, name: issue.status.name};
                        }).uniqBy("id").orderBy(["id"], ["asc"]).value();
                    },
                    includes: []
                }
            }, {
                name: "subject",
                header: {
                    render: "題名",
                },
                order: {
                    priority: -1,
                    direction: ""
                },
                view: {
                    html: {
                        render: function(issue) {
                            return issue.subject;
                        }
                    }
                },
                suggest: {
                    use: true,
                    text: "",
                    placeholder: "例:設問文"
                }
            }, {
                name: "author",
                header: {
                    width: "6rem",
                    render: "起票者",
                },
                order: {
                    valueProvider: function(issue) {
                        return issue.author.id;
                    },
                    priority: -1,
                    direction: ""
                },
                view: {
                    html: {
                        render: function(issue) {
                            let offset = issue.author.name.indexOf("】");
                            if (- 1 < offset) {
                                return issue.author.name.substr(offset + 1);
                            }
                            return issue.author.name;
                        }
                    }
                }
            }, {
                name: "assigned_to",
                header: {
                    width: "6rem",
                    render: "担当者",
                },
                order: {
                    valueProvider: function(issue) {
                        if (issue.assigned_to) {
                            return issue.assigned_to.id;
                        }
                        return 0;
                    },
                    priority: -1,
                    direction: ""
                },
                view: {
                    html: {
                        render: function(issue) {
                            if (issue.assigned_to) {
                                let offset = issue.assigned_to.name.indexOf("】");
                                if (- 1 < offset) {
                                    return issue.assigned_to.name.substr(offset + 1);
                                }
                                return issue.assigned_to.name;
                            }
                        }
                    }
                },
                filter: {
                    create: function(issues) {
                        var assignedUsers = _(issues).filter(function(issue) {
                            return issue.assigned_to;
                        }).map(function(issue) {
                            let name = issue.assigned_to.name;
                            let offset = issue.assigned_to.name.indexOf("】");
                            if (- 1 < offset) {
                                name = issue.assigned_to.name.substr(offset + 1);
                            }
                            return {id: issue.assigned_to.id, name: name};
                        }).uniqBy("id").orderBy(["id"], ["asc"]).value();

                        return [
                            {
                                id: -1,
                                name: "未設定",
                                render: function() {
                                    return "<span style='font-weight:bold;color:crimson;'>未設定</span>";
                                }
                            }
                        ].concat(assignedUsers);
                    },
                    includes: []
                }
            }, {
                name: "created_on",
                header: {
                    width: "9rem",
                    render: "起票日",
                },
                order: {
                    valueProvider: function(issue) {
                        return issue.created_on;
                    },
                    priority: -1,
                    direction: ""
                },
                view: {
                    html: {
                        render: function(issue) {
                            var createdOn = new Date(issue.created_on).toLocaleString();
                            return createdOn.substr(0, createdOn.lastIndexOf(":"));
                        }
                    }
                }
            }, {
                name: "estimated_hours",
                header: {
                    width: "5rem",
                    render: "予定工数",
                },
                order: {
                    valueProvider: function(issue) {
                        return issue.estimated_hours;
                    },
                    priority: -1,
                    direction: ""
                },
                view: {
                    html: {
                        render: function(issue) {
                            return issue.estimated_hours;
                        },
                        classes: [
                            "number"
                        ]
                    }
                }
            }, {
                name: "tag",
                header: {
                    width: "12rem",
                    render: "タグ",
                },
                order: {
                    valueProvider: function(issue) {
                        return issue.tags;
                    },
                    priority: -1,
                    direction: ""
                },
                view: {
                    component: {
                        tagName: "x-input-tags",
                        options: {
                            template: "#x-input-tags-template",
                            props: {
                                issue: {
                                    type: Object,
                                    required: true
                                }
                            },
                            methods: {
                                onInput: _.debounce(function() {
                                    localStorage.setItem(`tags-${this.issue.id}`, this.issue.tags);
                                }, 250)
                            }
                        }
                    }
                },
                export: function(issue) {
                    return issue.tags;
                }
            }, {
                name: "color",
                header: {
                    width: "4rem",
                    render: "色",
                },
                order: {
                    valueProvider: function(issue) {
                        return issue.color;
                    },
                    priority: -1,
                    direction: ""
                },
                view: {
                    component: {
                        tagName: "x-input-color",
                        options: {
                            template: "#x-input-color-template",
                            props: {
                                issue: {
                                    type: Object,
                                    required: true
                                }
                            },
                            methods: {
                                onColorInput: _.debounce(function() {
                                    localStorage.setItem(`color-${this.issue.id}`, this.issue.color);
                                }, 250),
                                onClear: function() {
                                    localStorage.setItem(`color-${this.issue.id}`, this.issue.color = "");
                                }
                            }
                        }
                    }
                },
                export: function(issue) {
                    return issue.color;
                }
            },
        ];
    }

    async display() {

        const me = this;

        // 列コンポーネントを登録
        for (const column of this.columns) {
            if (column.view.component) {
                Vue.component(column.view.component.tagName, column.view.component.options);
            }
        }

        // Redmineのissueにアプリケーションデータをミックス
        let mergeAppData = function(issues) {
            for (const issue of issues) {
                issue.tags = localStorage.getItem(`tags-${issue.id}`);
                issue.color = localStorage.getItem(`color-${issue.id}`);
                let selected = localStorage.getItem(`selected-${issue.id}`);
                if (selected) {
                    issue.selected = selected == "true";
                } else {
                    issue.selected = false;
                }
                let duplicated = localStorage.getItem(`duplicated-${issue.id}`);
                if (duplicated) {
                    issue.duplicated = duplicated == "true";
                } else {
                    issue.duplicated = false;
                }
            }
            return issues;
        };
        const vm = new Vue({
            el: "#root",
            components: {
                "x-issues-filter": {
                    template: "#x-issues-filter-template",
                    props: {
                        column: {
                            type: Object,
                            required: true
                        },
                        issues: {
                            type: Array,
                            required: true
                        }
                    },
                    methods: {
                        clearFilter: function() {
                            // this.$emit("clear-filter", this.column);
                            this.column.filter.includes = [];
                        }
                    }
                },
                "x-issues-head-row": {
                    template: "#x-issues-head-row-template",
                    props: {
                        columns: {
                            type: Array,
                            required: true
                        }
                    },
                    methods: {
                        setOrder: function(column, direction) {
                            let priority = 0;
                            column.order.priority = priority;
                            column.order.direction = direction;
                            _(this.columns).filter(function(c) {
                                return column.name != c.name && -1 < c.order.priority;
                            }).orderBy(function(c) {
                                return c.order.priority;
                            }).each(function(c) {
                                c.order.priority = ++priority;
                            });
                        }
                    }
                },
                "x-issues-body-row": {
                    template: "#x-issues-body-row-template",
                    props: {
                        columns: {
                            type: Array,
                            required: true
                        },
                        issue: {
                            type: Object,
                            required: true
                        }
                    },
                    computed: {
                        classes: function() {
                            return {
                                "issues__row--selected": this.issue.selected,
                                "issues__row--duplicated": this.issue.duplicated
                            }
                        },
                        styles: function() {
                            if (this.issue.color) {
                                return {"background-color": this.issue.color}
                            }
                        }
                    }
                },
                "x-loading-indicator": {
                    template: "#x-loading-indicator-template",
                    props: {
                        isShown: {
                            type: Boolean
                        },
                        withProgress: {
                            type: Boolean
                        },
                        progressValue: {
                            type: Number
                        },
                        progressMax: {
                            type: Number
                        },
                        autoHide: {
                            type: Boolean,
                            default: true
                        }
                    },
                    computed: {
                        progress: function() {
                            return Math.round(this.progressValue / this.progressMax * 100);
                        },
                        styles: function() {
                            return {"width": `${this.progress}%`};
                        }
                    },
                    mounted: function() {
                        if (this.autoHide && this.withProgress) {
                            this.$watch("progress", function(value) {
                                if (value == 100) {
                                    setTimeout(()=>{
                                        this.$emit("update:isShown", false);
                                        this.$emit("update:progressValue", 0);
                                    }, 500);
                                }
                            });
                        }
                    }
                }
            },
            data: {
                issues: [],
                columns: this.columns,
                loading: {
                    isShown: false,
                    withProgress: true,
                    progressMax: 1,
                    progressValue: 0,
                    autoHide: true
                }
            },
            methods: {
                clearSelect: function() {
                    for (const issue of this.issues) {
                        if (issue.selected) {
                            issue.selected = false;
                            localStorage.setItem(`selected-${issue.id}`, issue.selected);
                        }
                    }
                },
                clearOrders: function() {
                    for (const column of this.columns) {
                        column.order.priority = -1;
                        column.order.direction = "";
                    }
                },
                clearFilter: function(column) {
                    column.filter.includes = [];
                },
                onReload: async function() {
                    vm.loading.isShown = true;
                    let issues = await me.api.all({
                        "project_id": 10,
                        "created_on": ">=2017-10-01",
                        "sort": "created_on:desc",
                        "include":"relations",
                    },{
                        start: function(total) {
                            vm.loading.progressMax = total;
                        },
                        progress: function(current) {
                            vm.loading.progressValue = current;
                        },
                        end: function(actual) {
                            vm.loading.progressValue = actual;
                        }
                    });
                        // .filter(issue => {
                        //     return issue.parent && -1 < me.params.parents.indexOf(issue.parent.id);
                        // })
                        // .filter(issue => {
                        //     return issue.parent && -1 < me.params.parents.indexOf(issue.parent.id);
                        // })
                        // .value();
                    if (me.params.relations) {
                        if (!_.isArray(me.params.relations)) {
                            me.params.relations = me.params.relations.split(",").map(relation => Number(relation));
                        }
                        this.issues = mergeAppData(_.filter(issues, issue => {
                            if (issue.relations) {
                                let relatedIssueIds = issue.relations.map((relation)=>{
                                    return relation.issue_id;
                                });
                                let intersect = _.intersection(me.params.relations, relatedIssueIds);
                                return 0 < intersect.length
                            }
                            return false;
                        }));
                    } else {
                        this.issues = mergeAppData(issues);
                    }
                },
                onExport: async function(media) {
                    switch (media) {
                        case "text/csv":
                            let escape = function(value) {
                                if (!_.isUndefined(value)) {
                                    value = String(value);
                                }
                                if (_.isString(value)) {
                                    return '"' + value.replace(/\"/, "\"\"") + '"';
                                }
                            };
                            let lines = [];
                            let headers = []
                            for (let column of this.columns) {
                                headers.push(escape(column.header.render()));
                            }
                            lines.push(headers.join(","));
                            for (let issue of this.listIssues) {
                                let line = [];
                                for (let column of this.columns) {
                                    let cell = "";
                                    if (_.isFunction(column.export)) {
                                        cell = column.export(issue);
                                    } else if (column.view.html) {
                                        cell = column.view.html.render(issue);
                                    } else {
                                        cell = ";o;";
                                    }
                                    line.push(escape(cell));
                                }
                                lines.push(line.join(","));
                            }
                            var blob = new Blob([lines.join("\r\n")], {"type": "text/csv"});
                            var anchor = document.createElement("a");
                            anchor.download = "issues_" + new Date().toLocaleString() + ".csv";
                            anchor.href = window.URL.createObjectURL(blob);
                            anchor.click();
                            break;
                        default:
                    }
                },
                onCheckDuplicate : async function() {
                    for (let issue of this.listIssues) {
                        let relations = await me.api.relations(issue.id);
                        let duplicate = _.find(relations, (relation) => {
                            return relation["relation_type"] == "duplicates" && relation["issue_id"] == issue.id;
                        });
                        if (duplicate) {
                            issue.duplicated = true;
                        }
                    }
                },
                onBulkEdit: function() {
                    let ids = _(this.issues).filter((issue) => issue.selected).map((issue) => `ids[]=${issue.id}`).value().join("&");
                    window.open(encodeURI(`issues/bulk_edit?${ids}`), '_blank');
                }
            },
            computed: {
                total: function() {
                    return this.listIssues.length;
                },
                columnsForFilter: function() {
                    return _.filter(this.columns, function(column) {
                        return column.filter;
                    });
                },
                columnsForSuggest: function() {
                    return _.filter(this.columns, function(column) {
                        return column.suggest && column.suggest.use;
                    });
                },
                listIssues: function() {
                    var me = this;
                    var orderedColumns = _(this.columns).filter(function(c) {
                        return -1 < c.order.priority;
                    }).orderBy(function(c) {
                        return c.order.priority;
                    }).value();
                    var sortValueProviders = _.map(orderedColumns, function(c) {
                        if (_.isFunction(c.order.valueProvider)) {
                            return c.order.valueProvider;
                        }
                        return function(issue) {
                            return issue[c.name];
                        }
                    });
                    var sortDirections = _.map(orderedColumns, function(c) {
                        return c.order.direction;
                    });
                    return _(this.issues).filter(function(issue) {
                        for (var column of me.columnsForFilter) {
                            if (0 < column.filter.includes.length) {
                                if (!issue[column.name] && -1 < _.indexOf(column.filter.includes, -1)) {
                                    return true;
                                }
                                if (!issue[column.name] || _.indexOf(column.filter.includes, issue[column.name].id) == -1) {
                                    return false;
                                }
                            }
                        }
                        for (var column of me.columnsForSuggest) {
                            if (0 < column.suggest.text.length) {
                                // if (!_.isString(issue[column.name]) || issue[column.name].indexOf(column.suggest.text) == -1) {
                                if (String(issue[column.name]).indexOf(column.suggest.text) == -1) {
                                    return false;
                                }
                            }
                        }
                        return true;
                    }).orderBy(sortValueProviders, sortDirections).value();
                },
                selectedCount: function() {
                    return _.countBy(this.issues, "selected")["true"];
                }
            }
        });

        vm.onReload();

    }

}
