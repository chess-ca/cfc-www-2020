
export default { pre_init }

const page_id = 'pg-home';

function pre_init(page_data) {
    if (page_data.page_id !== page_id) return;

    const pd = page_data;
    pd.newsflashes = get_newsflashes();
    pd.photobox_home = get_photos();
    pd.next_events = get_next_events;
}

const max_events_on_home_page = 7;

function get_newsflashes() {
    const now_ymd = (new Date()).toISOString().slice(0,10);
    const cfc_data = window.ws_cfc_data || {};
    const news_in = cfc_data.newsflashes || [];
    const news_out = [];
    for (let i=0; i<news_in.length; i++) {
        let nf = news_in[i];
        if (nf['start'] > now_ymd || nf['end'] < now_ymd)
            continue;
        news_out.push(nf);
    }
    return news_out;
}

function get_photos() {
    const now_ymd = (new Date()).toISOString().slice(0,10);
    const cfc_data = window.ws_cfc_data || {};
    const photos_in = cfc_data.photobox_home || [];
    const photos_out = [];
    for (let i=0; i<photos_in.length; i++) {
        let nf = photos_in[i];
        if (nf['start'] > now_ymd || nf['end'] < now_ymd)
            continue;
        photos_out.push(nf);
    }
    return photos_out;
}

function get_next_events() {
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
