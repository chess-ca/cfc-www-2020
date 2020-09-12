
import * as cfc_ratings from '../component/cfc-ratings'
cfc_ratings.add_component(Vue);

function ratings_search(event) {
    const vue_vm = this;
    vue_vm.error_msg = '';
    vue_vm.showing_results = false;
    vue_vm.players.list = [];
    // ---- Validate
    if (vue_vm.mid === ''
        && (vue_vm.first === '' || vue_vm.first === '*')
        && (vue_vm.last === '' || vue_vm.last === '*')
    ) {
        return;     // search criteria is empty
    }
    vue_vm.searching = true;

    // ---- Get players
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
            console.log('API call: Success:', xhr);
            var rsp = JSON.parse(xhr.response);
            vue_vm.players.list = rsp.players;
            vue_vm.dbdate = rsp.dbdate;
            vue_vm.searching = false;
            vue_vm.showing_results = true;
        } else {
            vue_vm.error_msg = 'Error calling CFC server. Try again later.';
            console.log('API call: Failed:', xhr);
            vue_vm.searching = false;
            vue_vm.showing_results = false;
        }
    };
    var api_url = 'https://server.chess.ca/api/ratings/player/find'
        + '?mid=' + this.mid
        + '&first=' + this.first
        + '&last=' + this.last;
    xhr.open('GET', api_url);
    xhr.send();
}

function ratings_reset(event) {
    this.mid = '';
    this.first = '';
    this.last = '';
    this.error_msg = '';
    this.searching = false;
    this.showing_results = false;
    this.players.list = [];
}

function player(mid) {
    console.log('clicked for player:', mid)
}

function init(pginfo, vue_config) {
    if (pginfo.id !== 'pg-ratings-players-find') return;

    vue_config.data = vue_config.data || {};
    vue_config.data.mid = '';
    vue_config.data.first = '';
    vue_config.data.last = '';
    vue_config.data.players = { list: [] };
    vue_config.data.dbdate = '';
    vue_config.data.error_msg = '';
    vue_config.data.searching = false;
    vue_config.data.showing_results = false;

    vue_config.methods = vue_config.methods || {};
    vue_config.methods.ratings_search = ratings_search;
    vue_config.methods.ratings_reset = ratings_reset;
    vue_config.methods.player = player;
}

export default { init };
