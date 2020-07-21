/**
 * @file Initialize and start VueJS
 * @author Don Parakin
 */
import Vue from 'vue';
//import VueAgile from 'vue-agile'
import * as filters from './filters';
import * as pageid_pg_home from './pageid-pg-home';
import * as pageid_pg_events_list from './pageid-pg-events-list';
import * as pageid_pg_ratings_tdlist from './pageid-pg-ratings-tdlist';
//import * as cfc_topbar from './cfc-topbar';

//Vue.use(VueAgile);
filters.add_filters(Vue);
//cfc_topbar.add_component(Vue);

// Hugo-generated HTML has [v ... v] for VueJS (since Hugo itself already uses {{ }} delimters)

const el_html = document.getElementsByTagName('html')[0];
const pageid = el_html.getAttribute('data-pageid') || '';

const vue_config = {
    el: '#vue-app',
    delimiters: ['[v[', ']v]']  // Since Hugo itself uses {{ ... }}
};
if (pageid==='pg-home') pageid_pg_home.init_vue_config(vue_config);
if (pageid==='pg-events-list') pageid_pg_events_list.init_vue_config(vue_config);
if (pageid==='pg-ratings-tdlist') pageid_pg_ratings_tdlist.init_vue_config(vue_config);

window.ws_vue = new Vue(vue_config);
