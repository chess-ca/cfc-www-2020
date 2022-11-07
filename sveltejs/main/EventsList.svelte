<p>&#x27A4; {@html i18n.caveat }</p>
<div class="field is-grouped is-grouped-multiline">
 <div class="control">
  <div class="select is-small is-primary">
   <select bind:value={e_type}>
    <option value="*">{ i18n.filter_by_type }</option>
    <option value="*">{ i18n.all_types }</option>
    <option value="Online">{ i18n.online }</option>
    <option value="OTB">{ i18n.otb }</option>
    <option value="Junior-Online">{ i18n.jr_online }</option>
    <option value="Junior-OTB">{ i18n.jr_otb }</option>
   </select>
  </div>
 </div>
 <div class="control">
  <div class="select is-small is-primary">
   <select bind:value={e_prov}>
    <option value="*">{ i18n.filter_by_location }</option>
    <option value="*">{ i18n.all_provinces }</option>
    <option value="Online">{ i18n.online }</option>
    <option value="AB">AB - Alberta</option>
    <option value="BC">BC - British Columbia</option>
    <option value="MB">MB - Manitoba</option>
    <option value="NB">NB - New Brunswick</option>
    <option value="NL">NL - Newfoundland and Labrador</option>
    <option value="NT">NT - Northwest Territories</option>
    <option value="NS">NS - Nova Scotia</option>
    <option value="NU">NU - Nunavut</option>
    <option value="ON">ON - Ontario</option>
    <option value="PE">PE - Prince Edward Island</option>
    <option value="QC">QC - Quebec</option>
    <option value="SK">SK - Saskatchewan</option>
    <option value="YT">YT - Yukon</option>
    <option value="FO">{ i18n.foreign }</option>
   </select>
  </div>
 </div>
 <div class="control ml-6">
  <a href="https://forms.gle/w9EXzkLtRUhabrns9" target="_blank" rel="noreferrer"
      class="button is-small is-primary">{ i18n.addevent }</a>
 </div>
</div>

<div class="table-container">
 <table class="ws-ratings-tdlist table is-hoverable is-narrow" style="min-width:800px;">
  <thead>
  <tr>
   <th>{ i18n.dates }</th><th>{ i18n.event }</th>
   <th>{ i18n.type }</th><th>{ i18n.location }</th>
   <!--th>{{ i18n.province }}</th--><th>{ i18n.info }</th>
  </tr>
  </thead>
  <tbody>
   {#each filtered_events(e_type, e_prov) as e (e.oid)}
    {#if e.new_year}
     <tr><td></td><td colspan="99"><strong>---- {e.new_year} ----</strong></td></tr>
    {:else}
     <tr>
      <td>{e.dates[lang]}</td>
      <td>{@html e.name}</td>
      <td>{e.type}</td>
      <td>{e.city_prov}</td>
      <td>{@html e.links}</td>
     </tr>
    {/if}
   {:else}
     <tr><td></td><td colspan="99">{ i18n.none }</td></tr>
   {/each}
  </tbody>
 </table>
 <p>
  <a href="https://forms.gle/w9EXzkLtRUhabrns9" target="_blank" rel="noreferrer"
      class="button is-small is-primary">{ i18n.addevent }</a>
 </p>
</div>

<script>
    import {get_global} from "../_shared";

    export let lang = 'en';
    export let events_varname = 'events';

    const i18n = window.page_i18n;
    let e_type = '*';
    let e_prov = '*';
    const today = (new Date()).toISOString().slice(0,10)

    function filtered_events(e_type, e_prov) {
        // (type, prov are passed as args so its use is reactive to changes)
        const all_events = get_global(events_varname) || [];
        let current_year = today.slice(0,4);
        const events = [];
        for (let e of all_events) {
            if (e.end < today)
                continue;
            if (e.type !== e_type && e_type !== '*')
                continue;
            if (e.prov !== e_prov && e_prov !== '*')
                continue;

            const events_year = e.start.slice(0, 4);
            if (events_year !== current_year) {
                current_year = events_year;
                events.push({new_year: current_year, oid: 'YEAR'+current_year});
            }
            e.city_prov = (e.prov === 'Online' || e.prov === 'FO')
                ? e.city : `${e.city}, ${e.prov}`
            events.push(e);
        }
        return events;
    }
</script>