
<script>
    import { get_i18n } from './i18n';

    const vue_props = {
        'players': { type:Array, required:true },
        'isSingle': { type:Boolean, default:false }
    };

    function vue_data() { return {
        i18n: get_i18n()
    }; }

    const vue_computed = {
        show_provisional_notes: function() {
            for (let i=0; i<this.players.length; i++) {
                let p = this.players[i];
                if (p.rating_hi < 30 || p.quick_hi < 30) return true;
            }
            return false;
        }
    };

    //------------------------------------------------------------------
    function show_player(mid) {
        if (!this.isSingle) {
            this.$router.push({name:'player', params:{mid:mid}})
        }
    }

    //------------------------------------------------------------------
    export default {
        props: vue_props, data: vue_data, computed: vue_computed,
        methods: { show_player }
    };
</script>

<template>
  <div>
    <table class="ws-ratings-tdlist table is-hoverable is-narrow">
      <thead>
      <tr v-once>
        <th v-if="!isSingle"></th>
        <th v-text="i18n.name"></th>
        <th v-text="i18n.city"></th>
        <th v-text="i18n.cfc_id"></th>
        <th v-html="i18n.cfc_expiry"></th>
        <th class="ta-center" v-html="i18n.regular_rating"></th>
        <th class="ta-center" v-html="i18n.regular_high"></th>
        <th class="ta-center" v-html="i18n.quick_rating"></th>
        <th class="ta-center" v-html="i18n.quick_high"></th>
        <th class="ta-center">FIDE<br>id</th>
      </tr>
      </thead>
      <tbody>
      <tr v-if="players.length === 0">
        <td></td><td colspan="4" v-text="i18n.none_found"></td>
      </tr>
      <tr v-for="p in players" :key="p.m_id" @click="show_player(p.m_id)" :class="{'is-clickable':!isSingle, 'ws-bg-highlight':isSingle}">
        <td v-if="!isSingle"><div class="ws-more"></div></td>
        <td v-text="p.name"></td>
        <td v-text="p.city_prov"></td>
        <td v-text="p.m_id"></td>
        <td v-if="p.expiry > '2080-01-01'">LIFE</td>
        <td v-else v-text="p.expiry"></td>
        <template v-if="p.rating_hi > 30" v-once>
          <td class="ta-center" v-text="p.rating"></td>
          <td class="ta-center" v-text="p.rating_hi"></td>
        </template>
        <template v-else>
          <td class="ta-center"><i>({{p.rating}})</i></td>
          <td class="ta-center"><i>({{p.rating_hi}} {{ i18n.games }})</i></td>
        </template>
        <template v-if="p.quick_hi > 30" v-once>
          <td class="ta-center" v-text="p.quick"></td>
          <td class="ta-center" v-text="p.quick_hi"></td>
        </template>
        <template v-else>
          <td class="ta-center"><i>({{p.quick}})</i></td>
          <td class="ta-center"><i>({{p.quick_hi}} {{ i18n.games }})</i></td>
        </template>
        <td class="ta-center">
          <a v-if="p.fide_id" :href="'https://ratings.fide.com/profile/'+p.fide_id" target="_blank">{{p.fide_id}}</a>
        </td>
      </tr>
      <tr v-if="show_provisional_notes">
        <td></td>
        <td colspan="9">
          <ul><li><span v-html="i18n.provisional_notes"></span></li></ul>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<style>
  h4, .notes { border-top:1px solid #759556; margin-top:4rem; }
</style>
