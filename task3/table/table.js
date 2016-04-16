/**
 * Created by yj on 16/4/16.
 */
class Event{
    constructor(){
        this.listeners = {}
    }
    on(type,handler){
        (this.listeners[type] || (this.listeners[type] =[])).push(handler)
        return this
    }
    off(type,handler){
        if(typeof type === 'undefined'){
            this.listeners = {}
        }
        if(typeof handler === 'undefined'){
            this.listeners[type]=[]
        }
        let handlers = this.listeners[type]  || []
        for(let i=handlers.length;i>=0;i--){
            if(handlers[i] === handler){
                handlers.splice(i,1)
            }
        }
    }
    fire(type,data,context){
        let handlers = this.listeners[type]
        for(let handler of handlers){
            handler.call(context|| null,data)
        }
    }
}
class TableSorter extends Event{
    constructor($table,cfg){
        super()
        this.$table = $table
        this.$thead = $table.find('thead')
        this.$tbody = $table.find('tbody')
        this.$tfoot = $table.find('tfoot')
        this.$ths = this.$thead.find('th')
        this.cfg = {
            records: 0, //总行数目
            per_page: 4, //每页显示行数
            max_pages: 10 //每页显示最多的页数
        }
        $.extend(this.cfg,cfg || {})
        this.init()
    }
    init() {

        //初始化数据
        let $row = this.$tbody.find('tr')
        this.rows = [].slice.call($row) //克隆数据,供排序和分页使用
        this.sortType = this.rows.map(el => 1) //排序方式,默认为升序

        //升序和降序标记
        this.$up = $('<div></div>').text('⬆').addClass('up')
        this.$down = $('<div></div>').text('⬇').addClass('down')

        //排序标记
        this.sortIndex = -1

        //分页功能
        this.cfg.records = this.rows.length
        this.page = 1 //当前页码
        this.pages = this.cfg.records / this.cfg.per_page
        this.cols = this.rows[0].cells.length
        //绑定事件
        this.on('sortTable', this.renderUI.bind(this))
        this.on('selectPage', this.renderUI.bind(this))
        this.renderUI()
        this.bindUI()
    }
    renderUI(){
        this.renderHead()
        this.renderBody()
        this.renderFoot(this.page)
    }
    //渲染thead
    renderHead(){
        let index = this.sortIndex
        if(index == -1) return
        this.$down.remove()
        this.$up.remove()
        if(this.sortType[index] === 1){
            this.$ths[index].appendChild(this.$up[0])
        }else{
            this.$ths[index].appendChild(this.$down[0])
        }
    }
    renderBody(){
        let start = (this.page-1)*(this.cfg.per_page)
        let end = start + this.cfg.per_page
        if(end > this.records){
            end = this.records
        }
        this.$tbody.empty()
        this.$tbody.append(this.rows.slice(start,end))
    }

    /**
     *
     * @param index 当前页
     */
    renderFoot(page) {
        this.$tfoot.remove()
        let $tfoot = this.$tfoot =  $('<tfoot>').appendTo(this.$table)
        let $tr = $('<tr><td></td></tr>').appendTo($tfoot)
        let $td = $tr.find('td').attr('colspan',this.cols)
        let $page = $('<div>').addClass('pagination').appendTo($td)
        if(page <= 1){
            let $pre = $('<span>').addClass('pre_page').text('<<').appendTo($page)
            $pre.addClass('disabled')
        }else{
            let $pre = $('<a href="javascript:void 0"></a>').addClass('pre_page').text('<<').appendTo($page)
            $pre.data('page',page-1)
        }

        let pages = Math.ceil(this.cfg.records / this.cfg.per_page)

        for (let i = 1; i <= pages; i++) {
            let $span = $(`<a href="javascript:void 0">${i}</a>`).appendTo($page).data('page',i)
            if(i == page){
                $span.addClass('selected')
            }
        }

        if(page >= this.pages){
            let $next = $('<span>').addClass('next_page').text('>>').appendTo($page)
            $next.addClass('disabled')
        }else{
            let $next = $('<a href="javascript:void 0">').addClass('next_page').text('>>').appendTo($page)
            $next.data('page',page+1)
        }
    }
    bindUI(){
        let self = this

        //排序事件绑定
        this.$thead.on('click','th',function(){
            let index = $(this)[0].cellIndex
            self.sortIndex = index
            self.sortType[index] *= -1 //改变指定列的排序方式
            self.rows.sort(self.sortBy(index,self.sortType[index]))
            self.fire('sortTable')

        })
        //分页事件绑定
        this.$table.on('click','tfoot a',function(evt){
            let page = $(this).data('page')
            self.page = page
            self.fire('selectPage')
        })
        //enter/leave事件绑定/css搞定
    }

    /**
     * 根据索引和排序方式进行排序
     * @param index //排序关键字索引
     * @param order //排序方式: 1表示升序,-1表示降序
     * @returns {Function}
     */
    sortBy(index,order){
        function format(s){
            return s //todo 根据数据类型进行排序
        }
        return function(row1,row2){
            let value1 = format(row1.cells[index].firstChild.nodeValue)
            let value2 = format(row2.cells[index].firstChild.nodeValue)
            return (typeof value1 === 'string' ? value1.localeCompare(value2) : value1 - value2)*order
        }
    }
}
class Application{
    constructor(){
        let sortTable = new TableSorter($('table'))
    }
}
let app = new Application()