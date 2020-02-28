let router = new VueRouter({
    routes: [
        { path: '/', component: IndexPage },
        { path: '/graph/:graphName', component: GraphPage },
        { path: '/graph/:graphName/:article', component: GraphPage },
    ]
})