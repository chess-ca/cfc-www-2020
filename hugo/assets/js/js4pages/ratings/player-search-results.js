
import {call_api, get_url_query_vars} from '../../utils';

export default { pre_init, post_init }

const page_id = 'pg-player-search-results';
const _log = console.log;

function pre_init(page_data) {
    if (page_data.page_id !== page_id) return;

    const pd = page_data;
    const qvars = get_url_query_vars();
    pd.report_is = 'empty';
    pd.dbdate = '';
    pd.p_first = qvars['fn'] || '';
    pd.p_last = qvars['ln'] || '';
    pd.players = [];
    pd.has_provisional_ratings = has_provisional_ratings;
    pd.do_search = do_search;
}

function post_init(page_data) {
    if (page_data.page_id !== page_id) return;

    const pd = page_data;
    if ( pd.p_first || pd.p_last ) {
        get_players(pd, pd.p_first, pd.p_last);
    }
}

/**
 * Get the players from the CFC server.
 * @param page_data - the AlpineJS page data
 * @param first_name
 * @param last_name
 */
function get_players(page_data, first_name, last_name) {
    const pd = page_data;
    const fn = encodeURI(String(first_name).trim());
    const ln = encodeURI(String(last_name).trim());
    pd.players = [];
    pd.report_is = 'loading';
    call_api({
        page_data: pd,
        api: `/ratings/player/find?first=${fn}&last=${ln}`,
        onSuccess: onSuccess,
        onFail: (pd) => { pd.report_is = 'empty'; },
        onTimeout: (pd) => { pd.report_is = 'timed-out'; }
    });

    function onSuccess(page_data, rsp) {
        const pd = page_data;
        pd.dbdate = rsp.dbdate || '???';
        pd.players = rsp.players || [];
        pd.report_is = 'ready';
    }
}

function do_search(el) {
    const pd = this;

    if (el && el.addClass) {
        el.addClass('is-loading')   // Bulma.io for a button spinner
    }
    const fn = String(pd.p_first).trim();
    const ln = String(pd.p_last).trim();
    if ( fn || ln ) {
        get_players(pd, fn, ln);
    } else {
        pd.report_is = 'err_enter_criteria';
    }
}

function has_provisional_ratings(players) {
    // For deciding if to show the description notes at bottom of report.
    return players.reduce(
        (it_has, p) => it_has || p.rating_hi < 30 || p.quick_hi < 30,
        false );
}
