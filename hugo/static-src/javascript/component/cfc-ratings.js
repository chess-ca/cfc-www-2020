/**
 * @file VueJS component for <ws-photobox> tag
 * @author Don Parakin, 2020
 */
const server_url = 'https://server.chess.ca/api/ratings';
const earliest = '2006';

const vue_tag = 'cfc-ratings';
const vue_props = ['lang'];

const vue_data = function() {
    return {
        ui_state: 1,    // 1=search, 2=results, 3=player, 4=crosstable
        mid: '', first: '', last: '', current_mid: 0,
        players: { list: [], previous: []},
        tournaments: { list: [], previous: [] },
        crosstable: { list: [], rounds: [], tournament: {} },
        dbdate: '', error_msg: '',
        filter: { t_type: '*' },
        searching: false, showing_results: false,
        ajax: { waiting: false, error: '' },
        i18n: null
    };
};

const vue_beforeMount = function() {
    this.i18n = (this.lang === 'fr') ? i18n_fr : i18n_en
};

const vue_methods = {
    search: search, search_reset: search_reset,
    show_player: show_player, show_crosstable: show_crosstable,
    go_back: go_back
};

function search(event) {
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
    var api_url = server_url + '/player/find'
        + '?mid=' + this.mid
        + '&first=' + this.first
        + '&last=' + this.last;
    get_data(api_url, function(rsp) {
        vue_vm.players.list = rsp.players;
        vue_vm.dbdate = rsp.dbdate;
        vue_vm.searching = false;
        vue_vm.showing_results = true;
        vue_vm.ui_state = 2;
    }, function(rsp) {
        vue_vm.searching = false;
        vue_vm.showing_results = false;
    });
}

function search_reset(event) {
    this.mid = '';
    this.first = '';
    this.last = '';
    this.error_msg = '';
    this.searching = false;
    this.showing_results = false;
    this.players.list = [];
    this.ui_state = 1;
}

function show_player(mid) {
    const vue_vm = this;
    vue_vm.current_mid = mid;
    // ----- Show just the selected player
    let new_list = [];
    for (let i=0; i<this.players.list.length; i++) {
        if (this.players.list[i]['m_id'] === mid) {
            new_list.push(this.players.list[i])
        }
    }
    this.players.previous = this.players.list;
    this.players.list = new_list;
    this.ui_state = 3;

    // ---- Get player's tournaments
    var api_url = server_url + '/player/' + mid;
    vue_vm.ajax.waiting = true;
    get_data(api_url, function(rsp) {
        vue_vm.dbdate = rsp.dbdate;
        vue_vm.tournaments.list = rsp.player.tournaments;

        vue_vm.searching = false;
        vue_vm.showing_results = true;
        vue_vm.ajax.waiting = false;
        vue_vm.ajax.error = false;
    }, function (rsp) {
        vue_vm.ajax.waiting = false;
        vue_vm.ajax.error = true;
    });

}

function show_crosstable(tid) {
    const vue_vm = this;
    this.ui_state = 4;

    // ---- Get tournament's crosstable
    var api_url = server_url + '/tournament/' + tid;
    vue_vm.ajax.waiting = true;
    get_data(api_url, function(rsp) {
        vue_vm.dbdate = rsp.dbdate;
        vue_vm.crosstable.tournament = rsp.tournament;
        let max_rounds = 0;
        let new_list = [];
        for (let i=0; i<rsp.tournament.crosstable.length; i++) {
            let entry = rsp.tournament.crosstable[i];
            entry.results = entry.results.split('|');
            new_list.push(entry);
            max_rounds = Math.max(max_rounds, entry.results.length)
        }
        let r_prefix = (rsp.tournament.pairings==='SS') ? 'R' : '#';
        let rounds = [];
        for (let i=0; i<max_rounds; i++) {
            rounds.push(r_prefix + (i+1));
        }
        vue_vm.crosstable.list = new_list;
        vue_vm.crosstable.rounds = rounds;

        vue_vm.searching = false;
        vue_vm.showing_results = true;
        vue_vm.ajax.waiting = false;
        vue_vm.ajax.error = false;
    }, function (rsp) {
        vue_vm.ajax.waiting = false;
        vue_vm.ajax.error = true;
    });
}

