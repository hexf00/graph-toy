G6.registerBehavior('item-hover', {
    getEvents() {
        return {
            'node:mouseenter': 'onMouseenter',
            'node:mouseleave': 'onMouseleave',
            'edge:mouseenter': 'onMouseenter',
            'edge:mouseleave': 'onMouseleave',
        };
    },
    // 监听鼠标进入节点
    onMouseenter(e) {
        // 设置目标节点/边的 hover 状态 为 true
        this.get('graph').setItemState(e.item, 'hover', true);
    },
    // 监听鼠标离开节点
    onMouseleave(e) {
        // 设置目标节点/边的 hover 状态 false
        this.get('graph').setItemState(e.item, 'hover', false);
    },
});