
function sideNave_toggle() {
    console.log('sideNav_toggle:', 'invoked!');
    this.sideNav_show = ! this.sideNav_show;
}

export function init_vue_config(vc) {
    vc.data = vc.data || {};
    vc.data.sideNav_show = false;
    vc.methods = vc.methods || {};
    vc.methods.sideNav_toggle = sideNave_toggle;
}