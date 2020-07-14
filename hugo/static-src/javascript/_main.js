/**
 * @file Initialize and start VueJS
 * @author Don Parakin
 */
import Vue from 'vue';
//import VueAgile from 'vue-agile'
import * as filters from './filters';
//import * as cfc_topbar from './cfc-topbar';

//Vue.use(VueAgile);
filters.add_filters(Vue);
//cfc_topbar.add_component(Vue);

const vueApp = new Vue({
    el: '#vue-app'
    // Hugo-generated HTML has [v ... v] for VueJS (since Hugo itself already uses {{ }} delimters)
    //delimiters: ['[v', 'v]']
});
