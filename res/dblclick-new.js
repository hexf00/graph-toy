G6.registerBehavior('dblclick-new', {
    getEvents() {
        return {
            'canvas:dblclick': 'onDblClick',
        };
    },
    onDblClick(e) {
        e.preventDefault();
        if (!this.shouldUpdate.call(this, e)) {
            return;
        }
        const { item } = e;
        const graph = this.graph;
        var id = new Date().getTime() + parseInt(Math.random() * 1000).toString();
        graph.addItem('node', { id: id, label: "新节点", x: e.x, y: e.y })

        //addItem方法不会重新布局，应该要提供x,y信息
    },
});
