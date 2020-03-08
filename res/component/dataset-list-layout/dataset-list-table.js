Vue.component('dataset-list-table', {
  template: /*html*/`<div style="height: 400px;overflow: auto;">
  <div v-if="list.length == 0">
    还没有图，先来添加一个吧。
    <a href="javascript:;" @click="$emit('action', 'showAdd')">创建</a>
  </div>
  <table class="pure-table pure-table-bordered" style="width:100%" v-else>
    <thead>
      <tr>
        <th style="width: 20px;">#</th>
        <th>名称</th>
        <th style="width: 80px;">创建时间</th>
        <th style="width: 230px;">操作</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item,i in list" :class="{'pure-table-odd':i % 2 ===0 }">
        <td>{{i+1}}</td>
        <td><router-link :to="'/graph/'+item.name">{{item.name}}</router-link> </td>
        <td>{{item.create_at | date}}</td>
        <td>
          <router-link class="pure-button button-small pure-button-primary" :to="'/graph/'+item.name">编辑数据</router-link>
          <a class="pure-button button-small" href="javascript:;" @click="$emit('action', 'showEdit', item)">编辑名称</a>
          <a class="pure-button button-small button-error" href="javascript:;" @click="$emit('action', 'removeConfirm', item)">删除</a>
        </td>
      </tr>
    </tbody>
  </table>
  </div>`,
  props: {
    list: Array
  },
  filters: {
    date(time) {
      return moment(time).fromNow()
    }
  }
})
