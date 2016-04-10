class Control{
    constructor(){
        this.$control = $('#control')
        this.$orbits = $('.orbit')
        this.$panels = $('#control .panel')
        this.ships = []
        for(let i=0;i<4;i++){
            this.ships[i] = new Ship($(this.$orbits[i]).find('.ship'))
            this.setState(i,'destroy')
            this.ships[i].destroy()
        }
        this.bind()
    }
    //事件绑定
    bind(){
        let self = this
        this.$control.find('[data-id]').on('click',function(evt){
            let id = $(this).data('id')
            let cmd = evt.target.className
            switch(evt.target.className){
                case 'create':
                    self.ships[id].create()
                    self.setState(id,'create')
                    break
                case 'destroy':
                    self.ships[id].destroy()
                    self.setState(id,'destroy')
                    break
                case 'set-speed':
                    let speed = $(self.$panels[id]).find('.speed').val()
                    self.ships[id].setSpeed(speed)
                    break
                case 'fly':
                    self.ships[id].fly()
                    self.setState(id,'fly')
                    break
                default:
                    break;
            }
        })
    }
    setState(id,state){
        this.state = state
        function reset($el){
            $el.find(':button').prop('disabled',false)
        }
        let panel = $(this.$panels[id])
        reset(panel)
        switch(state){
            case 'destroy':
                //禁用销毁飞船,飞行按钮
                reset(panel)
                panel.find('.destroy').prop('disabled',true)
                panel.find('.fly').prop('disabled',true)
                break
            case 'create':
                panel.find('.create').prop('disabled',true)
                break
            case 'fly':
                panel.find('.fly').prop('disabled',true)
        }
    }
}
//太空飞船
class Ship{
    constructor($el,control){
        this.$el = $el
        this.speed = 100
        this.energy = 100
        this.engine = 1000
        this.deg = 0
        this.state = 'destroyed'
        this.control = control
        this.timer = null
    }
    setSpeed(speed = 100){
        this.speed = speed
    }
    reset(){
        this.deg = 0
        this.timer =null
        this.energy = 100
    }
    render(){
        this.$el.find('.ship-title').text(this.energy)
        this.$el.css({
            'transform': `rotate(${this.deg}deg)` + `translate(-50%,-50%)`
        })
        this.$el.find('.ship-mask').css({
            width: this.energy + '%'
        })
    }
    fly(){
        this.timer = setInterval(function consume(){
            //继续飞行
            if(this.energy >= 0){
                this.energy--
                this.deg++
                this.render()
            }else{
                //停下来充电
                clearInterval(this.timer)
                this.timer = setInterval(function powerUp(){
                    this.energy++
                    this.render()
                    if(this.energy >=100){
                        clearInterval(this.timer)
                        this.timer = setInterval(consume.bind(this),1000/this.speed)
                    }
                }.bind(this),1000/this.speed)
            }
        }.bind(this),1000/this.speed)
    }
    destroy(){
        clearInterval(this.timer)
        this.timer = null
        this.$el.hide()
    }
    create(){
        this.reset()
        this.render()
        this.$el.show()

    }
}
class Application{
    constructor(){
        this.init()
    }
    init(){
        let control = new Control()
    }
}
var app = new Application()