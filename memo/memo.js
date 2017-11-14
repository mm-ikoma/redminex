const Memo = class Memo {

    constructor() {
    }

    async display() {

        const me = this;

        Vue.config.devtools = true;

        const vm = new Vue({
            el: "#root",
            components: {
                "x-input-dialog": XDialog.options({
                    template: "#x-input-dialog-template",
                    data: function(){
                        return {
                            value: "",
                            error: "",
                        }
                    },
                    props: {
                        memoNames: {
                            type: Array,
                        },
                    },
                    computed: {
                        availableName: function(){
                            if (!this.value) {
                                this.error = "作成するメモの名前を入力してください";
                                return false;
                            }
                            if(-1 < _.indexOf(this.memoNames, this.value)){
                                this.error = `${this.value}は既に存在します`;
                                return false;
                            }
                            this.error = "";
                            return true;
                        }
                    },
                }),
                "x-delete-dialog": XDialog.options({
                    template: "#x-delete-dialog-template",
                    props: {
                        value: {
                            type: String,
                        },
                    },
                }),
            },
            data: {
                memo: "",
                memoNames: [],
                selectedMemoName: "",
                inputDialogOpened: false,
                deleteDialogOpened: false,
            },
            methods: {
                listMemoNames: function(){
                    let memoNames = [];
                    for(var key in localStorage){
                        if (key.indexOf("memo-") === 0) {
                            memoNames.push(key.substr(5));
                        }
                    }
                    return memoNames;
                },
                onInput: _.debounce(function(){
                    if (this.selectedMemoName) {
                        this.setMemo(this.selectedMemoName, this.memo);
                    }
                }, 200),
                onInputDialogClosed: function(message){
                    if (message && message.result) {
                        let newMemoName = message.value;
                        this.setMemo(newMemoName, "");
                        this.selectedMemoName = newMemoName;
                        this.memoNames = this.listMemoNames();
                    }
                    this.inputDialogOpened = false;
                },
                onDeleteDialogClosed: function(message){
                    if (message && message.result) {
                        let deleteMemoName = message.value;
                        this.removeMemo(deleteMemoName);
                        this.selectedMemoName = "";
                        this.memoNames = this.listMemoNames();
                    }
                    this.deleteDialogOpened = false;
                },
                setMemo: function(name, memo){
                    localStorage.setItem(`memo-${name}`, memo);
                },
                removeMemo: function(name){
                    localStorage.removeItem(`memo-${name}`);
                }
            },
            computed: {
                preview: function(){
                    if (this.memo) {
                        return marked(this.memo);
                    }
                },
            },
            watch: {
                selectedMemoName: function(){
                    if (this.selectedMemoName) {
                        this.memo = localStorage.getItem(`memo-${this.selectedMemoName}`);
                    } else {
                        this.memo = "";
                    }
                }
            },
            created: function(){
                this.memoNames = this.listMemoNames();
                marked.setOptions({
                    highlight: function(code, lang) {
                        return hljs.highlightAuto(code, [lang]).value;
                    }
                });
            }
        });

    }

}
