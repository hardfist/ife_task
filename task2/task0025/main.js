/**
 * Created by yj on 16/3/26.
 */
class Node{
    constructor(val,parent){
        this.val = val  //节点值
        this.children = [] //节点的孩子节点
        this.$self = null //节点的dom结构
        this.EVENTS = {
            // selector:{ eventtype: callback}
            ".box":{
                mousedown:function(self,e){
                    console.log("I'm clicked")
                }
            }
        }
    }
    setUp(){

    }
    //绑定事件
    bind(events){
        for(var selector in events){
            for(var evtType in events[selector]){
                var handler = events[selector][evtType]
                this.add(evtType,selector,handler)
            }
        }
    }
    //监听事件
    // add(evtType,[selector],handler)
    add(){
        var evtType,selector,handler
        evtType = arguments[0]
        if(typeof arguments[1] == 'function'){
            selector = undefined
            handler = arguments[1]
        }else{
            selector = arguments[1]
            handler = arguments[2]
        }
        this.$self.on(evtType,selector,handler)
    }
    //渲染节点
    // TODO 这里以后可以用自定义模板进行渲染
    render(){
        //判断是否已渲染过
        if(this.$self) return this.$self
        var $self = $("<div></div>")
            .addClass("box")
        $(`<div><div class="close_btn close_btn_open"></div><div class="val">${this.val}</div></div>`).prependTo($self)
        this.children.forEach(function(el){
            el.render().appendTo($self)
        })
        //双向绑定数据
        $self.data("node",this)
        this.$self = $self

        return $self
    }
    //添加孩子节点
    addChild(node){
        this.children.push(node)
        var $self = this.render()
        var $node = node.render()
        $self.append($node)
    }
    //删除孩子节点
    removeChild(node){
        var index = this.children.indexOf(node)
        this.children.splice(index,1)
        var $node = node.$self
        $node.remove()
    }
    //收起孩子节点
    closeChild(){
        var $self = this.$self
        $self.children(".box").addClass("hidden")
    }
    //展开孩子节点
    openChild(){
        var $self = this.$self
        $self.children(".box").removeClass("hidden")
    }

    //初始化
    setUp(){

    }
    /*************静态方法分割线*******/

    //静态方法
    static build_random_tree(n){
        var arr = []
        for(var i=0;i<n;i++){
            arr[i] = Math.floor(Math.random()*1000)
        }
        var k = 0
        var root = new Node(arr[k++])
        var queue = []
        queue.push(root)
        while(queue.length > 0 && k < n){
            var front = queue.shift()
            var random_num = Math.floor(Math.random()*6+1)
            for(var j=0;j<random_num && k<n;j++,k++){
                front.children[j] = new Node(arr[k])
                queue.push(front.children[j])
            }
        }
        return root
    }
    //打印测试
    static print(root){
        var res = []
        function preorder(root){
            if(root){
                res.push(root)
                root.children.forEach(el => { preorder(el)})
            }
        }
        preorder(root)
        var arr = res.map(el => {return el.val})
        console.log(arr)
    }
    //一个小测试
    static demo(){
        var root = Node.build_random_tree(20)
        var $root = root.render()
        $root.appendTo($("#container"))
        root.bind({
            ".box":{
                "mousedown": function(evt){
                    if($(evt.target).hasClass("close_btn")){
                        if($(this).prop("closed")){
                            $(evt.target).attr("class","close_btn close_btn_close")
                            $(this).data("node").openChild()
                            $(this).prop("closed",false)
                        }else{
                            $(evt.target).attr("class","close_btn close_btn_open")
                            $(this).data("node").closeChild()
                            $(this).prop("closed",true)
                        }
                    }else {
                        console.log("clicked")
                    }
                    return false
                }
            },
        })
    }
}
function init() {
    $("#build_tree_btn").on("click", function (evt) {
        Node.demo()
    })
}
init()