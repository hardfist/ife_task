/**
 * Created by yj on 16/4/9.
 */
class Form{
    constructor({label,type,validator,rules,success,fail}){
        this.label = label 
        this.type = type
        this.validator = validator
        this.rules = rules
        this.success = success
        this.fail = fail
        
        this.init(this.label,this.type)
        this.bind()
    }
    init(label,type){
        let $label = $('<label></label>').attr('for',label).text(label)
        let $input = $('<input>').attr('id',label).attr('type',type)
        let $prompt = $('<div></div>').addClass('prompt')
        this.$prompt = $prompt
        this.$input = $input 
        this.$el = $('<div></div>')
            .addClass('wrapper')
            .append($label)
            .append($input)
            .append($prompt)
    }
    bind() {
        this.$input.on('focus', ()=> {
            this.$prompt.text(this.rules)
        })
        function invert(str){
            if(str == 'success'){
                return 'error'
            }else{
                return 'success'
            }
        }
        this.$input.on('blur', ()=> {
            let inputVal = this.$input.val()
            let res = this.validator(inputVal) ? 'success' : 'error'
            this.$prompt
                .addClass(res)
                .removeClass(invert(res))
                .text(this[res])
            this.$input
                .addClass(res)
                .removeClass(invert(res))
        })
    }
}
class Application{
    constructor(){
        this.dataset=[
            {
                label: '用户名',
                type: 'input',
                validator: function(str){
                    return str.length > 0 
                },
                rules:'必要,长度为4-16个字符',
                success: '格式正确',
                fail: '名称不能为空'
            },
            {
                label:'密码',
                type: 'input',
                validator: function(str){
                    return str.length > 10
                },
                rules: '必要密码长度大于10个字符',
                success: '格式正确',
                fail: '名称不能为空'
            }
        ]
        this.init()
    }
    init(){
        let $form = $('form')
        for(let config of this.dataset){
            let input = new Form(config)
            $form.append(input.$el)
        }
    }
}
var app = new Application()