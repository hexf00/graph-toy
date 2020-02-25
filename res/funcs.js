function relayout(el) {
    var currentNodeId = $(el).data('id');
    var node = graph.findById(currentNodeId);
    // console.log();
    subLayout(node.getModel());
}
// 参考g6.antv.vision/zh/examples/net/layoutMechanism#subgraphLayout
// yuque.com/antv/g6/qopkkg#eYZc6
function subLayout(centerNode) {

    const data = graph.save(); //最新数据




    const nodes = data.nodes;
    const edges = data.edges;

    const newNodes = []; //被用来参加子图布局计算的节点
    const newEdges = [];
    const newNodeMap = new Map(); //

    //这句不懂 暂时保留
    // fix the nodes[0]
    // nodes[0].fx = nodes[0].x;
    // nodes[0].fy = nodes[0].y;


    //获取选择中的节点

    console.log()

    graph.findAllByState('node', 'selected').forEach(function (node, i) {
        var nodeModel = node.getModel();
        // nodeModel.fx = nodeModel.x;
        // nodeModel.fy = nodeModel.y;

        // nodeModel.x = null;
        // nodeModel.y = null;
        newNodes.push(nodeModel);
        newNodeMap.set(node.getModel().id, i);
    });


    // add the nodes which should be re-layout
    // nodes



    console.log(newNodes, newNodeMap);

    // add related edges
    // 只要有关系都带进来
    edges.forEach(function (edge) {
        const sourceId = edge.source;
        const targetId = edge.target;
        if (newNodeMap.get(sourceId) !== undefined && newNodeMap.get(targetId) !== undefined) {
            newEdges.push(edge);
        }
    });

    const subForceLayout = new G6.Layout.force({
        center: [centerNode.x, centerNode.y],
        linkDistance: 200,
        preventOverlap: true,
        // nodeSize: 20,
        tick: function tick() {
            // the tick function to show the animation of layout process
            graph.refreshPositions();
        }
    });

    //下面布局算法需要手动调用graph.refreshPositions();

    // const subForceLayout = new G6.Layout.radial({
    //     center: [centerNode.x,centerNode.y],
    //     unitRadius: 120,
    //     preventOverlap:false,
    //     nodeSize:200,
    //     nodeSpacing:50,

    // });


    // dagre算法没有中心节点参数指定
    // const subForceLayout = new G6.Layout.dagre({
    //     nodeSize: [40, 20],
    //     nodesep: 1,
    //     ranksep: 1
    // });




    subForceLayout.init({
        nodes: newNodes,
        edges: newEdges
    });
    subForceLayout.execute();

}


rule_selected = function (el) {
    var currentNodeId = $(el).data('id');

    //选择该节点的指向节点
    graph.getEdges().forEach(edge => {
        const sourceId = edge.getModel().source;
        const targetId = edge.getModel().target;

        if (sourceId === currentNodeId) {
            graph.setItemState(targetId, 'selected', true);
        }
    })
}

//隐藏edge
hide = function (el) {
    const clickEdges = graph.findAllByState('edge', 'selected');
    clickEdges.forEach(item => {
        graph.setItemState(item, 'selected', false);

        item.hide();
        graph.updateItem(item, {
            visible: false, //不可见
        })
        graph.refreshItem(item)

    });
}