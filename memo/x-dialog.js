const XDialog = class XDialog {
    static tagName (){
        return "x-dialog";
    }
    static options(){
        return {
            template: "#x-dialog-template",
            props: {
                opened: {
                    type: Boolean,
                    default: false,
                },
                memoNames: {
                    type: Array,
                },
                hasOK: {
                    type: Boolean,
                    default: true
                },
                hasCancel: {
                    type: Boolean,
                    default: true
                },
            },
            data: function(){
                return {
                    value: "",
                    error: "",
                }
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
            methods: {
                close:function(okOrCancel){
                    let result = {
                        result: okOrCancel,
                        value: this.value,
                    };
                    this.$emit("closed", result);
                }
            },
            watch: {
                opened: function(v){
                    let d = this.$refs.dialog;
                    if (v && !d.open) {
                        d.showModal();
                    } else {
                        d.close();
                    }
                }
            }
        }
    }
}
