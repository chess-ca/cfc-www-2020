
import {call_api, get_url_query_vars} from '../../utils';

export default { pre_init, post_init }

const page_id = 'pg-player-details'
const _log = console.log;

function pre_init(page_data) {
    if (page_data.page_id !== page_id) return;

    let pd = page_data;
    pd.report_is = 'empty';
    pd.dbdate = '';
    pd.player = {};
    pd.tournaments = [];
    pd.empty_array = [];
    pd.filter = { t_type: '*' };
    pd.player_has_provisional_rating = false;
    pd.event_has_provisional_rating = false;
    pd.filtered_tournaments = filtered_tournaments;
    pd.show_crosstable = show_crosstable;
}

function post_init(page_data) {
    if (page_data.page_id !== page_id) return;

    const qvars = get_url_query_vars();
    const cfc_id = qvars['id'];
    if ( cfc_id ) {
        get_player_details(page_data, cfc_id);
    } else {
        console.error('URL arg "id" is missing.')
        window.location.replace(`/${pd.lang}/ratings/`);
    }
}

/**
 * Get the player details from the CFC server.
 * @param pd - the AlpineJS page data
 * @param cfc_id - player's CFC membership id
 */
function get_player_details(pd, cfc_id) {
    pd.report_is = 'loading';
    call_api({
        page_data: pd,
        api: '/ratings/player/' + cfc_id,
        onSuccess: onSuccess,
        onFail: function(pd) {
            pd.report_is = 'empty'
        },
        onTimeout: function(pd) {
            pd.report_is = 'timed-out';
        }
    });
}

function onSuccess(pd, rsp) {
    pd.dbdate = rsp.dbdate || '???';
    pd.player = rsp.player || {};
    pd.tournaments = pd.player.tournaments || [];
    pd.player_has_provisional_rating =
        (pd.player.rating_hi <= 30 || pd.player.quick_hi <= 30);
    pd.report_is = 'ready';

    const el_title = document.getElementById('ws-page-title');
    const name = pd.player.name_first
    if (el_title) { el_title.innerText = pd.player.name }
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

function show_crosstable(event_id) {
    const pd = this;
    const cfc_id = pd.player.m_id;
    pd.go(
        '/[[lang]]/ratings/t/?id=' + event_id
        + (cfc_id ? ('&p='+cfc_id) : '')
    )
}
