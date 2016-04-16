/**
 * Created by yj on 16/4/16.
 */
class Event{
    constructor(){
        this._listeners = []
    }
    on(type,handler){
      this._listeners.push({type,handler})
    }
    fire(state){
        for(let {type,handler} of this._listeners){
            handler(state)
        }
    }
}
class Store extends Event{
    constructor(){
        super()
        this._state = state
    }
    setState(state){
        this._state = state
        this.fire(state)
    }
    getState(){
        return this._state
    }
}
function createElement(tag,attrs,children){
    let $el = $(`<${tag}>`)
    for(let key in  attrs){
        let val = attrs[key]
        if(key.indexOf('on') === 0){
            let event = key.substr(2).toLowerCase()
            $el.on(event,val)
        }else{
            $el.attr(key,val)
        }
    }
    return $el.append(children)
}
function ItemRow(props){
    var className = props.completed ? 'item completed' : 'item'

    return createElement('li',{
        id: props.id,
        class: className,
        onClick: props.onUpdate.bind(null,props.id)
    },props.text)
}
function ItemList(props){
    return createElement('ul',{}
        ,props.items.
        map(el =>$.extend(el,{onUpdate: props.onUpdate})).
        map(ItemRow))
}
function render(props,node){
    function updateState(toggleId) {
        state.items.forEach(function (el) {
            if (el.id === toggleId) {
                el.completed = !el.completed
            }
        })
        store.setState(state)
    }
    (node || $('body')).empty().append(ItemList({
        items: props.items,
        onUpdate: updateState
    }))
}
let state = {items: [],id: 0}
let store = new Store(state)
store.on('rootRender',function(state){
    render(state,$('#list'))
})
$('#list').on('click','.item',function(){
    let toggleId = parseInt($(this).attr('id'))
    state.items.forEach(function(el){
        if(el.id === toggleId){
            el.completed = !el.completed
        }
    })
    store.setState($.extend({},state))
})
function SearchBar(props){
    function onButtonClick(e){
        var val = $('#input').val()
        $('#input').val('')
        props.update(val)
        e.preventDefault()
    }
    var input = createElement('input',{id: 'input'})
    var button = createElement('button',{
        id: 'add',
        onClick: onButtonClick.bind(null)
    },'Add')
    return createElement('div',{},[input,button])
}
var bar = SearchBar({
    update:function(val){
        state.items.push({
            id: state.id++,
            text:val
        })
        store.setState(state)
    }
})
$('#app').append(bar).append($('<ul id="list">'))