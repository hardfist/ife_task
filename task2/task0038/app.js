/**
 * Created by yj on 16/4/5.
 */
class Application{
    constructor(){
        this.$random = $('#random')
        this.$run = $('#run')
        this.$reset = $('#reset')
        this.$next = $('#next')
        this.init()
        this.reset()
    }
    reset(){
        this.queue = []
        this.running = false
        this.sorted = false
        $('#container').empty()
    }
    init(){
        this.$random.on('click',this.random.bind(this))
        this.$run.on('click',this.run.bind(this))
        this.$next.on('click',this.next.bind(this))
        this.$reset.on('click',this.reset.bind(this))
    }
    run(){
        this.sort()
        if(!this.running){
            this.taskloop()
        }
    }
    _swap(i,j){
        var cells = this.$cells
        ;[cells[i].style.height,cells[j].style.height] = [cells[j].style.height,cells[i].style.height]
    }
    sort(){
        let arr =this.arr
        for(let i=0;i<arr.length;i++){
            for(let j=i;j>0 && arr[j] < arr[j-1];j--){
                [arr[j],arr[j-1]] = [arr[j-1],arr[j]]
                this.queue.push({
                    fn: this._swap,
                    args: [j,j-1]
                })
            }
        }
        this.sorted =true
    }
    random(){
        this.reset()
        const n = 30
        let arr = []
        for(let i=0;i<n;i++){
            arr[i] = Math.floor(Math.random()*99+1)
        }
        this.arr = arr
        for(let i=0;i<n;i++){
            (($('<div></div>').addClass('cell').height(arr[i]))).appendTo($('#container'))
        }
        this.$cells = $('.cell')
    }
    taskloop(){
        this.running = true 
        setTimeout(function inner(){
            let task  = this.queue.shift()
            if(task){
                let {fn,args} = task
                fn.apply(this,args)
                if(this.queue.length > 0){
                    setTimeout(inner.bind(this),10)
                }else{
                    this.running = false
                }
            }else{
                this.running = false 
            }
            
        }.bind(this))
    }
    next(){
        if(!this.sorted){
            this.sort()
        }
        if(!this.running){
            let task = this.queue.shift()
            if(task){
                let {fn,args} = task
                fn.apply(this,args)
            }
        }
    }
}
var app = new Application()