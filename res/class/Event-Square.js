// 事件广场


// 负责 数据层、各数据消费实例 之间的联通、数据同步工作
// 本身不存储任何数据

var EventSquare = function (producer) {

    //数据生产者
    this.producer = producer

    //数据消费者
    this.consumers = {
        g6: [],
        vue: [],
    }

    this.producer.on("batch", (commands) => {
        this.consumers.g6.forEach((consumer) => {
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

    this.scheduler = new Scheduler()

    this.scheduler.on("focusItem", ({ type, model }) => {
        this.consumers.vue.forEach((consumer) => {
            var vm = consumer;
            vm.focusItem(type, model.id);
        })
    })

    //在外部监听，使用场景：1. g6通知vue实例激活指定节点的编辑面板
    this.on = this.scheduler.on.bind(this.scheduler)
    this.emit = this.scheduler.emit.bind(this.scheduler)
}

// 注册G6实例
EventSquare.prototype.addGraph = function (graph) {
    this.consumers.g6.push(graph)
}

// 注销G6实例
EventSquare.prototype.removeGraph = function (graph) {
    var graphIndex = this.consumers.g6.indexOf(graph)
    if (graphIndex !== -1) {
        this.consumers.g6.splice(graphIndex, 1)
    }
}

// 注册Vue实例
EventSquare.prototype.addVue = function (vm) {
    this.consumers.vue.push(vm)
}
