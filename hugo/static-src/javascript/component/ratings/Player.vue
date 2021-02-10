
<script>
    import { api } from '../../shared';
    import { get_i18n } from './i18n';
    import PlayerList from './PlayerList.vue';

    function vue_data() { return {
        c_state: 'loading',
        mid: this.$route.params.mid,
        dbdate: '',
        player: {},
        players: { list: [] },
        tournaments: { list: [] },
        filter: { t_type: '*' },
        i18n: get_i18n()
    }; }

    function vue_created() {
        this.initData();
    }

    const vue_watch = { '$route': 'initData' };

    //------------------------------------------------------------------
    function initData() {
        const vm = this;
        const mid = vm.$route.params.mid;
        vm.c_state = 'loading';
        api({api: '/ratings/player/'+mid,
            onSuccess: function(rsp) {
                vm.dbdate = rsp.dbdate || '???';
                if (rsp.apicode!==0 || rsp.error) {
                    vm.c_state = 'error';
                } else {
                    vm.player = rsp.player || {};
                    // vm.players.list = [p];
                    vm.tournaments.list = vm.player.tournaments || [];
                    vm.c_state = 'showing';
                }
            },
            onFail: function(rsp) {
                vm.c_state = 'error';
            }
        });
    }

    function show_crosstable(tid) {
        const vm = this;
        vm.$router.push({name:'tournament', params:{tid:tid, mid:vm.mid}});
    }

    //------------------------------------------------------------------
    export default {
        data: vue_data, created: vue_created, watch: vue_watch,
        methods: { initData, show_crosstable },
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
    <div v-else>
      <player-list :players="[player]" is-single></player-list>
      <br>
      <div class="table-container">
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
          <thead v-once>
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
            <tr v-if="tournaments.list.length == 0">
              <td></td><td colspan="4">({{ i18n.none_found }})</td>
            </tr>
            <template v-for="t in tournaments.list">
              <tr v-if="filter.t_type==='*' || t.type===filter.t_type" @click="show_crosstable(t.t_id)" class="is-clickable">
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
      </div>
    </div>
    <div v-if="dbdate" class="notes">
      - Data: {{dbdate}}
    </div>
  </div>
</template>

<style>
  h4, .notes { border-top:1px solid #759556; margin-top:4rem; }
</style>
