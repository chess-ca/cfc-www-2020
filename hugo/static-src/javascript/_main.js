/**
 * @file Initialize and start VueJS
 * @author Don Parakin
 */
import Vue from 'vue';
import pg_all from './js4pages/pg-all';
import pg_home from './js4pages/pg-home';
import pg_events_list from './js4pages/pg-events-list';
import pg_ratings_tdlist from './js4pages/pg-ratings-tdlist';
import pg_ratings_players_find from './js4pages/pg-ratings-players-find';

const vue_config = {
    el: '#vue-app',
    // Hugo-generated HTML has [v[ ... ]v] for VueJS (since Hugo itself already uses {{ }} delimters)
    delimiters: ['[v[', ']v]']
};

const pageid = get_pageid();
const pglist = [
    pg_all, pg_home, pg_events_list,
    pg_ratings_players_find, pg_ratings_tdlist
];
pglist.forEach(pg => pg.init(pageid, vue_config));

//----------------------------------------------------------------------
function get_pageid() {
    let el_html = document.getElementsByTagName('html')[0];
    return el_html.getAttribute('data-pageid') || '';
}

window.ws_vue = new Vue(vue_config);
