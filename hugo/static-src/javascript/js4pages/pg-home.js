
import cfcPhotoBox from '../component/cfcPhotoBox.vue';
import gameChessCom from '../component/gameChessCom.vue';

const max_events_on_home_page = 8;

function events_for_home_page() {
    const now_ymd = (new Date()).toISOString().slice(0,10);
    const re_cancelled = /cancelled/i;
    const data_out = [];
    const data_in = window.ws_cfc_events || [];
    for (let i=0, i_end=data_in.length; i<i_end; i++) {
        let e = data_in[i];
        let skip_it =
            (e['end'] < now_ymd)
            || (e['incl'] !== '')
            || (e['prov'] === 'FO')
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

function init(pginfo, vue_config) {
    if (pginfo.id !== 'pg-home') return;

    vue_config.data = vue_config.data || {};
    vue_config.data.cfc_events = events_for_home_page();
    vue_config.components = vue_config.components || {};
    vue_config.components['cfc-photo-box'] = cfcPhotoBox;
    vue_config.components['game-chess-com'] = gameChessCom;
}

export default { init }