function go_back() {
    if (this.ui_state === 3) {
        this.current_mid = 0;
        this.players.list = this.players.previous;
        this.players.previous = [];
        this.tournaments.list = [];
        this.ui_state = 2;
    } else if (this.ui_state === 4) {
        this.crosstable.list = [];
        this.crosstable.rounds = [];
        this.ui_state = 3;
    }
}

function get_data(api_url, on_success, on_fail) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
            console.log('API call: Success:', xhr);
            let rsp = JSON.parse(xhr.response);
            if (on_success) on_success(rsp);
        } else {
            vue_vm.error_msg = 'Error calling CFC server. Try again later.';
            console.log('API call: Failed:', xhr);
            let rsp = xhr.response && JSON.parse(xhr.response);
            if (on_fail) on_fail(rsp);
        }
    };
    xhr.open('GET', api_url);
    xhr.send();
}

const t_search_form = `
  <p v-if="dbdate">DATA: {{dbdate}}</p>
  <div v-if="ui_state <= 2">
   <p><span v-html="i18n.search_intro"></span></p>
   <form class="field is-grouped is-grouped-multiline" @submit="search">
    <div class="control">
     <label class="label is-small">{{ i18n.cfc_id }}
      <input v-model.trim="mid" class="input is-small" type="text" :placeholder="i18n.cfc_id" @keyup.enter="search">
     </label>
    </div>
    <div class="control">
     <label class="label is-small">{{ i18n.inp_first }}
      <input v-model.trim="first" class="input is-small" type="text" :placeholder="i18n.inp_first" @keyup.enter="search">
     </label>
    </div>
    <div class="control">
     <label class="label is-small">{{ i18n.inp_last }}
      <input v-model.trim="last" class="input is-small" type="text" :placeholder="i18n.inp_last" @keyup.enter="search">
     </label>
    </div>
   </form>
   <a class="button is-small is-info" @click.prevent="search" :class="{'is-loading':ajax.waiting}">{{ i18n.search }}</a>
   <a class="button is-small is-info" @click.prevent="search_reset">{{ i18n.reset }}</a>
  </div>
`;
const t_search_results = `
   <div v-if="ui_state==2 || ui_state==3" class="table-container">
    <a v-if="ui_state==3" class="button is-small is-info" @click.prevent="go_back">{{ i18n.back }}</a>
    <h3 v-if="ui_state==3">{{players.list[0].name}}</h3>
    <table class="ws-ratings-tdlist table is-hoverable is-narrow">
     <thead>
      <tr>
       <th v-if="ui_state==2"></th>
       <th>{{ i18n.name }}</th><th>{{ i18n.city }}</th>
       <th>{{ i18n.cfc_id }}</th><th><span v-html="i18n.cfc_expiry"></span></th>
       <th class="ta-center"><span v-html="i18n.regular_rating"></span></th>
       <th class="ta-center"><span v-html="i18n.regular_high"></span></th>
       <th class="ta-center"><span v-html="i18n.quick_rating"></span></th>
       <th class="ta-center"><span v-html="i18n.quick_high"></span></th>
       <th class="ta-center">FIDE<br>id</th>
      </tr>
     </thead>
     <tbody>
      <tr v-if="ajax.waiting">
       <td></td><td colspan="4">({{ i18n.loading_data }})</td>
      </tr>
      <tr v-if="!ajax.waiting && ajax.error">
       <td></td><td colspan="4">({{ i18n.ajax_error }})</td>
      </tr>
      <tr v-if="!ajax.waiting && players.list.length == 0">
       <td></td><td colspan="4">({{ i18n.none_found }})</td>
      </tr>
      <tr v-for="p in players.list" :key="p.m_id" @click="show_player(p.m_id)" class="is-clickable">
       <td v-if="ui_state==2"><div class="ws-more"></div></td>
       <td>{{p.name}}</td>
       <td>{{p.city_prov}}</td>
       <td>{{p.m_id}}</td>
       <td>{{p.expiry}}</td>
       <template v-if="p.rating_hi > 30" v-once>
        <td class="ta-center">{{p.rating}}</td>
        <td class="ta-center">{{p.rating_hi}}</td>
       </template>
       <template v-else>
        <td class="ta-center"><i>({{p.rating}})</i></td>
        <td class="ta-center"><i>({{p.rating_hi}} {{ i18n.games }})</i></td>
       </template>
       <template v-if="p.quick_hi > 30" v-once>
        <td class="ta-center">{{p.quick}}</td>
        <td class="ta-center">{{p.quick_hi}}</td>
       </template>
       <template v-else>
        <td class="ta-center"><i>({{p.quick}})</i></td>
        <td class="ta-center"><i>({{p.quick_hi}} {{ i18n.games }})</i></td>
       </template>
       <td class="ta-center">
        <a v-if="p.fide_id" :href="'https://ratings.fide.com/profile/'+p.fide_id" target="_blank">{{p.fide_id}}</a>
       </td>
      </tr>
      <tr v-if="ui_state==2">
       <td></td>
       <td colspan="9">
        <ul><li><span v-html="i18n.provisional_notes"></span></li></ul>
       </td>
      </tr>
     </tbody>
    </table>
   </div>
`;
const t_tournaments = `
   <div v-if="ui_state==3" class="table-container">
    <div class="field is-grouped is-grouped-multiline">
     <div class="control">
      <div class="select is-small is-primary">
       <select v-model="filter.t_type">
        <option value="*">{{ i18n.filter_by_type }}</option>
        <option value="*">{{ i18n.all_types }}</option>
        <option value="R">{{ i18n.only_regular }}</option>
        <option value="Q">{{ i18n.only_quick }}</option>
       </select>
      </div>
     </div>
    </div>
    <table class="ws-ratings-tdlist table is-hoverable is-narrow">
     <thead>
      <tr>
       <th></th>
       <th><span v-html="i18n.event"></span></th>
       <th><span v-html="i18n.end_date"></span></th>
       <th class="ta-center"><span v-html="i18n.type"></span></th>
       <th class="ta-center"><span v-html="i18n.games_played"></span></th>
       <th class="ta-center"><span v-html="i18n.score"></span></th>
       <th class="ta-center"><span v-html="i18n.rating_pre"></span></th>
       <th class="ta-center"><span v-html="i18n.rating_perf"></span></th>
       <th class="ta-center"><span v-html="i18n.rating_post"></span></th>
       <th class="ta-center"><span v-html="i18n.rating_high" class="has-text-primary"></span></th>
      </tr>
     </thead>
     <tbody>
      <tr v-if="ajax.waiting">
       <td></td><td colspan="4">({{ i18n.loading_data }})</td>
      </tr>
      <tr v-if="!ajax.waiting && ajax.error">
       <td></td><td colspan="4">({{ i18n.ajax_error }})</td>
      </tr>
      <tr v-if="!ajax.waiting && tournaments.list.length == 0">
       <td></td><td colspan="4">({{ i18n.none_found }})</td>
      </tr>
      <template v-for="t in tournaments.list">
      <tr v-if="filter.t_type=='*' || t.type==filter.t_type" @click="show_crosstable(t.t_id)" class="is-clickable">
       <td><div class="ws-more"></div></td>
       <td>{{t.name}}</td>
       <td>{{t.last_day}}</td>
       <td class="ta-center">{{t.type}}</td>
       <td class="ta-center">{{t.games_played}}</td>
       <td class="ta-center">{{t.score}}</td>
       <td class="ta-center">{{t.rating_pre}}</td>
       <td class="ta-center">{{t.rating_perf}}</td>
       <td class="ta-center">
        <span v-if="t.rating_hi > 50">{{t.rating_post}}</span>
        <span v-else><i>({{t.rating_post}})</i></span>
       </td>
       <td class="has-text-primary ta-center">
        <span v-if="t.rating_hi > 50">{{t.rating_hi}}</span>
        <span v-else><i>({{t.rating_hi}} g)</i></span>
       </td>
      </tr>
      </template>
     </tbody>
    </table>
    <div class="notification is-warning">{{ i18n.missing_2005 }}</div>
   </div>
`;
const t_crosstable = `
   <div v-if="ui_state==4" class="table-container">
    <a class="button is-small is-info" @click.prevent="go_back">{{ i18n.back }}</a>
    <h3>{{crosstable.tournament.name}}</h3>
    <table class="ws-ratings-tdlist table is-hoverable is-narrow">
     <thead>
      <tr>
       <th><span v-html="i18n.event"></span></th>
       <th><span v-html="i18n.end_date"></span></th>
       <th><span v-html="i18n.type"></span></th>
       <th><span v-html="i18n.pairings"></span></th>
       <th><span v-html="i18n.prov"></span></th>
       <th><span v-html="i18n.org_name"></span></th>
      </tr>
     </thead>
     <tbody>
      <tr>
       <td>{{crosstable.tournament.name}}</td>
       <td>{{crosstable.tournament.last_day}}</td>
       <td>
        <span v-if="crosstable.tournament.type == 'R'">{{i18n.regular}}</span>
        <span v-else-if="crosstable.tournament.type == 'Q'">{{i18n.quick}}</span>
        <span v-else>{{crosstable.tournament.type}}</span>
       </td>
       <td>
        <span v-if="crosstable.tournament.pairings == 'RR'">{{i18n.rr}}</span>
        <span v-else-if="crosstable.tournament.pairings == 'SS'">{{i18n.swiss}}</span>
        <span v-else>{{crosstable.tournament.pairings}}</span>
       </td>
       <td>{{crosstable.tournament.prov}}</td>
       <td>{{crosstable.tournament.org_name}}</td>
      </tr>
     </tbody>
    </table>
     
    <table class="ws-ratings-tdlist table is-hoverable is-narrow">
     <thead>
      <tr>
       <th>#</th>
       <th><span v-html="i18n.player"></span></th>
       <th><span v-html="i18n.score"></span></th>
       <!-- results -->
       <template v-for="r in crosstable.rounds">
        <th class="ta-right">{{ r }}</th>
       </template>
       <th>&nbsp;</th>
       <th class="ta-center"><span v-html="i18n.rating_pre"></span></th>
       <th class="ta-center"><span v-html="i18n.rating_perf"></span></th>
       <th class="ta-center"><span v-html="i18n.rating_post"></span></th>
      </tr>
     </thead>
     <tbody>
      <tr v-if="ajax.waiting">
       <td></td><td colspan="4">({{ i18n.loading_data }})</td>
      </tr>
      <tr v-if="!ajax.waiting && ajax.error">
       <td></td><td colspan="4">({{ i18n.ajax_error }})</td>
      </tr>
      <tr v-if="!ajax.waiting && crosstable.list.length == 0">
       <td></td><td colspan="4">({{ i18n.none_found }})</td>
      </tr>
      <template v-for="ct in crosstable.list">
      <tr :class="{'ws-bg-highlight': ct.m_id==current_mid}">
       <td>{{ct.place}}</td>
       <td>{{ct.m_name}}</td>
       <td>{{ct.score}}</td>
       <template v-for="r in ct.results">
        <td class="ta-right">{{r}}</td>
       </template>
       <td>&nbsp;</td>
       <td class="ta-center">{{ct.rating_pre}}</td>
       <td class="ta-center">{{ct.rating_perf}}</td>
       <td class="ta-center">
        <span v-if="ct.rating_hi > 50">{{ct.rating_post}}</span>
        <span v-else><i>({{ct.rating_post}})</i></span>
       </td>
      </tr>
      </template>
     </tbody>
    </table>
   </div>
`;
const vue_template = '<div>'
    + t_search_form
    + t_search_results
    + t_tournaments
    + t_crosstable
    + '</div>';

