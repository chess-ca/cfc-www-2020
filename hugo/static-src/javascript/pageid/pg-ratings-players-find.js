
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


export function init_vue_config(vc) {
    vc.data = vc.data || {};
    vc.data.mid = '';
    vc.data.first = '';
    vc.data.last = '';
    vc.data.players = { list: [] };
    vc.data.dbdate = '';
    vc.data.error_msg = '';
    vc.data.searching = false;
    vc.data.showing_results = false;

    vc.methods = vc.methods || {};
    vc.methods.ratings_search = ratings_search;
    vc.methods.ratings_reset = ratings_reset;
    vc.methods.player = player;
}