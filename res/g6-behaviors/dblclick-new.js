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


        //构建数据
        var newNodeId = uuidv4();
        var newNode = {
            id: newNodeId,
            realId: newNodeId,
            label: '新节点',
            x: e.x,
            y: e.y
        }

        if (graph.get('dataLayer')) {
            graph.get('dataLayer').batch([
                {
                    type: 'node',
                    action: 'insert',
                    model: newNode
                }
            ])
                // .then(graphAction) //对画布的操作在事件广场进行
                .catch((err) => {
                    //终止链
                    console.error("g6 双击新增节点 时出错")
                })
        } else {
            graph.addItem(newNode)
        }


    },
});
