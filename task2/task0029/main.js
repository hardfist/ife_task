/**
 * Created by yj on 16/3/26.
 */
class Application {
    constructor(){
        this.$validate = $('#validate')
        this.$username = $('#username')
        this.$propmpt = $(".prompt")
        this.init()
        this.reset()
    }
    init(){
        this.$validate.on('click',this.validate_username.bind(this))
    }
    reset(){
        this.$propmpt.removeClass('success error')
        this.$username.removeClass('success error')
    }
    validate_username(str){
        this.reset()
        let username = this.$username.val()
        let res = Application.validate(username)
        if(res == null){
            this.$propmpt.addClass('success')
            this.$username.addClass('success')
            this.$propmpt.text("名称格式正确")
        }else{
            this.$propmpt.addClass('error')
            this.$username.addClass('error')
            this.$propmpt.text(res)
        }
    }
    static validate(str) {
        str = str || ""
        if (str.length == 0) {
            return "名称不能为空"
        } else if (str.length < 4) {
            return "名称不能小于4个字符"
        } else if (str.length > 16) {
            return "名称不能大于16个字符"
        } else {
            return null
        }
    }
}
var app = new Application()