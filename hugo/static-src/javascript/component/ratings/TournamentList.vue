
<script>
    import { get_i18n } from './i18n';

    const year_hi = 2020;
    const year_lo = 2006;

    const vue_props = {
        'tournaments': { type:Array, required:true },
        'isYear': { type:Boolean, default:false }
    };

    function vue_data() { return {
        i18n: get_i18n()
    }; }

    const vue_computed = {
        show_provisional_notes: function() {
            for (let i=0; i<this.tournaments.length; i++) {
                let p = this.tournaments[i];
                if (p.rating_hi < 30 || p.quick_hi < 30) return true;
            }
            return false;
        },
        years: function() {
            let years = [];
            for (let yr=year_hi; yr>=year_lo; yr--) years.push(y);
            return years;
        }
    };

    //------------------------------------------------------------------
    function show_crosstable(tid) {
        this.$router.push({name:'tournament', params:{tid:tid}})
    }

    //------------------------------------------------------------------
    export default {
        props: vue_props, data: vue_data, computed: vue_computed,
        methods: { show_crosstable }
    };

    // DATA: t_id, name, last_day, prov, pairings(SS|RR), type(R|Q), org_name
</script>

<template>
  <div>
    <table class="ws-ratings-tdlist table is-hoverable is-narrow">
      <thead v-once>
        <tr>
          <th></th>
          <th><span v-html="i18n.event"></span></th>
          <th><span v-html="i18n.end_date"></span></th>
          <th><span v-html="i18n.type"></span></th>
          <th><span v-html="i18n.pairings"></span></th>
          <th><span v-html="i18n.prov"></span></th>
          <th><span v-html="i18n.org_name"></span></th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="tournaments.length === 0">
          <td></td><td colspan="4" v-text="i18n.none_found"></td>
        </tr>
        <tr v-for="t in tournaments" :key="t.t_id" @click="show_crosstable(t.t_id)" class="is-clickable">
          <td><div class="ws-more"></div></td>
          <td v-text="t.name"></td>
          <td v-text="t.last_day"></td>
          <td v-text="t.type"></td>
          <td v-text="t.pairings"></td>
          <td v-text="t.prov"></td>
          <td v-text="t.org_name"></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style>
  h4, .notes { border-top:1px solid #759556; margin-top:4rem; }
</style>
