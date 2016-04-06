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
}
//
function visitor(root){
   queue.push(root)
}
// 初始化数据
function reset(){
    queue = []
    $("#container  *").css({
        background: "white"
    })
}

// 运行dom操作
function start_animation(callback){
    var interval = 100
    if(timer != null){
        return;
    }
    timer = setInterval(function animation(){
        if(queue.length) {
            var $dom = queue.shift().dom
            $dom.css({
                background: "blue"
            })
            setTimeout(function(){
                $dom.css({
                    background: "white"
                })
            },interval)
        }else{
            if(typeof callback == "function"){
                callback()
            }
            clearTimeout(timer)
            timer = null;
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
// 渲染树并关联dom节点
function render_tree(root) {

    // 递归构造子例程
    function render_tree_recr(root) {
        var $self = $("<div></div>").addClass("box").prepend(`<span>${root.val}</span>`)
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
        reset()
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
                found.dom.css({
                    background: "red"
                })
            }
        }
        search(root,$("#search_input").val())
        start_animation(callback)

    })
}
init()
