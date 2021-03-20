
import Vue from 'vue';
import cfcSpinner from '../component/cfcSpinner.vue';
import gameChessCom from '../component/gameChessCom.vue';

Vue.component('cfc-spinner', cfcSpinner);

function sideNav_toggle() {
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
    vue_config.methods.sideNav_toggle = sideNav_toggle;
    vue_config.methods.goto = goto;
    vue_config.components = vue_config.components || {};
    vue_config.components['game-chess-com'] = gameChessCom;
}

export default { init }
