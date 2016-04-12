/**
 * Created by yj on 16/4/11.
 *
 */
class Widget {
    constructor() {
        //监听事件字典
        this.boundingBox = null
        this.handlers = {}

    }

    /**
     * 监听事件
     * @param type
     * @param handler
     * @returns {Widget}
     */
    on(type, handler) {
        this.handlers[type] || (this.handlers[type] = [])
        this.handlers[type].push(handler)
        return this
    }

    /**
     * 触发事件
     * @param type
     * @param data
     * @returns {Widget}
     */
    fire(type, data) {
        let handlers = this.handlers[type] || []
        for (let handler of handlers) {
            handler(data)
        }
        return this
    }

    /**
     * 添加dom节点
     */
    renderUI() {
    }

    /**
     * 监听事件
     */
    bindUI() {

    }

    /**
     * 初始化组件属性
     */
    syncUI() {

    }

    /**
     * 渲染组件
     * @param container
     */
    render(container) {
        this.renderUI()
        this.handlers = {} //清空监听事件
        this.bindUI()
        this.syncUI()
        $(container || document.body).append(this.boundingBox)
        return this
    }

    /**
     * 接口:销毁前的处理函数,
     */
    destructor() {

    }

    /**
     * 销毁组件
     */
    destroy() {
        this.destructor()
        this.boundingBox.off() //?
        this.boundingBox.remove()
        return this
    }
}

//弹窗组件
class Window extends Widget {
    constructor() {
        super()
        //默认配置
        this.cfg = {
            winType: 'alert',
            title: "标题",
            content: "",
            width: 500,
            heght: 300,
            handler4CloseBtn:null,
            handler4ConfirmBtn: null,
            handler4CancelBtn: null,
            handler4PromptBtn: function(data){
                console.log('get Input:',data)
            },
            skinClassName: null,
            hasCloseBtn: false,
            hasMask: true,
            draggable: true,
            dragHandle: ".window_header",
            text4ConfirmBtn: '确定',
            text4CancelBtn: '取消',
            text4PromptBtn: '确定',
            isPromptInputPassword: false,
            defaultValue4PromptInput: "",
            maxLength4PromptInput: 10,
        }
        //私有属性
        this._mask = null //遮罩面板
    }


    destructor() {
        this._mask && this._mask.remove()
    }

    /**
     * 事件绑定
     * @returns {Window}
     */
    bindUI() {

        //绑定自定义事件
        if(this.cfg.handler4ConfirmBtn) {
            this.on('confirm',this.cfg.handler4ConfirmBtn)
        }
        if(this.cfg.handler4CloseBtn) {
            this.on('close',this.cfg.handler4CloseBtn)
        }
        if(this.cfg.handler4CancelBtn) {
            this.on('cancel', this.cfg.handler4CancelBtn)
        }
        if(this.cfg.handler4PromptBtn){
            this.on('prompt',this.cfg.handler4PromptBtn)
        }

        //绑定系统事件
        this.boundingBox.on('click', '.window_confirm_btn', ()=> {
            //触发自定义事件
            this.fire('close')
            this.destroy()
        }).on('click', '.window_close_btn', ()=> {
            this.fire('confirm')
            this.destroy()
        }).on('click', '.window_cancel_btn', ()=> {
            this.fire('cancel')
            this.destroy()
        }).on('click','.window_promptConfirm_btn',()=>{
            this.fire('prompt',this._promptInput.val())
            this.destroy()
        }).on('click','.window_promptCancel_btn',()=>{
            this.fire('prompt',null)
            this.destroy()
        })
        return this
    }

