/**
 * Created by yj on 16/4/13.
 */
class JigSaw{
    constructor(){
        this.cfg = {
            width: 400,
            height: 300,
            images:[]
        }
        this.boundingBox = null
    }
    render(container){
        this.renderUI()
        $(container || document.body).append(this.boundingBox)
    }
    setPic(img){
        
    }
    renderUI(){
        let images = this.cfg.images
        let length = images.length
        this.boundingBox = $('<div></div>')
            .width(this.cfg.width)
            .height(this.cfg.height)
            .addClass('JigSaw')
            .addClass(`skin_${length}`)
        for(let i=0;i<images.length;i++){
            $('<img>').attr('src',images[i])
                .addClass(`pic${i+1}`)
                .appendTo(this.boundingBox)
        }
    }
    static generateJigSaw(cfg){
        let self = new JigSaw()
        $.extend(self.cfg,cfg)
        self.render()
    }
}
class Application{
    constructor(){
        this.init()
    }
    init(){
        let cfg = {images: []}
        for(let i=0;i<6;i++){
            cfg.images.push(`./img/pic${i+1}.jpg`)
            JigSaw.generateJigSaw(cfg)
        }
    }
}
let app = new Application()