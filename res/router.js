let router = new VueRouter({
    routes: [
        { path: '/', component: IndexPage },
        { path: '/graph/:title', component: GraphPage },
        { path: '/graph/:title/:article', component: GraphPage },
    ]
})