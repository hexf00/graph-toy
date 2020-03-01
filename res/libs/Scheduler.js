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

// emit不支持链式调用
// 因为我们提供then方法调用 .emit(eventName,data).then()
// 返回值是Promise
Scheduler.prototype.emit = function () {
    if (arguments.length === 0) {
        return
    }
    let eventName = arguments[0]
    if (this.funcs[eventName]) {
        var promiseList = []
        this.funcs[eventName].forEach((fn) => {
            var result = fn(...Array.from(arguments).slice(1))

            //返回值是Promise的不再包装
            if (result instanceof Promise) {
                promiseList.push(result)
            } else {
                promiseList.push(Promise.resolve(result))
            }
        })

        if (promiseList.length === 1) {
            return promiseList[0]
        } else {
            //需要注意：如果注册了多个事件回调，调用处无法判断返回值分别由哪些事件调用的
            // 为了代码不出问题，尽量不要使用then的传入
            // 提供then的目的主要是 确认操作成功状态 
            // 成功了再继续进入更近一步的操作，数据库和IO操作需要这么做
            return Promise.all(promiseList)
        }
    }
}

Scheduler.prototype.destroy = function () {
    this.funcs = {}
}

