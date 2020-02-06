Vue.component('panel', {
    template: `
    <div v-show="$parent.active_c == title">
        <slot></slot>
    </div>
    `,
    props: {
        title: String,
    },
    data() {
        return {}
    }
})  
