
//使用时机监听，导致的问题是无法判断改变是用户操作导致还是图同步导致
//可能会导致递归触发，不修改G6源码的实现方式是所有的操作再封装一次
// graph1.on("afteradditem", graph1Update)
// graph1.on("afterremoveitem", graph1Update)
// graph1.on("afterupdateitem", graph1Update)

var scheduler = {
    obj: {},
    on(name, fn) {
        if (!this.obj[name]) {
            this.obj[name] = [];
        }
        this.obj[name].push(fn);
    },
    emit(name, val) {
        if (this.obj[name]) {
            this.obj[name].map((fn) => {
                fn(val);
            });
        }
    }
}