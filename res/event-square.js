// 事件广场


// 负责 数据层、各数据消费实例 之间的联通、数据同步工作
// 本身不存储任何数据

var EventSquare = function (producer) {

    //数据生产者
    this.producer = producer

    //数据消费者
    this.consumers = []

    this.producer.on("batch", (commands) => {
        this.consumers.forEach((consumer) => {
            var graph = consumer;

            const autoPaint = graph.get('autoPaint');
            graph.setAutoPaint(false);

            commands.forEach((command) => {
                if (command.action == "insert") {
                    graph.addItem(command.type, Object.assign({}, command.model))
                } else if (command.action == "delete") {
                    graph.removeItem(graph.findById(command.id))
                } else if (command.action == "update") {
                    graph.updateItem(graph.findById(command.id), command.model)
                } else {
                    console.error("未知command类型", command)
                }
            })

            graph.paint();
            graph.setAutoPaint(autoPaint);
        })
        return commands
    }).on("batch", (commands) => {
        console.log(`操作更新了${commands.length}条数据，注意及时保存。`)
    })

}

// 注册G6实例，未来可以有别的实例
EventSquare.prototype.addGraph = function (graph) {
    this.consumers.push(graph)
}

// 注销G6实例，未来可以有别的实例
EventSquare.prototype.removeGraph = function (graph) {
    var graphIndex = this.consumers.indexOf(graph)
    if (graphIndex !== -1) {
        this.consumers.splice(graphIndex, 1)
    }
}
