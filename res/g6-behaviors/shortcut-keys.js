

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

                //构建数据
                var edges = graph.findAllByState('edge', 'selected');
                var nodes = graph.findAllByState('node', 'selected');


                if (edges.length == 0 && nodes.length == 0) {
                    return;
                }

                //构建操作
                var graphAction = () => {
                    edges.forEach(edge => graph.removeItem(edge));
                    nodes.forEach(node => graph.removeItem(node));
                }

                if (graph.get('dataLayer')) {
                    let commands = [];

                    var buildDeleteEdgeCommand = edge => commands.push({
                        type: 'edge',
                        action: 'delete',
                        id: edge.getModel().id,
                        model: edge.getModel(),
                    })
                    edges.forEach(buildDeleteEdgeCommand)

                    nodes.forEach(node => {
                        commands.push({
                            type: 'node',
                            action: 'delete',
                            id: node.getModel().id,
                            model: node.getModel(),
                        })

                        //临时实现:节点的关联边需要一并删除，思考是否在数据层中确保数据一致性
                        node.getEdges().forEach(buildDeleteEdgeCommand)

                    })

                    graph.get('dataLayer').batch(commands)
                        // .then(graphAction) //对画布的操作在事件广场进行
                        .catch((err) => {
                            //终止链
                            console.error("g6 删除节点 时出错")
                        })
                } else {
                    //没有数据层的情况
                    graphAction()
                }

                //多个图目前没有判断焦点，需要认为给图加入一个焦点判断


                return;
            }
            return;
        }

        //判断是否为tab键

        //获取选择的节点
        var nodes = graph.findAllByState('node', 'selected');

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

            if (graph.get('dataLayer')) {
                graph.get('dataLayer').batch([
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
                ])
                    // .then(graphAction) //对画布的操作在事件广场进行
                    .catch((err) => {
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

