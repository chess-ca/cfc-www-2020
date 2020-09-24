
import Vue from 'vue';
import VueRouter from 'vue-router';
import Search from '../component/ratings/Search.vue';
import PlayerSearchResults from '../component/ratings/PlayerSearchResults.vue';
import Player from '../component/ratings/Player.vue';
import Tournament from '../component/ratings/Tournament.vue';
import TournamentSearchResults from "../component/ratings/TournamentSearchResults.vue";

Vue.use(VueRouter);

function goForward() {
    this.routeTransition = 'ws-go-forward';
    this.$router.forward();
}

function goBack() {
    this.routeTransition = 'ws-go-back';
    window.history.length > 1 ? this.$router.go(-1) : this.$router.push('/')
}

function afterTransition() {
    this.routeTransition = 'ws-go-forward';
}

function init(pginfo, vue_config) {
    if (pginfo.id !== 'pg-ratings') return;

    const routes = [
        { path:'/', name:'search', component:Search },
        { path:'/psr/:first/:last', name:'player-search-results', component:PlayerSearchResults },
        { path:'/p/:mid', name:'player', component:Player },
        //{ path:'/ps/:mid', component:Player },                    // Summary for QR-code
        { path:'/tsr', name:'tournament-search-results', component:TournamentSearchResults },     // ?days=&year=&name=
        { path:'/t/:tid/:mid?', name:'tournament', component:Tournament },
        //{ path:'/td/:days', name:'tournament-last-days', component:TournamentLastDays },
        //{ path:'/ty/:year', name:'tournament-year', component:TournamentsYear },
    ];
    vue_config.router = new VueRouter({
        routes,
        scrollBehavior: (to, from, savedPosition) => (savedPosition || false)
    });

    vue_config.data.routeTransition = 'ws-go-forward';
    vue_config.data.dbdate = '_';
    vue_config.methods = vue_config.methods || {};
    vue_config.methods.goForward = goForward;
    vue_config.methods.goBack = goBack;
    vue_config.methods.afterTransition = afterTransition;
}

export default { init };
