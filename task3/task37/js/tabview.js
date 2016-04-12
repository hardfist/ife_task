/**
 * Created by yj on 16/4/11.
 */
class Widget{
    constructor(){
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
    on(type,handler){
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
    fire(type,data){
        let handlers = this.handlers[type] || []
        for(let handler of handlers){
            handler(data)
        }
        return this
    }

    /**
     * 添加dom节点
     */
    renderUI(){
    }

    /**
     * 监听事件
     */
    bindUI(){

    }

    /**
     * 初始化组件属性
     */
    syncUI(){

    }

    /**
     * 渲染组件
     * @param container
     */
    render(container){
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
    destructor(){

    }

    /**
     * 销毁组件
     */
    destroy(){
        this.destructor()
        this.boundingBox.off() //?
        this.boundingBox.remove()
        return this
    }
}
class Window extends Widget{
    constructor() {
        super()
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
        //私有属性
        this._mask = null //遮罩面板
    }
    alert(cfg){
        //配置属性
        $.extend(this.cfg, cfg)
        this.render()
        return this
    }

    destructor(){
        this._mask && this._mask.remove()
    }
    /**
     * 事件绑定
     * @returns {Window}
     */
    bindUI(){

        //绑定自定义事件
        this.on('confirm',()=>{
            this.cfg.handler4ConfirmBtn && this.cfg.handler4ConfirmBtn()
        })
        this.on('close',()=>{
            this.cfg.handler4CloseBtn && this.cfg.handler4CloseBtn()
        })

        //绑定系统事件
        this.boundingBox.on('click',".window_confirm_btn",()=>{
            //触发自定义事件
            this.fire('close')
            this.destroy()
        }).on('click',".window_close_btn",()=>{
            this.fire('confirm')
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
    syncUI(){
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
        if (this.cfg.draggable) {
            if (this.cfg.dragHandle) {
                this.boundingBox.draggable({
                    handle: this.cfg.dragHandle,
                })
            } else {
                this.boundingBox.draggable()
            }
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
                hasCloseBtn: true,
                hasMask: true
            })
                .on('confirm',() =>{console.log('log: confirm')})
                .on('close',() => {console.log('log:close')})
        })
    }
}
let app = new Application()