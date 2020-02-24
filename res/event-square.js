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
            commands.forEach((command) => {
                if (command.action == "insert") {
                    consumer.addItem(command.type, command.model)
                }
            })
        })
        return commands
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
