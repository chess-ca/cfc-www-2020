
<script>
    import { api } from '../../shared';
    import { get_i18n } from './i18n';
    import TournamentList from './TournamentList.vue';

    function vue_data() { return {
        c_state: 'loading',
        name: this.$route.query.name,
        days: this.$route.query.days,
        year: this.$route.query.year,
        dbdate: '',
        tournaments: { list: [] },
        is_year: false,
        i18n: get_i18n()
    }; }

    function vue_created() {
        this.initData();
    }

    const vue_watch = { '$route': 'initData' };

    //------------------------------------------------------------------
    function initData() {
        const vm = this;
        vm.c_state = 'loading';
        let api_url = '/ratings/tournament';
        let is_years = false;
        if (vm.name && vm.name!=='') {
            api_url += '/find?name=' + vm.name;
        } else if (vm.days) {
            api_url += '/days/' + vm.days;
        } else if (vm.year) {
            vm.is_year = true;
            api_url += '/year/' + vm.year;
        } else {
            console.log('name, days, year =', vm.name, vm.days, vm.year);
            vm.c_state = 'error';
        }
        api({api: api_url,
            onSuccess: function(rsp) {
                vm.dbdate = rsp.dbdate || '???';
                if (rsp.apicode!==0 || rsp.error) {
                    vm.c_state = 'error';
                } else if (!Array.isArray(rsp.tournaments) || rsp.tournaments.length===0) {
                    vm.tournaments.list = [];
                    vm.c_state = 'showing';
                } else {
                    vm.tournaments.list = rsp.tournaments;
                    vm.c_state = 'showing';
                }
            },
            onFail: function(rsp) {
                vm.c_state = 'error';
            }
        });
    }

    //------------------------------------------------------------------
    export default {
        data: vue_data, created: vue_created, watch: vue_watch,
        methods: { initData },
        components: { 'tournament-list': TournamentList }
    };
</script>

<template>
  <div>
    <div v-if="c_state==='loading'">
      <cfc-spinner></cfc-spinner>
    </div>
    <div v-else-if="c_state==='error'">
      <p class="ws-error" v-text="i18n.err_fetching"></p>
    </div>
    <div v-else>
      <tournament-list :tournaments="tournaments.list" :is-year="is_year"></tournament-list>
      <div v-if="dbdate" class="notes">
        - Data: {{dbdate}}
      </div>
    </div>
  </div>
</template>

<style>
  h4, .notes { border-top:1px solid #759556; margin-top:3rem; }
</style>
