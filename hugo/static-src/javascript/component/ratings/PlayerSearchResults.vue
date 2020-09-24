
<script>
    import { api } from '../../shared';
    import { get_i18n } from './i18n';
    import PlayerList from './PlayerList.vue';

    function vue_data() { return {
        c_state: 'loading',
        first: this.$route.params.first,
        last: this.$route.params.last,
        dbdate: '',
        players: { list: [] },
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
        api({api: '/ratings/player/find?first='+vm.first+'&last='+vm.last,
            onSuccess: function(rsp) {
                vm.dbdate = rsp.dbdate || '???';
                if (rsp.apicode!==0 || rsp.error) {
                    vm.c_state = 'error';
                } else if (!Array.isArray(rsp.players) || rsp.players.length===0) {
                    vm.players.list = [];
                    vm.c_state = 'showing';
                } else {
                    vm.players.list = rsp.players;
                    vm.c_state = 'showing';
                }
            },
            onFail: function(rsp) {
                vm.c_state = 'error';
            }
        });
    }

    //------------------------------------------------------------------
    function show_player(mid) {}

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
      <p class="ws-error" v-text="i18n.err_fetching"></p>
    </div>
    <div v-else>
      <player-list :players="players.list"></player-list>
      <div v-if="dbdate" class="notes">
        - Data: {{dbdate}}
      </div>
    </div>
  </div>
</template>

<style>
  h4, .notes { border-top:1px solid #759556; margin-top:3rem; }
</style>
