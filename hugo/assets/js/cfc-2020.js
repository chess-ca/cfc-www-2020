
import Alpine from 'alpinejs';
import CFC_Spinner from './extensions/cfc-spinner';
import CFC_Photobox from './extensions/cfc-photobox';
import CFC_NewsFlashes from './extensions/cfc-newsflashes';
import CFC_Game_ChessCom from './extensions/cfc-game-chess-com';

import pg_home from './js4pages/home';
import pg_membership_how from './js4pages/players/membership-how';
import pg_upcoming_events from './js4pages/other/events-list';
import pg_ratings_home from './js4pages/ratings/home';
import pg_ratings_player_details from './js4pages/ratings/player-details';
import pg_ratings_player_search_results from './js4pages/ratings/player-search-results'
import pg_ratings_player_lists_top from './js4pages/ratings/player-lists-top';
import pg_ratings_tournament_crosstable from './js4pages/ratings/tournament-crosstable';
import pg_ratings_tournament_lists from './js4pages/ratings/tournament-lists';
import { go } from "./utils";

const plugin_list = [
    CFC_Spinner, CFC_Photobox, CFC_NewsFlashes, CFC_Game_ChessCom
];
const page_list = [
    pg_home, pg_upcoming_events, pg_membership_how,
    pg_ratings_home, pg_ratings_player_details, pg_ratings_player_lists_top,
    pg_ratings_player_search_results,
    pg_ratings_tournament_crosstable, pg_ratings_tournament_lists
];

_main();
function _main() {
    window.Alpine = Alpine;     // for easy access.
    document.addEventListener('alpine:init',
        runs_before_alpine_initializes_the_page);
    Alpine.start();
}

function runs_before_alpine_initializes_the_page() {
    //---- Plugins
    plugin_list.forEach(plugin => {
        Alpine.plugin(plugin)
    });

    //---- Page Data (x-data)
    // All pages have x-data="page_data"; this is what all pages get
    const el_html = document.getElementsByTagName('html')[0];
    const page_data = {
        lang: el_html.getAttribute('lang') || 'en',
        page_id: el_html.getAttribute('data-pageid') || '',
        sideNav: {
            show: false,
            toggle: function() { this.sideNav.show = ! this.sideNav.show; }
        },
        go: go
    };
    page_list.forEach(page => {
        if (page && page.pre_init) {
            page.pre_init(page_data);
            if (page_data.init) {
                console.error('A page\'s .pre_init() set page_data.init.',
                    '\nIt should not: page_data.init will be overridden');
            }
        }
    });
    page_data.init = runs_after_alpine_initializes_the_page;

    Alpine.data('page_data', () => page_data );
    //---- Now, all is ready for AlpineJS to begin initializing the page!
}

function runs_after_alpine_initializes_the_page() {
    const page_data = this;
    page_list.forEach(page => {
        if (page && page.post_init) {
            page.post_init(page_data);
        }
    });
}
