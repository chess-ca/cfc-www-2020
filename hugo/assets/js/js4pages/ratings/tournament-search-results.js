
import {call_api, get_provinces, get_url_query_vars} from '../../utils';

export default { pre_init, post_init }

const page_id = 'pg-tournament-search-results';

function pre_init(page_data) {
    if (page_data.page_id !== page_id) return;

    const pd = page_data;
    pd.dbdate = '';
    pd.tournaments = [];
    pd.show_crosstable = show_crosstable;

    // pd.now_yyyy = (new Date()).getFullYear();
    // pd.prov_list = get_provinces(pd.lang, ['US', 'FO']);
    // pd.report_is = 'empty';
    // pd.t_name = qvars['n'] || '';
    // pd.t_type = '*';
    // pd.t_prov = '*';
    // pd.date_min_default = '1996-01-01';
    // pd.date_min = pd.date_min_default;
    // pd.date_max_default = ((new Date()).getFullYear()) + '-12-31';
    // pd.date_max = pd.date_max_default;
}

function post_init(page_data) {
    if (page_data.page_id !== page_id) return;

    const pd = page_data;
    const qvars = get_url_query_vars();
    const t_name = qvars['n'];
    const t_year = qvars['y'];
    const t_days = qvars['d'];
    if (t_name || t_year || t_days) {
        get_tournaments(pd, t_name, t_year, t_days);
    }
}

function get_tournaments(page_data, t_name, t_year, t_days) {
    const pd = page_data;
    pd.report_is = 'loading';

    let api_url = '/ratings/tournament';
    if (t_name && t_name !== '') {
        api_url += '/find?name=' + encodeURI(t_name);
    } else if (t_days && t_days !== '') {
        api_url += '/days/' + t_days;
    } else if (t_year) {
        api_url += '/year/' + t_year;
    }

    call_api({
        page_data: pd,
        api: api_url,
        onSuccess: onSuccess,
        onFail: (pd) => { pd.report_is = 'empty'; },
        onTimeout: (pd) => { pd.report_is = 'timed-out'; }
    });

    function onSuccess(page_data, rsp) {
        const pd = page_data;
        pd.dbdate = rsp.dbdate || '???';
        pd.tournaments = rsp.tournaments || [];
        pd.report_is = 'ready';
    }
}

function show_crosstable(event_id) {
    const pd = this;
    pd.go(`/[[lang]]/ratings/t/?id=${event_id}`);
}
