var ControlStatus = false;
document.onkeydown = function (event) {
    var e = event || window.event || arguments.callee.caller.arguments[0];
    if (e && e.key == 'Control') { // 按 Esc 
        //要做的事情
        ControlStatus = true;
    }
};
document.onkeyup = function (event) {
    var e = event || window.event || arguments.callee.caller.arguments[0];
    if (e && e.key == 'Control') { // 按 Esc 
        //要做的事情
        ControlStatus = false;
    }
};

G6.registerBehavior('item-click', {
    getEvents() {
        return {
            'node:click': 'nodeClick',
            'edge:click': 'edgeClick',
        };
    },
    nodeClick(e) {
        e.preventDefault();
        if (!this.shouldUpdate.call(this, e)) {
            return;
        }
        const { item } = e;
        const graph = this.graph;


        if (!ControlStatus) {
            this.cleanSelected()
        }

        graph.setItemState(item, 'selected', !item.hasState('selected'));

        if (graph.get('eventSquare')) {
            graph.get('eventSquare').emit("g6FocusItem", { type: "node", model: e.item.getModel() })
        }
    },

    // 监听鼠标点击边
    edgeClick(e) {
        const graph = this.graph;

        if (!ControlStatus) {
            this.cleanSelected()
        }

        const edgeItem = e.item;
        // 设置目标边的 click 状态 为 true
        graph.setItemState(edgeItem, 'selected', true);

        if (graph.get('eventSquare')) {
            graph.get('eventSquare').emit("g6FocusItem", { type: "edge", model: e.item.getModel() })
        }
    },
    // 先将所有当前有 click 状态的边/节点 的 click 状态置为 false
    cleanSelected() {
        const graph = this.graph;

        const selectedNodes = graph.findAllByState('node', 'selected');
        selectedNodes.forEach(cn => {
            graph.setItemState(cn, 'selected', false);
        });

        const clickEdges = graph.findAllByState('edge', 'selected');
        clickEdges.forEach(ce => {
            graph.setItemState(ce, 'selected', false);
        });
    }
});