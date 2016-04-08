/**
 * Created by yj on 16/4/8.
 */
class Input {
    constructor({$el, rule, validator}) {
        this.$el = $el
        this.$prompt = $el.find('.prompt')
        this.$input = $el.find('input')
        this.validator = validator
        this.rule = rule
        this.init()
    }
    //事件绑定
    init() {
        this.$input.on('focus', this.focusHandler.bind(this))
        this.$input.on('blur', this.blurHandler.bind(this))
    }
    focusHandler(evt) {
        this.$el.find('.prompt').text(this.rule)
    }
    blurHandler(evt) {
        let inputVal = this.$input.val()
        let res = this.validator(inputVal)
        if (res.code == 'success') {
            this.$input.removeClass('error').addClass('success')
            this.$prompt.removeClass('error').addClass('success').text(res.prompt)
        } else {
            this.$input.removeClass('success').addClass('error')
            this.$prompt.removeClass('success').addClass('error').text(res.prompt)
        }
    }
    validate() {
        this.blurHandler()
        return !this.$prompt.hasClass('error')
    }
}

class Form {
    constructor($el) {
        this.$el = $el
        this.$submit = $el.find('#submit')
        this.init()
        this.forms = []
    }

    init() {
        this.$submit.on('click',this.validate.bind(this))
    }
    validate(){
        let forms = this.forms
        let isValidate = true
        for (let form of forms) {
            if (!form.validate()) {
                isValidate =  false
            }
        }
        if(!isValidate){
            alert('输入有误')
            return false
        }else{
            alert('提交成功')
        }
    }
    addInput({selector, rule, validator}) {
        let input = new Input({
            $el: this.$el.find(selector),
            rule,
            validator
        })
        this.forms.push(input)
    }
}
class Application {
    constructor() {
        this.init()
    }

    init() {
        let form = new Form($('#test'))
        form.addInput({
            selector: '#username-wrap',
            rule: '必填,长度为4-16个字符',
            validator: function (str) {
                if (str.length == 0) {
                    return {
                        code: 'error',
                        prompt: "名称不能为空"
                    }
                } else if (str.length < 4) {
                    return {
                        code: "success",
                        prompt: "名称不能小于4个字符"
                    }
                } else if (str.length > 15) {
                    return {
                        code: 'error',
                        prompt: "名称不能大于15个字符"
                    }
                } else {
                    return {
                        code: 'success',
                        prompt: '名称可用'
                    }
                }
            }
        })
        form.addInput({
            selector: '#password-wrap',
            rule: '必填,密码不能小于6位',
            validator: function (str) {
                if (str.length < 6) {
                    return {
                        code: 'error',
                        prompt: '密码不能小于6位'
                    }
                } else {
                    return {
                        code: 'success',
                        prompt: '密码可用'
                    }
                }
            }
        })
        form.addInput({
            selector: '#password2-wrap',
            rule: '再次输入相同密码',
            validator: function (str) {
                var orig = this.$el.siblings('#password-wrap').find('input').val()
                if (str != orig) {
                    return {
                        code: 'error',
                        prompt: '密码输入不一致'
                    }
                } else {
                    return {
                        code: 'success',
                        prompt: '密码一致'
                    }
                }
            }
        })
        form.addInput({
            selector: '#email-wrap',
            rule: '输入邮箱地址',
            validator: function (str) {
                var rEmail = /\w+\@\w+/
                if (rEmail.test(str)) {
                    return {
                        code: 'success',
                        prompt: '邮箱格式正确'
                    }
                } else {
                    return {
                        code: 'error',
                        prompt: '邮箱格式错误'
                    }
                }
            }
        })
        form.addInput({
            selector: '#phonenum-wrap',
            rule: '请输入手机号码',
            validator: function (str) {
                var rPhoneNum = /\d{11}/
                if (rPhoneNum.test(str)) {
                    return {
                        code: 'success',
                        prompt: '手机格式正确'
                    }
                } else {
                    return {
                        code: 'error',
                        prompt: '手机格式错误'
                    }
                }
            }
        })
    }
}
var app = new Application()