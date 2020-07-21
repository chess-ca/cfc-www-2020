
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

export function init_vue_config(vc) {
    vc.data = vc.data || {};
    vc.data.e_type = '*';
    vc.data.e_prov = '*';

    vc.computed = vc.computed || {};
    vc.computed.cfc_events = cfc_events;
}