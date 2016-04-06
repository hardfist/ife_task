/**
 * Created by yj on 16/3/24.
 */
var queue = [] //dom操作队列
var timer = null //全局动画计时器,用于防止同时启动多个动画
// 树节点
function Node(val){
    this.val = val
    this.child = []
    this.dom = null
    this.parent = null
}
//
function visitor(root){
   queue.push(root)
}
// 初始化数据
function reset(){
    queue = []
    $("#container * .box").attr("class","box")
}

// 运行dom操作
function start_animation(callback){
    var interval = 100
    timer = setTimeout(function animation(){
        if(queue.length) {
            var $dom = queue.shift().dom
            $dom.addClass("visited")
            setTimeout(function(){
                $dom.removeClass("visited")
            },interval)
            setTimeout(animation,interval)
        }else{
            if(typeof callback == "function"){
                callback()
            }
            timer = null
        }
    },interval)
}
//随机产生孩子数目
function random_child_num(){
    return Math.floor(Math.random()*2)+1
}
// 随机构造一颗树
function random_build_tree(){
    var n = 20;
    var arr = []
    for(var i=0;i<n;i++){
        arr.push(Math.floor(Math.random()*100))
    }
    var queue = []
    var k = 0
    var root = new Node(arr[k++])
    queue.push(root)

    while(queue.length > 0 && k<n){
        var child_num = random_child_num()
        var front = queue.shift()
        var i =0;
        while(k<n && i<child_num){
            front.child[i] = new Node(arr[k++])
            front.child[i].parent = front
            queue.push(front.child[i])
            i++;
        }
    }
    return root;
}
// 先序遍历树
function preorder(root,visit_fn){
    if(root != null) {
        visit_fn(root)
        root.child.forEach(function (el) {
            preorder(el, visit_fn)
        })
    }
}
// 后序遍历树
function postorder(root,visit_fn){
    if(root != null) {
        root.child.forEach(function (el) {
            postorder(el, visit_fn)
        })
        visit_fn(root)
    }
}
// 渲染树并将dom与数据进行双向绑定
function render_tree(root) {

    // 递归构造子例程
    function render_tree_recr(root) {
        var $self = $("<div></div>")
            .addClass("box")
            .prepend(`<span>${root.val}</span>`).data('node',root)
        root.dom = $self
        root.child.forEach(function (el) {
            render_tree_recr(el).appendTo($self)
        })
        return $self
    }

    //判断是否已存在树,若存在则清空
    if($("#container").length > 0){
        $("#container").empty()
    }
    var $root = render_tree_recr(root)
    $root.appendTo($("#container"))
}
function deleteNode(el){
    var root = el.data("node")
    if(root == null){
        throw new Error("不能删除一个空节点")
    }
    if(root.parent == null){
        root = null
        $("#container").empty()
    }else{
        var index = root.parent.child.indexOf(root)
        root.parent.child.splice(index,1)
        root.dom.remove()
    }
}
function addNode(el){
    var root = el.data("node")
    var val = $("#add_input").val()
    var new_child = new Node(val)
    root.child.push(new_child)
    new_child.parent = root
    var $node = $("<div></div>").addClass("box").text(val).appendTo(el).data("node",new_child)
    new_child.dom = $node
}
// 查找处理函数
function search_handler(root){
    var found = null
    function search(root,val){
        if(root != null){
            if(root.val == val){
                found = root
                return true
            }
            queue.push(root)
            for(var i=0;i<root.child.length;i++){
                if(search(root.child[i],val)){
                    return true;
                }
            }
        }

    }
    function callback(){
        if(found == null){
            alert("对不起,找不到你所需要的数字")
        }else{
            found.dom.addClass("search")
        }
    }
    reset()
    search(root,$("#search_input").val())
    start_animation(callback)
}
//初始化
function init(){
    var root = null
    $("#random_build").on("click",function(){
        root = random_build_tree()
        render_tree(root)
    })
    $("#search").on("click",function(){

    })
    $("#preorder").on("click",function(){
        reset()
        preorder(root,visitor)
        start_animation()
    })
    $("#postorder").on("click",function(){
        reset()
        postorder(root,visitor)
        start_animation()
    })
    $("#search").on("click",function(){
        search_handler(root)
    })
    $("#delete").on("click",function(){
        deleteNode($("#container .selected"))
    })
    $("#add-btn").on("click",function(){
        addNode($("#container .selected"))
    })
    $("#container").on("click",function(evt){
        if($(evt.target).hasClass("box")){
            $("#container .box").removeClass("selected")
            $(evt.target).addClass("selected")
        }
    })
}
init()
