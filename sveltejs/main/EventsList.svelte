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
    <option value="Online">-- { i18n.online } --</option>
    {#each get_data.provinces() as p}
     <option value={p.code}>{p.name}</option>
    {/each}
    <option value="FO">-- { i18n.foreign } --</option>
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
    import {get_data} from '../data_access';

    export let lang = 'en';

    const i18n = get_data.page_i18n();
    let e_type = '*';
    let e_prov = '*';

    function filtered_events(e_type, e_prov) {
        const all_events = get_data.events_upcoming();
        let current_year = (new Date()).getFullYear().toString();
        const events = [];
        for (let e of all_events) {
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