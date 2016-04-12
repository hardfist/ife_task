/**
 * Created by yj on 16/4/11.
 */
class Window {
    constructor() {
        //默认配置
        this.cfg = {
            title: "标题",
            content: "",
            width: 500,
            heght: 300,
            handler4CloseBtn: function () {
                alert('you click the close button')
            },
            handler4ConfirmBtn: function () {
                alert('you click the alert button')
            },
            skinClassName: null,
            hasCloseBtn: false,
            hasMask: false,
            draggable: true,
            dragHandle: ".window_header"
        }
        //监听的事件列表
        this.handlers = {}
    }
    alert(cfg) {
        //配置属性
        $.extend(this.cfg, cfg)

        let $boundingBox = $('<div></div>')
            .addClass('window_boundingBox')
        $boundingBox.appendTo($('body'))

        //创建内部组件
        $("<div></div>")
            .addClass('window_header')
            .text(this.cfg.title)
            .appendTo($boundingBox)

        $('<div></div>')
            .addClass('window_body')
            .text(this.cfg.content)
            .appendTo($boundingBox)

        let $window_footer = $('<div></div>')
            .addClass('window_footer')
            .appendTo($boundingBox)

        $('<input type="button" value="确定">')
            .addClass('window_confirm_btn')
            .appendTo($window_footer)
        //判断是否有遮罩层
        let mask = null
        if (this.cfg.hasMask) {
            mask = $('<div class="window_mask"></div>')
            mask.appendTo("body")
        }
        //判断是否需要拖动
        if (this.cfg.draggable) {
            if (this.cfg.dragHandle) {
                $boundingBox.draggable({
                    handle: this.cfg.dragHandle,
                })
            } else {
                $boundingBox.draggable()
            }
        }

        //绑定自定义事件
        this.on('confirm',()=>{
            this.cfg.handler4ConfirmBtn && this.cfg.handler4ConfirmBtn()
        })
        this.on('close',()=>{
            this.cfg.handler4CloseBtn && this.cfg.handler4CloseBtn()
        })

        //绑定系统事件
        let confirmBtn = $boundingBox.find('.window_footer input')
        confirmBtn.click(()=> {
            //触发自定义事件
            this.fire('close')
            mask && mask.remove()
            $boundingBox.remove()
        })
        //判断是否创建关闭按钮
        if (this.cfg.hasCloseBtn) {
            $('<input type="button" value="X">')
                .addClass('window_close_btn')
                .text('X')
                .appendTo($boundingBox)
            let closeBtn = $boundingBox.find('.window_close_btn')
            closeBtn.click(()=> {
                this.fire('confirm')
                mask && mask.remove()
                $boundingBox.remove()
            })
        }

        //设置皮肤
        if (this.cfg.skinClassName) {
            $boundingBox.addClass(this.cfg.skinClassName)
        }

        //设置样式
        $boundingBox.css({
            width: this.cfg.width + 'px',
            height: this.cfg.height + 'px',
            left: this.cfg.x || '50%',
            top: this.cfg.y || '50%'
        })
        return this 
    }
    //监听事件
    on(type,handler){
        this.handlers[type] || (this.handlers[type] = [])
        this.handlers[type].push(handler)
        return this 
    }
    //触发事件
    fire(type,data){
        let handlers = this.handlers[type] || []
        for(let handler of handlers){
            handler(data)
        }
        return this 
    }
}

class Application {
    constructor() {
        this.init()
    }
    //初始化
    init() {
        $('#btn').on('click', function () {
            let win = new Window()
            win.alert({
                content: '这是一个弹窗',
                handler4ConfirmBtn: function () {
                    alert('你点击了确认按钮')
                },
                handler4CloseBtn: function () {
                    alert('你点击了关闭按钮')
                },
                hasCloseBtn: true
            })
            win.on('confirm',() =>{console.log('log: confirm')})
            win.on('close',() => {console.log('log:close')})
        })
    }
}
let app = new Application()