    /**
     * 添加dom节点
     * @param cfg
     * @returns {Window}
     */
    renderUI(cfg) {
        let $boundingBox = $('<div></div>')
            .addClass('window_boundingBox')
        $boundingBox.appendTo($('body'))
        this.boundingBox = $boundingBox


        //创建内部组件

        //body部分
        let $window_body = $('<div></div>')
            .addClass('window_body')
            .text(this.cfg.content)
            .appendTo($boundingBox)
        //如果为prompt则body内部添加input
        if (this.cfg.winType == 'prompt') {
            this._promptInput = $('<input type="input">')
                .addClass('window_body_prompt_input')
                .attr('type',this.cfg.isPromptInputPassword ? 'password' : 'text')
                .val(this.cfg.defaultValue4PromptInput)
                .attr('maxLength',this.cfg.maxLength4PromptInput)
                .appendTo($window_body)
        }

        //首先判断winType是否为common,如果是则跳过后续步骤
        if(this.cfg.winType != 'common') {
            $("<div></div>")
                .addClass('window_header')
                .text(this.cfg.title)
                .appendTo($boundingBox)
        }


        if(this.cfg.winType != 'common') {
            let $window_footer = $('<div></div>')
                .addClass('window_footer')
                .appendTo($boundingBox)

            //根据winType设置footer底部按钮
            switch (this.cfg.winType) {
                case 'alert':
                    $('<input type="button">')
                        .val(this.cfg.text4ConfirmBtn)
                        .addClass('window_confirm_btn')
                        .appendTo($window_footer)
                    break
                case 'confirm':
                    $('<input type="button">')
                        .val(this.cfg.text4ConfirmBtn)
                        .addClass('window_confirm_btn')
                        .appendTo($window_footer)
                    $('<input type="button">')
                        .val(this.cfg.text4CancelBtn)
                        .addClass('window_cancel_btn')
                        .appendTo($window_footer)
                    break
                case 'prompt':
                    $('<input type="button">')
                        .val(this.cfg.text4PromptBtn)
                        .addClass('window_promptConfirm_btn')
                        .appendTo($window_footer)
                    $('<input type="button">')
                        .val(this.cfg.text4CancelBtn)
                        .addClass('window_promptCancel_btn')
                        .appendTo($window_footer)
                    break
                default:
                    break
            }
        }
        //判断是否有遮罩层
        if (this.cfg.hasMask) {
            this._mask = $('<div class="window_mask"></div>')
            this._mask.appendTo("body")
        }

        //判断是否创建关闭按钮
        if (this.cfg.hasCloseBtn) {
            $('<input type="button" value="X">')
                .addClass('window_close_btn')
                .text('X')
                .appendTo($boundingBox)

        }
        return this
    }

    syncUI() {
        //设置样式
        this.boundingBox.css({
            width: this.cfg.width + 'px',
            height: this.cfg.height + 'px',
            left: this.cfg.x || '50%',
            top: this.cfg.y || '50%'
        })
        //设置皮肤
        if (this.cfg.skinClassName) {
            this.boundingBox.addClass(this.cfg.skinClassName)
        }
        //判断是否需要拖动
        /*
        if (this.cfg.draggable) {
            if (this.cfg.dragHandle) {
                this.boundingBox.draggable({
                    handle: this.cfg.dragHandle,
                })
            } else {
                this.boundingBox.draggable()
            }
        }
        */
        return this
    }

    /****** 静态方法分割线 *******/
    static common(cfg){
        let self = new Window()
        $.extend(self.cfg,cfg,{winType: 'common'})
        self.render()
        return self 
    }
    static alert(cfg) {
        //配置属性
        let self = new Window()
        $.extend(self.cfg, cfg, {winType: 'alert'})
        self.render()
        return self
    }

    static confirm(cfg) {
        let self = new Window()
        $.extend(self.cfg, cfg, {winType: 'confirm'})
        self.render()
        return self
    }
    static prompt(cfg){
        let self = new Window()
        $.extend(self.cfg,cfg,{winType: 'prompt'})
        self.render()
        self._promptInput.focus()
        return self
    }
}

class Application {
    constructor() {
        this.init()
    }

    //初始化
    init() {
        $('#alert-btn').on('click', function () {
            Window.alert({
                    content: '这是一个弹窗',
                    handler4ConfirmBtn: function () {
                        alert('你点击了确认按钮')
                    },
                    handler4CloseBtn: function () {
                        alert('你点击了关闭按钮')
                    },
                    hasCloseBtn: true,
                    hasMask: true
                })
                .on('confirm', () => {
                    console.log('log: confirm')
                })
                .on('close', () => {
                    console.log('log:close')
                })
        })
        $('#confirm-btn').on('click', function () {
            Window.confirm({
                    content: '这是一个弹窗',
                    handler4ConfirmBtn: function () {
                        alert('你点击了确认按钮')
                    },
                    handler4CloseBtn: function () {
                        alert('你点击了关闭按钮')
                    },
                    hasCloseBtn: true,
                    hasMask: true
                })
        })
        $('#prompt-btn').on('click',function(){
            Window.prompt({
                title: '请输入您的名字',
                content: '我们将会为您保密您输入的信息',
                width: 300,
                height: 150,
                text4PromptBtn:'输入',
                text4CancelBtn:'取消',
                defaultValue4PromptInput:'张三',
                handler4PromptBtn:function(inputValue){
                    alert('您输入的内容是: '+inputValue)
                },
                handler4CancelBtn:function(){
                    alert('取消')
                }
            })
        })
        $('#common-btn').on('click',function(){
            Window.common({
                content: '我是一个通用弹窗',
                width: 300,
                height: 150,
                hasCloseBtn: true
            })
        })
    }
}
let app = new Application()