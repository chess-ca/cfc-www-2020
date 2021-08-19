
import { call_api, get_provinces } from '../../utils';

export default { pre_init }

const page_id = 'pg-ratings-player-lists-top';

function pre_init(page_data) {
    if (page_data.page_id !== page_id) return;

    const pd = page_data;
    pd.now_yyyy = (new Date()).getFullYear();
    pd.prov_list = get_provinces(pd.lang, ['US', 'FO']);

    pd.type = 'R';
    pd.topn = 50;
    pd.rating_min = 0;
    pd.rating_max = 9999;
    pd.age_min = 0;
    pd.age_max = 99;
    pd.gender = '';
    pd.province = '';
    pd.date_default = '1995-01-01';  // (now_yyyy - 5) + '-01-01'
    pd.last_played = pd.date_default;
    pd.cfc_expiry_min = pd.date_default;

    pd.report_is = 'empty';     // empty | loading | ready
    pd.dbdate = '';
    pd.players = [];
    pd.player_list_is_single = false;

    pd.get_report = get_report;
    pd.on_change = on_change;
    pd.show_player = (cfc_id) => {}
    pd.has_provisional_ratings = has_provisional_ratings;
}

function get_report() {
    const pd = this;
    pd.report_is = 'loading';

    const args = [];
    args.push('topn=' + String(pd.topn || '50').trim());
    args.push('type=' + pd.type);
    if (pd.rating_min > 0) args.push('rating_min=' + pd.rating_min);
    if (pd.rating_max < 9999) args.push('rating_max=' + pd.rating_max);
    if (pd.age_min > 0) args.push('age_min=' + pd.age_min);
    if (pd.age_max < 99) args.push('age_max=' + pd.age_max);
    if (pd.gender) args.push('gender=' + pd.gender);
    if (pd.province) args.push('province=' + pd.province);
    if (pd.last_played !== pd.date_default) args.push('last_played=' +pd.last_played);
    if (pd.cfc_expiry_min !== pd.date_default) args.push('cfc_expiry_min=' + pd.cfc_expiry_min);

    call_api({
        page_data: pd,
        api: '/cfcdb/player/v1/top?' + args.join('&'),
        onSuccess: (pd, rsp) => {
            // console.log('player-lists-top: api response:', rsp);
            pd.dbdate = rsp.updated || '???';
            pd.players = rsp.players || [];
            pd.report_is = 'ready';
        },
        onFail: (pd) => {
            pd.report_is = 'empty'
        }
    });
}

function on_change() {
    this.report_is = 'empty';
}

function has_provisional_ratings(players, ratings_type) {
    // For deciding if to show the description notes at bottom of report.
    let it_has = false;
    for (let i=0; i<players.length; i++) {
        let p = players[i];
        let indicator = ratings_type==='Q' ? p.quick_indicator : p.regular_indicator;
        if (indicator <= 30) {
            it_has = true;
            break;
        }
    }
    return it_has;
}
