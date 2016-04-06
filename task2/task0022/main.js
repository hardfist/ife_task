var queue = [] //dom操作队列
var timer = null //全局timer,防止同时启用多个timer
function Node(val,left,right){
    this.val = val;
    this.left = left;
    this.right = right;
    this.dom = null; //关联的dom节点
}

// bst方式插入
function insert(root,val){
    if(root == null){
        return new Node(val)
    }
    if(val < root.val){
        root.left = insert(root.left,val)
    }else{
        root.right = insert(root.right,val)
    }
    return root;
}

/**
 * 中序遍历
 * @param root
 * @param visit
 */
function inorder(root,visit){
    if(root == null) return;
    inorder(root.left,visit)
    visit(root)
    inorder(root.right,visit)
}
/**
 * 先序遍历
 * @param root
 * @param visit
 */
function preorder(root,visit){
    if(root == null) return;
    visit(root);
    preorder(root.left,visit)
    preorder(root.right,visit)
}
/**
 * 后序遍历
 * @param root
 * @param visit
 */
function postorder(root,visit){
    if(root == null) return;
    postorder(root.left,visit)
    postorder(root.right,visit)
    visit(root)
}
/**
 * 开始动画
 */
function start_animation(){
    if(timer != null){
        clearTimeout(timer)
        timer = null
    }
    var interval = 1000;
    timer = setTimeout(function recur(){
        if(queue.length > 0){
            var $el = queue.shift()
            $el.css({
                background : "blue"
            })
            setTimeout(function(){
                $el.css({
                    background: "white"
                })
            },interval)
            setTimeout(recur,interval)
        }
    },interval)
}
// 创建一个完全二叉树
function random_build_full_tree(n){
    // 满二叉树插入
    function insert_full(root,val){
        var queue = []
        if(root == null){
            return new Node(val)
        }
        queue.push(root)
        while(queue.length>0){
            var front = queue.shift()
            if(front.left == null){
                front.left = new Node(val)
                return root
            }
            else if(front.left != null && front.right == null){
                front.right = new Node(val)
                return root
            }
            if(front.left){
                queue.push(front.left)
            }
            if(front.right){
                queue.push(front.right)
            }
        }
        return root;
    }
    var root = null
    for(var i=0;i<n;i++){
        var val = Math.floor(Math.random()*100)
        root = insert_full(root,val)
    }
    return root
}
// 创建一个完全二叉树,方法二
function random_build_full_tree2(n){
    function insert_full2(arr){
        var root = null
        if(arr.length == 0){
            return root
        }
        var k = 0,length = arr.length
        root = new Node(arr[k++])
        var queue = []
        queue.push(root)
        while(queue.length > 0 && k < length){
            var front = queue.shift()
            if(k<length){
                front.left = new Node(arr[k++])
                queue.push(front.left)
            }
            if(k< length){
                front.right = new Node(arr[k++])
                queue.push(front.right)
            }
        }
        return root;
    }
    var root = null
    var arr = []
    for(var i=0;i<n;i++){
        var val = Math.floor(Math.random()*100)
        arr.push(val)
    }
    root = insert_full2(arr)
    return root
}
// 创建一个二叉排序树
function random_build_tree(n){
    var root = null
    for(var i=0;i<n;i++){
        var val =Math.floor(Math.random()*100)
        root = insert(root,val)
    }
    return root
}
//渲染树并关联到dom节点
function render(root){
    function render_tree(root) {
        if (root == null) {
            return
        }
        var $left = render_tree(root.left)
        var $right = render_tree(root.right)
        var $self = $("<div></div>").addClass("box")
        //关联dom节点
        root.dom = $self
        if ($left == null && $right == null) {
            return $self
        }
        else if ($left == null) {
            $right.css({
                width: "100%",
                height: "100%"
            }).addClass("box").appendTo($self)
        }
        else if ($right == null) {
            $left.css({
                width: "100%",
                height: "100%"
            }).addClass("box").appendTo($self)
        }else {
            $left.css({
                width: "48%",
                height: "100%",
                float: "left"
            }).addClass("box").appendTo($self)

            $right.css({
                width: "48%",
                height: "100%",
                float: "right"
            }).addClass("box").appendTo($self)
        }
        return $self
    }
    var $root = render_tree(root)
    $root.appendTo($("#container"))
}
/**
 * 遍历树时的dom操作
 */
function visit_node(root){
    queue.push(root.dom)
}
/**
 * 清除树
 */
function clear(){
    $("#container").empty()
}
/**
 * 初始化
 */
function init(){
    var tree_root = null
    $("#build_tree").on("click",function(){
        $("#container").empty()
        var node_num = $("#node_num").val() == "" ?  10 : +$("#node_num").val()
        tree_root = random_build_full_tree2(node_num)
        render(tree_root)
    })
    $("#clear").on("click",function(){
        $("#container").empty()
    })
    $("#preorder").on("click",function(){
        preorder(tree_root,visit_node)
        start_animation()
    })
    $("#inorder").on("click",function(){
        inorder(tree_root,visit_node)
        start_animation()
    })
    $("#postorder").on("click",function(){
        postorder(tree_root,visit_node)
        start_animation()
    })
    $("#test").on("click",function(){
        preorder(tree_root,visit)
    })
}
init()