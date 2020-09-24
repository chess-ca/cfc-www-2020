
<script>
    import { get_i18n } from './i18n';

    function vue_data() { return {
        dbdate: '2020-99-99',
        mid: '', first: '', last: '',
        name: '',
        ajax: { waiting: false, error: '' },
        err: {s4p:null, s4t:null},
        error_msg: null,
        i18n: get_i18n()
    }; }

    //------------------------------------------------------------------
    function searchForPlayers(event) {
        const vm = this;
        vm.err.s4p = null;
        let mid = String(vm.mid).trim();
        if (mid !== '') {
            vm.$router.push({name:'player', params:{mid:mid}});
        } else {
            let first = String(vm.first).trim() || '*';
            let last = String(vm.last).trim() || '*';
            if (first==='*' && last==='*') {
                vm.err.s4p = vm.i18n.err_enter_criteria;
                return;
            }
            vm.$router.push({name:'player-search-results',
                params:{first:first, last:last}});
        }
    }

    function tournaments_lastdays(days) {
        this.$router.push({ name:'tournament-search-results',
            query:{days:days} });
    }

    function tournaments_year(year) {
        this.$router.push({ name:'tournament-search-results',
            query:{year:year} });
    }

    function tournaments_name() {
        const vm = this;
        vm.name = String(vm.name).trim();
        if (vm.name !== '') {
            this.$router.push({ name:'tournament-search-results',
                query:{name:vm.name} });
        } else {
            vm.err.s4t = vm.i18n.err_enter_criteria;
        }
    }

    //------------------------------------------------------------------
    export default {
        data: vue_data,
        methods: { searchForPlayers, tournaments_lastdays,
            tournaments_year, tournaments_name }
    };
</script>

<template>
  <div>
    <h4 v-text="i18n.search_for_players" v-once/>
    <form class="field is-grouped is-grouped-multiline">
      <div class="control">
        <label class="label is-small"><span v-text="i18n.cfc_id" v-once/>
          <input v-model.trim="mid" class="input is-small" type="text" :placeholder="i18n.cfc_id" @keyup.enter="searchForPlayers">
        </label>
      </div>
      <div class="control">
        <label class="label is-small"><span v-text="i18n.inp_first" v-once/>
          <input v-model.trim="first" class="input is-small" type="text" :placeholder="i18n.inp_first" @keyup.enter="searchForPlayers">
        </label>
      </div>
      <div class="control">
        <label class="label is-small"><span v-text="i18n.inp_last" v-once/>
          <input v-model.trim="last" class="input is-small" type="text" :placeholder="i18n.inp_last" @keyup.enter="searchForPlayers">
        </label>
      </div>
    </form>
    <p v-if="err.s4p" class="ws-error">{{err.s4p}}</p>
    <a class="button is-small is-info" @click.prevent="searchForPlayers" v-text="i18n.search"/>

    <h4 v-text="i18n.search_for_events" v-once/>
    <a class="button is-small is-info" @click.prevent="tournaments_lastdays(60)" v-text="i18n.last_nn_days"></a>
    <a class="button is-small is-info" @click.prevent="tournaments_year(2020)"">2020</a>
    <br><br>
    <form class="field is-grouped is-grouped-multiline">
      <div class="control">
        <label class="label is-small"><span v-text="i18n.inp_event_name" v-once/>
          <input v-model="name" class="input is-small" type="text" :placeholder="i18n.inp_event_name" @keyup.enter.prevent="tournaments_name">
        </label>
      </div>
    </form>
    <p v-if="err.s4t" class="ws-error">{{err.s4t}}</p>
    <a class="button is-small is-info" @click.prevent="tournaments_name" v-text="i18n.search"/>

    <br><br>
    <div class="notes">
      - <span v-html="i18n.search_intro" v-once/>
    </div>
  </div>
</template>

<style>
  h4, .notes { border-top:1px solid #759556; margin-top:2rem; }
</style>
