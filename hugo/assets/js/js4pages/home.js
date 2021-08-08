
export default { pre_init }

function pre_init(page_data) {
    const pd = page_data;
    const cfc_data = window.ws_cfc_data || {};
    pd.newsflashes = cfc_data.newsflashes || [];
    pd.photobox_home = cfc_data.photobox_home || [];
    pd.next_events = next_events;
}

const max_events_on_home_page = 7;

function next_events() {
    const now_ymd = (new Date()).toISOString().slice(0,10);
    const re_cancelled = /cancelled/i;

    const events_in = (window.ws_cfc_data && window.ws_cfc_data.events) || [];
    const events_out = [];
    for (let i=0; i<events_in.length; i++) {
        let e = events_in[i];
        let skip_it =
            (e['end'] < now_ymd)
            || (e['prov'] === 'FO')
            || (e['prov'] === 'US')
            || (e['name'].match(re_cancelled))
        ;
        if ( skip_it )
            continue;
        if (e['prov'] !== 'Online')
            e['city'] += (', ' + e['prov']);

        let out_count = events_out.push(e);
        if (out_count >= max_events_on_home_page)
            break;
    }
    return events_out;
}
