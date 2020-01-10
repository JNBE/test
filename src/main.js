import Vue from 'vue';
import iView from 'iview';
import VueRouter from 'vue-router';
import Routers from './router';
import Vuex from 'vuex';
import Util from './libs/util';
import Common from './libs/common';
import App from './app.vue';
import 'iview/dist/styles/iview.css';
import './static/font/iconfont.css';

import echarts from 'echarts';
Vue.prototype.$echarts = echarts ;

Vue.prototype.$ajax = Util.ajax;

Vue.use(VueRouter);
Vue.use(Vuex);

Vue.use(iView);



// 路由配置
const RouterConfig = {
    //mode: 'history',
    routes: Routers
};
const router = new VueRouter(RouterConfig);

router.beforeEach((to, from, next) => {
    let names=[];
    for (const item of to.matched) {
        names.push(item.name);
    }
    sessionStorage.setItem("routers",JSON.stringify(names));

    iView.LoadingBar.start();
    Util.title(to.meta.title);
    if (to.matched.some(record => record.meta.requireAuth)) {  // 判断该路由是否需要登录权限
        if (Common.user.token) {  // 判断当前的token是否存在
            next();
        }
        else {
            next({
                path: '/',
                query: { redirect: to.fullPath }  // 将跳转的路由path作为参数，登录成功后跳转到该路由
            })
        }
    }
    else {
        next();
    }
});

router.afterEach(() => {
    iView.LoadingBar.finish();
    window.scrollTo(0, 0);
});


const store = new Vuex.Store({
    state: {

    },
    getters: {

    },
    mutations: {

    },
    actions: {

    }
});


new Vue({
    el: '#app',
    router: router,
    store: store,
    render: h => h(App)
});