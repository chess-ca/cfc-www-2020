
import {call_api, get_url_query_vars} from '../../utils';

export default { pre_init, post_init }

const page_id = 'pg-player-details';
const _log = console.log;

function pre_init(page_data) {
    if (page_data.page_id !== page_id) return;

    const pd = page_data;
    const qvars = get_url_query_vars();

    pd.report_is = 'empty';
    pd.dbdate = '';
    pd.cfc_id = qvars['id'] || '';
    pd.player = {};
    pd.tournaments = [];
    pd.empty_array = [];
    pd.filter = { t_type: '' };
    pd.player_has_provisional_rating = false;
    pd.event_has_provisional_rating = false;
    pd.filtered_tournaments = filtered_tournaments;
    pd.go_crosstable = go_crosstable;
}

function post_init(page_data) {
    if (page_data.page_id !== page_id) return;

    const pd = page_data;
    if ( pd.cfc_id ) {
        get_player_details(pd, pd.cfc_id);
    } else {
        console.error('URL arg "id" is missing.')
        window.location.replace(`/${pd.lang}/ratings/`);
    }
}

/**
 * Get the player details from the CFC server.
 * @param page_data - the AlpineJS page data
 * @param cfc_id - player's CFC membership id
 */
function get_player_details(page_data, cfc_id) {
    const pd = page_data;
    pd.report_is = 'loading';
    call_api({
        page_data: pd,
        api: `/ratings/player/${cfc_id}`,
        onSuccess: onSuccess,
        onFail: (pd) => { pd.report_is = 'empty'; },
        onTimeout: (pd) => { pd.report_is = 'timed-out'; }
    });

    function onSuccess(page_data, rsp) {
        const pd = page_data;
        pd.dbdate = rsp.dbdate || '???';
        pd.player = rsp.player || {};
        pd.tournaments = pd.player.tournaments || [];
        pd.player_has_provisional_rating = (
            pd.player.rating_hi <= 30 || pd.player.quick_hi <= 30
        );
        pd.report_is = 'ready';

        if (rsp.player) {
            const el_title = document.getElementById('ws-page-title');
            if (el_title) { el_title.innerText = pd.player.name }
        }
    }
}

function filtered_tournaments() {
    const pd = this;
    const filter = pd.filter.t_type;
    let list = pd.tournaments.filter(
        t => (filter === '' || filter === '*' || filter === t.type)
    );
    pd.event_has_provisional_rating = list.reduce(
        (it_has, t) => it_has || (t.rating_hi < 30), false
    );
    return list;
}

function go_crosstable(event_id) {
    const pd = this;
    const cfc_id = pd.player.m_id;
    pd.go(
        `/[[lang]]/ratings/t/?id=${event_id}`
        + (cfc_id ? `&p=${cfc_id}` : '')
    )
}