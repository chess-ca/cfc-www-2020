
function ratings_search(event) {
    const vue_vm = this;
    vue_vm.showing_results = false;
    vue_vm.players.list = [];
    // ---- Validate
    if (vue_vm.cfc_id === ''
        && (vue_vm.first === '' || vue_vm.first === '*')
        && (vue_vm.last === '' || vue_vm.last === '*')
    ) {
        console.log('Empty search criteria:', vue_vm.cfc_id, vue_vm.first, vue_vm.last);
        return;
    }
    vue_vm.searching = true;

    // ---- Get players
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
            console.log('API call: Success:', xhr);
            var rsp = JSON.parse(xhr.response);
            vue_vm.players.list = rsp.players;
            vue_vm.searching = false;
            vue_vm.showing_results = true;
        } else {
            console.log('API call: Failed:', xhr);
            vue_vm.searching = false;
            vue_vm.showing_results = false;
        }
    };
    var api_url = 'http://swo.webfactional.com/cfc-tdlist/tdlist-api.py'
        + '?cfc_id=' + this.cfc_id
        + '&first=' + this.first
        + '&last=' + this.last;
    xhr.open('GET', api_url);
    xhr.send();
}

function ratings_reset(event) {
    this.cfc_id = '';
    this.first = '';
    this.last = '';
    this.searching = false;
    this.showing_results = false;
    this.players.list = [];
}


export function init_vue_config(vc) {
    vc.data = vc.data || {};
    vc.data.cfc_id = '';
    vc.data.first = '';
    vc.data.last = '';
    vc.data.players = { list: [] };
    vc.data.searching = false;
    vc.data.showing_results = false;

    vc.methods = vc.methods || {};
    vc.methods.ratings_search = ratings_search;
    vc.methods.ratings_reset = ratings_reset;
}