// 事件监听器

var Scheduler = function () {
    this.funcs = {}
}
Scheduler.prototype.on = function (eventName, fn) {
    if (!this.funcs[eventName]) {
        this.funcs[eventName] = []
    }
    this.funcs[eventName].push(fn)

    return this
}

Scheduler.prototype.emit = function () {
    if (arguments.length === 0) {
        return
    }
    let eventName = arguments[0]
    if (this.funcs[eventName]) {
        this.funcs[eventName].map((fn) => {
            fn(...Array.prototype.slice.apply(arguments).slice(1))
        })
    }

    return this
}

