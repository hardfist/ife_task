/**
 * Created by yj on 16/4/16.
 */
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
    node.empty().append(ItemList({
        items: props.items,
        onUpdate: updateState
    }))
}
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
function App(props){
    function getInitialState(props){
        return {
            items: [],
            id: 0
        }
    }
    var _state = getInitialState(),
        _node = null;
    function setState(state){
        _state = state
        render()
    }
    function updateSearchState(value){
        _state.items.push({
            id: _state.id++,
            text: value,
            completed: false
        })
        setState(_state)
    }
    function updateState(toggleId){
        _state.items.forEach(function(el){
            if(el.id === toggleId){
                el.completed = !el.completed
            }
        })
        setState(_state)
    }
    function render(){
        var children= [SearchBar({
            update: updateSearchState
        }),ItemList({
            items: _state.items,
            onUpdate: updateState
        })]
        if(!_node){
            return _node = createElement('div',{class: 'main'},children)
        }else{
            return _node.html(children)
        }
    }
    return render()
}
function render(component,node){
    node.empty().append(component)
}
render(App(),$('#app'))