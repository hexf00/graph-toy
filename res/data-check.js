
//数据检查

//检查边重复


//检查自连接
function dumpSelfEdges(){
    var data = graph.save();
    var selfEdges = data.edges.filter((edge)=>{
        let {source, target} = edge;
        return source == target;
    });

    console.table(selfEdges);
}
//删除自连接
function deleteSelfEdges(){
    var data = graph.save();
    data.edges = data.edges.filter((edge, index)=>{
        let {source, target} = edge;
        return source !== target;
    });

    graph.changeData(data);
}