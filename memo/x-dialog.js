const XDialog = class XDialog {

    static options(mixin){
        return {
            mixins:[mixin],
            props: {
                opened: {
                    type: Boolean,
                    default: false,
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
