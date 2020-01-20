

//双击空白新建节点
G6.registerBehavior('shortcut-keys', {
    getEvents() {
        return {
            'keydown': 'keydown',
        };
    },
    keydown(e) {
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
            var addNode = () => {
                var id = new Date().getTime() + parseInt(Math.random() * 1000).toString();


                //因为需要手动指定x,y 无法调用布局方法

                graph.addItem('node', {
                    id: id,
                    realId: id,
                    label: '新节点',
                    x: nodes[0].getModel().x + 100,
                    y: nodes[0].getModel().y
                })
                //该方式加入的节点必须要传入x/y ，并且调用graph.layout()并不会重新布局

                return id;
            }

            var id = addNode();

            graph.addItem('edge', {
                source: nodes[0].getModel().id,
                target: id
            });





        }


    },
});

