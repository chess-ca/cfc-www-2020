
function sideNave_toggle() {
    console.log('sideNav_toggle:', 'invoked!');
    this.sideNav_show = ! this.sideNav_show;
}

function goto(url) {
    window.location.href = url;
}

function init(pginfo, vue_config) {
    // For *all* pages ...
    vue_config.data = vue_config.data || {};
    vue_config.data.sideNav_show = false;
    vue_config.data.select_1 = '';
    vue_config.methods = vue_config.methods || {};
    vue_config.methods.sideNav_toggle = sideNave_toggle;
    vue_config.methods.goto = goto;
}

export default { init }