const i18n_en = {
    // ---- (shared)
    cfc_id: 'CFC id', back: '< Back', games: 'g',
    loading_data: 'Loading data ...', none_found: 'NONE FOUND',
    ajax_error: 'Error calling the CFC server. Try again later.',
    // ---- t_search_form
    search_intro: 'Search for players.  Use * as a wild card; example: Mag* Carl*',
    inp_first: 'First name', inp_last: 'Last name',
    search: 'Search', reset: 'Reset',
    // ---- t_search_results
    name: 'Name', city: 'City', cfc_expiry: 'CFC Expiry',
    regular_rating: 'Regular<br>Rating', regular_high: 'Regular<br>High',
    quick_rating: 'Quick<br>Rating', quick_high: 'Quick<br>High',
    provisional_notes: '<i>(&mldr;)</i> is a provisional rating. <i>(&mldr;g)</i> is the number of games rated',
    // ---- t_tournaments
    filter_by_type: 'Filter by type', all_types: 'All Tournaments',
    only_regular: 'Only regular tournaments', only_quick: 'Only quick tournaments',
    event: 'Event', end_date: 'End Date', type: 'Type',
    games_played: 'Games<br>Played', score: 'Score',
    rating_pre: 'Old<br>Rating', rating_perf: 'Perf<br>Rating',
    rating_post: 'New<br>Rating', rating_high: 'Highest<br>Rating',
    missing_2005: 'Events before 2006 are not (yet!) available. The data from before 2006 is being reconstructed and will be available soon. Thanks for your patience.',
    // ---- t_crosstable
    pairings: 'Pairings', prov: 'Prov', org_name: 'Organizer',
    player: 'Player',
    regular: 'Regular', quick: 'Quick',
    rr: 'Round Robin', swiss: 'Swiss Sys',
    zzz: 'zzz'
};
const i18n_fr = {
    // ---- (shared)
    cfc_id: 'FCE id', back: '< Retourner', games: 'j',
    loading_data: 'Chargement des données ...', none_found: 'PERSONNE N\'EST TROUVE',
    ajax_error: 'Erreur lors de l\'appel du serveur FCE. Réessayez plus tard.',
    // ---- t_search_form
    search_intro: 'Recherchez des joueurs. Utilisez * comme joker; exemple: Mag* Carl*',
    inp_first: 'Prénom', inp_last: 'Nom de famille',
    search: 'Chercher', reset: 'Réinitialiser',
    // ---- t_search_results
    name: 'Nom', city: 'Ville', cfc_expiry: 'Expiration<br>du FCE',
    regular_rating: 'Cote<br>Régulière', regular_high: 'Régulier<br>élevé',
    quick_rating: 'Cote<br>Rapide', quick_high: 'Rapide<br>élevé',
    provisional_notes: '<i>(&mldr;)</i> est une note provisoire. <i>(&mldr; j)</i> est le nombre de jeux notés',
    // ---- t_tournaments
    filter_by_type: 'Filtrer par type', all_types: 'Tous les tournois',
    only_regular: 'Seuls les tournois réguliers', only_quick: 'Seuls les tournois rapides',
    event: 'événement', end_date: 'Date de fin', type: 'Type',
    games_played: 'Jeux<br>joués', score: 'Score',
    rating_pre: 'Ancien<br>Cote', rating_perf: 'Perf<br>Cote',
    rating_post: 'Nouvelle<br><br>Cote', rating_high: 'plus élevée<br>Cote',
    missing_2005: 'Les événements avant 2006 ne sont pas (encore!) Disponibles. Les données antérieures à 2006 sont en cours de reconstitution et seront bientôt disponibles. Merci pour votre patience.',
    // ---- t_crosstable
    pairings: 'Appariements', prov: 'Prov', org_name: 'Organisateur',
    player: 'Joueur',
    regular: 'Régulier', quick: 'Rapide',
    rr: 'Round Robin', swiss: 'Swiss Sys',
    zzz: 'zzz'
};

export function add_component(Vue) {
    Vue.component(vue_tag, {
        props: vue_props,
        data: vue_data,
        methods: vue_methods,
        beforeMount: vue_beforeMount,
        template: vue_template
    });
}
