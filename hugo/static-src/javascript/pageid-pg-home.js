
const max_events_on_home_page = 8;

function cfc_events() {
    const now_ymd = (new Date()).toISOString().slice(0,10);
    const re_cancelled = /cancelled/i;
    const data_out = [];
    const data_in = window.ws_cfc_events || [];
    for (let i=0, i_end=data_in.length; i<i_end; i++) {
        let e = data_in[i];
        let skip_it =
            (e['end'] < now_ymd)
            || (e['incl'] !== '')
            || (e['name'].match(re_cancelled))
        ;
        if ( skip_it ) continue;

        if (e['prov']!=='Online') e['city'] += (', ' + e['prov']);
        // e['name'] = e['name'].replace('CANCELLED:', '<i class="fas fa-times-circle"></i>');

        var data_len = data_out.push(e);
        if (data_len >= max_events_on_home_page) { break; }
    }
    return data_out;
}

export function init_vue_config(vc) {
    vc.data = vc.data || {};
    vc.data.cfc_events = cfc_events();
    // vc.computed = vc.computed || {};
    // vc.computed.cfc_events = cfc_events;
}