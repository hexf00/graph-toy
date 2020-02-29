Vue.component('node-list', {
  template: /*html*/`<div>
    <ul>
      <li v-for="node in data" :title="node.label" :data-id="node.id"
          @click="focus">
          {{node.label}}
      </li>
    </ul>
  </div>`,
  props: {
    data: Array,
  },
  data() {
    return {
    }
  },
  methods: {
    focus(e) {
      this.$emit("focusNode", e.target.dataset.id)
    }
  }
})
