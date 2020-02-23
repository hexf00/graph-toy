

//双击空白新建节点
G6.registerBehavior('shortcut-keys', {
    getEvents() {
        return {
            'keydown': 'keydown',
        };
    },
    keydown(e) {
        if (document.activeElement.getAttribute("type") == "text") {
            return;
        }

        if (e && (e.key == 'Control' || e.key == 'c')) {
            return;
        }

        e.preventDefault();
        if (!this.shouldUpdate.call(this, e)) {
            return;
        }
        const graph = this.graph;


        if (e.key !== "Tab") {
            if (e.key == "Delete") {

                var edges = graph.findAllByState('edge', 'selected');
                var items = graph.findAllByState('node', 'selected');


                if (edges.length == 0 && items.length == 0) {
                    return;
                }
                var operaData = {
                    graph: this.graph.get('container').id,
                    edges: edges.map(edge => edge.getModel()),
                    nodes: items.map(item => item.getModel())
                };




                edges.forEach(edge => graph.removeItem(edge));
                items.forEach(node => graph.removeItem(node));


                //多个图目前没有判断焦点，需要认为给图加入一个焦点判断

                scheduler.emit('afterremoveitem', operaData);

                return;
            }
            return;
        }

        //判断是否为tab键

        //获取选择的节点
        const nodes = graph.findAllByState('node', 'selected');

        if (nodes.length) {

            //构建数据
            var newNodeId = uuidv4();
            var newNode = {
                id: newNodeId,
                realId: newNodeId,
                label: '新节点',
                x: nodes[0].getModel().x + 100,
                y: nodes[0].getModel().y
            }
            var newEdge = {
                id: uuidv4(),
                source: nodes[0].getModel().id,
                target: newNode.id
            }

            //构建动作
            var graphAction = () => {
                this.graph.addItem('node', newNode);
                this.graph.addItem('edge', newEdge);
            }

            if (typeof dataLayer !== undefined) {
                dataLayer.scheduler.emit('batch', [
                    {
                        type: 'node',
                        action: 'insert',
                        model: newNode
                    },
                    {
                        type: 'edge',
                        action: 'insert',
                        model: newEdge
                    },
                ]).then(graphAction).catch((err) => {
                    //终止链
                    console.error("g6 新增节点 时出错")
                })
            } else {
                //没有数据层的情况
                graphAction()
            }






        }


    },
});

