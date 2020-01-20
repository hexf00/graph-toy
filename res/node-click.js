G6.registerBehavior('node-click', {
    getEvents() {
        return {
            'node:click': 'onClick',
        };
    },
    onClick(e) {
        e.preventDefault();
        if (!this.shouldUpdate.call(this, e)) {
            return;
        }
        const { item } = e;
        const graph = this.graph;

        console.log(e);


        // if (!ControlStatus) {
            //关闭多选
            const selectedNodes = graph.findAllByState('node', 'selected');
            selectedNodes.forEach(cn => {
                graph.setItemState(cn, 'selected', false);
            });
        // }

        graph.setItemState(item, 'selected', true);

        // VUE面板用
        app.currentType = "Node";
        app.currentItem = item.getModel();
    },
});