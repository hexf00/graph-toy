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


        if (!ControlStatus) {
            const selectedNodes = graph.findAllByState('node', 'selected');
            selectedNodes.forEach(cn => {
                graph.setItemState(cn, 'selected', false);
            });
        }

        

        graph.setItemState(item, 'selected', !item.hasState('selected'));

        // VUE面板用
        app.currentType = "Node";
        app.currentItem = item.getModel();
    },
});