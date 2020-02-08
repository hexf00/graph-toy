
//数据检查




//检查自连接
function dumpSelfEdges() {
    var data = graph.save();
    var selfEdges = data.edges.filter((edge) => {
        let { source, target } = edge;
        return source == target;
    });

    console.table(selfEdges);
}
//删除自连接
function deleteSelfEdges() {
    var data = graph.save();
    data.edges = data.edges.filter((edge, index) => {
        let { source, target } = edge;
        return source !== target;
    });

    graph.changeData(data);
}

//检查边重复
function dumpRepeatEdges() {
    var data = graph.save();

    var repeatEdgesIndex = [];

    for (let edgeAIndex = 0; edgeAIndex < data.edges.length; edgeAIndex++) {
        const edgeA = data.edges[edgeAIndex];

        if (repeatEdgesIndex.indexOf(edgeAIndex) !== -1) {
            continue;
        }

        var repeatEdges = data.edges.filter((edgeB, edgeBIndex) => {
            // if (edgeAIndex == edgeBIndex) {
            //     return false;
            // }
            let { source, target } = edgeB;
            if (source == edgeA.source && target == edgeA.target) {
                repeatEdgesIndex.push(edgeBIndex)
                return true;
            }
        });

        if (repeatEdges.length > 1) {
            //重复边
            console.log(repeatEdges);
        }

    }


}