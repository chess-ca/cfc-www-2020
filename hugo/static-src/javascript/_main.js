/**
 * @file Initialize and start VueJS
 * @author Don Parakin
 */
import Vue from 'vue';
import * as pageid_pg_all from './pageid/pg-all';
import * as pageid_pg_home from './pageid/pg-home'
import * as pageid_pg_events_list from './pageid/pg-events-list';
import * as pageid_pg_ratings_tdlist from './pageid/pg-ratings-tdlist';
import * as pageid_pg_ratings_players_find from './pageid/pg-ratings-players-find';

import * as ws_select_next from './ws-select-next';
import * as ws_photobox from './ws-photobox';
import * as ws_chess_com_game from './ws-chess-com-game';
import * as cfc_ratings from './component/cfc-ratings'
//import * as pageid_pg_home from './pageid-pg-home';

// Hugo-generated HTML has [v ... v] for VueJS (since Hugo itself already uses {{ }} delimters)

ws_select_next.add_component(Vue);
ws_photobox.add_component(Vue);
ws_chess_com_game.add_component(Vue);
cfc_ratings.add_component(Vue);

const vue_config = {
    el: '#vue-app',
    delimiters: ['[v[', ']v]']  // Since Hugo itself uses {{ ... }}
};

const el_html = document.getElementsByTagName('html')[0];
const pageid = el_html.getAttribute('data-pageid') || '';
pageid_pg_all.init_vue_config(vue_config);
if (pageid==='pg-home') {
    pageid_pg_home.init_vue_config(vue_config);
} else if (pageid==='pg-events-list') {
    pageid_pg_events_list.init_vue_config(vue_config);
} else if (pageid==='pg-ratings-tdlist') {
    pageid_pg_ratings_tdlist.init_vue_config(vue_config);
} else if (pageid==='pg-ratings-players-find') {
    pageid_pg_ratings_players_find.init_vue_config(vue_config);
}

window.ws_vue = new Vue(vue_config);
