const Memo = class Memo {

    constructor() {
    }

    async display() {

        const me = this;

        Vue.config.devtools = true;

        const vm = new Vue({
            el: "#root",
            components: {
                [XDialog.tagName()]: XDialog.options(),
            },
            data: {
                memo: "",
                memoNames: [],
                selectedMemoName: "",
                dialogOpened: false,
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
                        this.save(this.selectedMemoName, this.memo);
                    }
                }, 200),
                onCreate: function(){
                    this.dialogOpened = true;
                },
                onDelete: function(){

                },
                onDialogClosed: function(message){
                    if (message && message.result) {
                        let newMemoName = message.value;
                        this.save(newMemoName, this.memo);
                        this.selectedMemoName = newMemoName;
                        this.memoNames = this.listMemoNames();
                    }
                    this.dialogOpened = false;
                },
                save: function(name, memo){
                    localStorage.setItem(`memo-${name}`, memo);
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
                    this.memo = localStorage.getItem(`memo-${this.selectedMemoName}`);
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
