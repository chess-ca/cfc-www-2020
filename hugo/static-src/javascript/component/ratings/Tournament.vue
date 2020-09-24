
<script>
    import { api } from '../../shared';
    import { get_i18n } from './i18n';
    import PlayerList from './PlayerList.vue';

    function vue_data() { return {
        c_state: 'loading',
        tid: this.$route.params.tid,
        mid: this.$route.params.mid,
        crosstable: { list: [], rounds: [], tournament: {} },
        highlighted_mid: this.$route.params.mid,
        dbdate: '',
        not_found: false,
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
        api({api: '/ratings/tournament/'+vm.tid,
            onSuccess: function(rsp) {
                vm.dbdate = rsp.dbdate || '???';
                if (rsp.apicode!==0 || rsp.error) {
                    vm.c_state = 'error';
                } else if (!rsp.tournament) {
                    vm.not_found = true;
                    vm.c_state = 'showing';
                } else {
                    //---- Split results from "+27|-12|=4|..." to an array
                    let max_rounds = 0;
                    let crosstable = [];
                    for (let i=0; i<rsp.tournament.crosstable.length; i++) {
                        let entry = rsp.tournament.crosstable[i];
                        entry.results = entry.results.split('|');
                        crosstable.push(entry);
                        max_rounds = Math.max(max_rounds, entry.results.length)
                    }
                    //---- Column headings for rounds depend on tournament type (Swiss or RR)
                    let r_prefix = (rsp.tournament.pairings==='SS') ? 'R' : '#';
                    let rounds = [];
                    for (let i=1; i<=max_rounds; i++) {
                        rounds.push(r_prefix + i);
                    }
                    //---- Set the view-model
                    vm.dbdate = rsp.dbdate;
                    vm.crosstable.tournament = rsp.tournament;
                    vm.crosstable.list = crosstable;
                    vm.crosstable.rounds = rounds;
                    vm.c_state = 'showing';
                }
            },
            onFail: function(rsp) {
                vm.c_state = 'error';
            }
        });
    }

    function show_player(mid) {
        const vm = this;
        vm.$router.push({name:'player', params:{mid:mid}});
    }

    //------------------------------------------------------------------
    export default {
        data: vue_data, created: vue_created, watch: vue_watch,
        methods: { initData, show_player },
        components: { 'player-list': PlayerList }
    };
</script>

<template>
  <div>
    <div v-if="c_state==='loading'">
      <cfc-spinner></cfc-spinner>
    </div>
    <div v-else-if="c_state==='error'">
      <p class="ws-error">Error fetching data. Try again later.</p>
    </div>
    <div v-else class="table-container">
      <br>
      <table class="ws-ratings-tdlist table is-hoverable is-narrow">
        <thead v-once>
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
        <tr v-if="not_found">
          <td></td><td colspan="5">({{ i18n.none_found }})</td>
        </tr>
        <tr class="ws-bg-highlight">
          <td v-text="crosstable.tournament.name"></td>
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

      <table v-if="!not_found" class="ws-ratings-tdlist table is-hoverable is-narrow">
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
        <template v-for="ct in crosstable.list">
          <tr @click="show_player(ct.m_id)" :class="{'ws-bg-highlight': ct.m_id==highlighted_mid}" class="is-clickable">
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
      <div v-if="dbdate" class="notes">
        - Data: {{dbdate}}
      </div>
    </div>
  </div>
</template>
