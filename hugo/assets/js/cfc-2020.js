
import Alpine from 'alpinejs';
import CFC_Spinner from './extensions/cfc-spinner';
import CFC_Game_ChessCom from './extensions/cfc-game-chess-com';

import pg_all_pages from './js4pages/all-pages';
import pg_ratings_home from './js4pages/ratings/home';
import pg_ratings_player_lists_top from './js4pages/ratings/player-lists-top';
import pg_ratings_tournament_lists from './js4pages/ratings/tournament-lists';

const plugin_list = [
    CFC_Spinner, CFC_Game_ChessCom
];
const pg_list = [
    pg_all_pages,
    pg_ratings_home,
    pg_ratings_player_lists_top, pg_ratings_tournament_lists
];


_main();

function _main() {
    window.Alpine = Alpine;             // for easy access.
    init_alpine_plugins();
    init_js_for_pages();
    Alpine.start();
}

function init_alpine_plugins() {
    plugin_list.forEach(pi => Alpine.plugin(pi));
}

function init_called_by_alpine() {
    this.init_funcs.forEach(init_func => init_func())
}

function init_js_for_pages() {
    const el_html = document.getElementsByTagName('html')[0];
    let page_data = {
        lang: el_html.getAttribute('lang') || 'en',
        page_id: el_html.getAttribute('data-pageid') || '',
        init_funcs: [],
        init: init_called_by_alpine
    };

    pg_list.forEach(pg => pg.page_init(page_data));
    // console.log('cfc-2020.js: initial page_data=', page_data);

    document.addEventListener('alpine:init', () => {
        Alpine.data('page_data', () => (page_data))
    });
}
