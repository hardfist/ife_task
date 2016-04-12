/**
 * Created by yj on 16/4/12.
 */
class Widget{
    constructor(){
        this.listeners = {}
        this.boundingBox = null
    }
    //监听事件
    on(type,handler){
        this.listeners[type] || (this.listeners[type] = [])
        this.listeners[type].push(handler)
        return this 
    }
    //触发事件
    fire(){
        let handlers = this.listeners[type] || []
        for(let handler of handlers){
            handler && handler()
        }
        return this 
    }
    render(container){
        this.boundingBox && this.boundingBox.remove() //清除以前
        this.renderUI()
        this.listeners = {}
        this.bindUI()
        this.syncUI()
        $(container ||document.body).append(this.boundingBox)
        return this 
    }
    destroy(){
        this.destructor()
        this.boundingBox.off() //绑定事件清空
        this.boundingBox.remove()
        return this 
    }
    /*******  接口分割线 *****/
    /**
     * Interface:添加dom节点
     */
    renderUI(){
        
    }

    /**
     * Interface:绑定事件
     */
    bindUI(){
        
    }

    /**
     * Interface:初始化组件属性
     */
    syncUI(){
        
    }

    /**
     * Interface:销毁前的处理函数
     */
    destructor(){

    }
}
class Table extends Widget{
    constructor(){
        super()
        this.cfg = {
            caption: '点击各单元进行排序',
            headers: ['姓名', '语文', '数学', '英语','政治', '总分'],
            rows: [
                ['灰灰', 90, 90, 90, 65, 335],
                ['胖达', 91, 92, 93, 94, 370],
                ['小白', 70, 80, 90, 100, 340]
            ],
            skinName:''
        }
    }
    _validateData(){
        return true
    }
    renderUI(){
        if(!this._validateData()){
            alert('数据不合法')
            throw new Error('invalid data')
        }
        this.boundingBox = $('<table></table>').addClass('table')
        if(this.cfg.skinName){
            this.boundingBox.addClass(this.cfg.skinName)
        }
        $('<caption></caption>').text(this.cfg.caption).appendTo(this.boundingBox)

        let $thead  = this._thead = this._$thead= $('<thead></thead>')
            .appendTo(this.boundingBox)

        let $tr = $('<tr></tr>').appendTo($thead)
        for(let header of this.cfg.headers){
            let $td = $('<td></div></td>')
                .text(header)
                .appendTo($tr)
            
            $('<div></div>').addClass('table_ascend')
                .appendTo($td)
            
            $('<div></div>').addClass('table_descend')
                .appendTo($td)

        }

        let $tbody =  this._tbody = $('<tbody></tbody>').appendTo(this.boundingBox)
        for(let row of this.cfg.rows){
            let $tr = $('<tr></tr>').appendTo($tbody)
            for(let col of row){
                $('<td></td>').text(col).appendTo($tr)
            }
        }
        return this
    }
    bindUI(){
        let self =this
        this._thead.on('click','.table_ascend,.table_descend',function(){
            let orderType = $(this).hasClass('table_ascend') ? 1 : -1
            let val = $(this).parent().text()
            let index = self.cfg.headers.indexOf(val)
            self.cfg.rows.sort(function(lhs,rhs){
                return (lhs[index] -rhs[index]) * orderType
            })
            self.render()
        })
        return this
    }
    syncUI(){

    }
    static generateTable(cfg){
        let self = new Table()
        $.extend(self.cfg,cfg)
        self.render()
        return self
    }
}
class Application{
    constructor(){
        this.init()
    }
    init(){
        let table = null
        $('#skin_a,#skin_b').on('click',(function() {
            let skinName = $(this).attr('id')
            if(table){
                table.destroy()
            }
            table = Table.generateTable({
                skinName
            })
        }))
    }
}
let app = new Application()