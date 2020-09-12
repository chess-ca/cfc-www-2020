
function cfc_events() {
    const vm = this;
    const now_ymd = (new Date()).toISOString().slice(0,10);
    const data_out = [];
    const data_in = window.ws_cfc_events || [];
    for (let i=0, i_end=data_in.length; i<i_end; i++) {
        let e = data_in[i];
        let skip_it =
            (e['end'] < now_ymd)
            || (e['incl'])
            || (vm.e_type !== '*' && vm.e_type !== e['type'])
            || (vm.e_prov !== '*' && vm.e_prov !== e['prov'])
        ;
        if ( !skip_it ) {
            data_out.push(e);
        }
    }
    return data_out;
}

function init(pginfo, vue_config) {
    if (pginfo.id !== 'pg-events-list') return;

    vue_config.data = vue_config.data || {};
    vue_config.data.e_type = '*';
    vue_config.data.e_prov = '*';

    vue_config.computed = vue_config.computed || {};
    vue_config.computed.cfc_events = cfc_events;
}

export default { init }
