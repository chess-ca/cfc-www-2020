
import {call_api, get_url_query_vars} from '../../utils';

export default { pre_init, post_init }

const page_id = 'pg-tournament-crosstable';
const _log = console.log;

function pre_init(page_data) {
    if (page_data.page_id !== page_id) return;

    const pd = page_data;
    pd.report_is = 'empty';
    pd.dbdate = '';
    pd.tid = '';
    pd.mid = '';
    pd.crosstable = { list: [], rounds: [], tournament: {} };
    pd.highlighted_mid = '';
    pd.has_provisional_ratings = false;
    pd.not_found = false;
    pd.show_player = show_player;
}

function post_init(page_data) {
    if (page_data.page_id !== page_id) return;

    const pd = page_data;
    const qvars = get_url_query_vars();
    const event_id = qvars['id'];
    page_data.highlighted_mid = parseInt(qvars['p'] || '0');

    if ( event_id ) {
        get_tournament_crosstable(pd, event_id);
    } else {
        console.error('URL arg "id" is missing.')
        window.location.replace(`/${pd.lang}/ratings/`);
    }
}

/**
 * Get the tournament crosstable from the CFC server.
 * @param page_data - the AlpineJS page data
 * @param event_id - tournament's event id
 */
function get_tournament_crosstable(page_data, event_id) {
    const pd = page_data;
    pd.report_is = 'loading';
    call_api({
        page_data: pd,
        api: `/ratings/tournament/${event_id}`,
        onSuccess: onSuccess,
        onFail: function(pd) {
            pd.report_is = 'empty'
        },
        onTimeout: function(pd) {
            pd.report_is = 'timed-out';
        }
    });
}

function onSuccess(page_data, rsp) {
    const pd = page_data;
    //---- Split results from "+27|-12|=4|..." to an array
    let crosstable = rsp.tournament.crosstable.map( cte => {
        cte.results = cte.results.replaceAll('X', '&#x2A2F;').split('|');
        return cte;
    });
    let max_rounds = crosstable.reduce(
        (max, cte) => Math.max(cte.results.length, max), 0);
    pd.has_provisional_ratings = crosstable.reduce(
        (it_has, cte) => it_has || (cte.rating_hi < 30), false);

    //---- Column headings for rounds depend on tournament type (Swiss or RR)
    let r_prefix = (rsp.tournament.pairings==='SS') ? 'R' : '#';
    let rounds = [];
    for (let i=1; i<=max_rounds; i++) {
        rounds.push(r_prefix + i);
    }

    pd.dbdate = rsp.dbdate || '???';
    pd.crosstable.tournament = rsp.tournament;
    pd.crosstable.list = crosstable;
    pd.crosstable.rounds = rounds;
    pd.report_is = 'ready';
}

function filtered_tournaments() {
    const pd = this;
    let list = []
    if (pd.filter.t_type === '*') {
        list = pd.tournaments
    } else {
        pd.tournaments.forEach(t => {
            if (t.type === pd.filter.t_type) {
                list.push(t);
            }
        });
    }
    pd.event_has_provisional_rating = false;
    for (let i=0; i<list.length; i++) {
        let t = list[i];
        if (t.rating_hi < 30) {
            pd.event_has_provisional_rating = true;
            break;
        }
    }
    return list;
}

function show_player(cfc_id) {
    this.go(`/[[lang]]/ratings/p/?id=${cfc_id}`);
}
