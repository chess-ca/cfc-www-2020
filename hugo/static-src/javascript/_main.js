/**
 * @file Initialize and start VueJS
 * @author Don Parakin
 */
import Vue from 'vue';
import pg_all from './js4pages/pg-all';
import pg_home from './js4pages/pg-home';
import pg_events_list from './js4pages/pg-events-list';
import pg_ratings from './js4pages/pg-ratings';
import pg_ratings_tdlist from './js4pages/pg-ratings-tdlist';
import pg_ratings_players_find from './js4pages/pg-ratings-players-find';
import pg_membership_how from './js4pages/pg-membership-how';


const pginfo = get_page_info();
const vue_config = {
    el: '#vue-app',
    // Only one global Vue instance; so can be {} and not a function.
    data: {},
    computed: { lang: () => pginfo.lang },
    methods: {},
    components: {},
    delimiters: ['[v[', ']v]']      // Since Hugo already uses {{ }} delimters
};

const pglist = [
    pg_all, pg_home, pg_events_list, pg_membership_how,
    pg_ratings, pg_ratings_players_find, pg_ratings_tdlist
];
pglist.forEach(pg => pg.init(pginfo, vue_config));

//----------------------------------------------------------------------
function get_page_info() {
    let el_html = document.getElementsByTagName('html')[0];
    return {
        lang: el_html.getAttribute('lang') || 'en',
        id: el_html.getAttribute('data-pageid') || ''
    };
}

window.ws_vue = new Vue(vue_config);
