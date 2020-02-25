Vue.component('edit-graph', {
    template: /*html*/`<div>
        名称：<input>
        <button>创建/保存</button>
    </div>`,
    props: {
        node: Object,
        x: Number,
        y: Number
    },
    methods: {

    }
})
