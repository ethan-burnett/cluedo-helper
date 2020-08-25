import Vue from 'vue'
import Router from 'vue-router'
import {BootstrapVue, IconsPlugin} from 'bootstrap-vue';
import SetUp from "./views/SetUp";
import HelloWorld from "./components/HelloWorld";

Vue.use(Router);
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

export default new Router({
    mode: 'history',
    routes: [
        {
            name: 'SetUp',
            path: '/setup',
            component: SetUp
        },
        {
            name: 'HelloWorld',
            path: '/hello-world',
            component: HelloWorld
        },
        // otherwise redirect to App
        {path: '/*', redirect: '/setup'}
    ]
});
