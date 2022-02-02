
<div>
 {#await getDataPromise()}
  <Spinner/>

 {:then getDataResult}
  {#if ! p.name_last}
   <!-- ---- ---- Player Not Found ---- ---- -->
   <section class="container pad-touch-only">
    <p>"{p.cfc_id}" not found.</p>
   </section>
  {:else}
   <!-- ---- ---- Player Status ---- ---- -->
   <section aria-label="Player Status" class="container pad-touch-only">
    <table>
     <tbody>
      <tr class="t-title"><td>CFC id</td></tr>
      <tr class="t-data"><td>{p.cfc_id}</td></tr>
      <tr class="t-title"><td>CFC expiry date</td></tr>
      <tr class="t-data {cfc_expiry_class(p.cfc_expiry)}"><td>{cfc_expiry(p.cfc_expiry)}</td></tr>
      <tr class="t-title"><td>First name</td></tr>
      <tr class="t-data"><td>{p.name_first}</td></tr>
      <tr class="t-title"><td>Last name</td></tr>
      <tr class="t-data"><td>{p.name_last}</td></tr>
      <tr class="t-title"><td>Rating - REGULAR</td></tr>
      <tr class="t-data"><td>{@html rating(p.regular_rating, p.regular_indicator)}</td></tr>
      <tr class="t-title"><td>Rating - QUICK</td></tr>
      <tr class="t-data"><td>{@html rating(p.quick_rating, p.quick_indicator)}</td></tr>
      <tr class="t-title"><td>Residence</td></tr>
      <tr class="t-data"><td>{p.addr_city + ', ' + p.addr_province}</td></tr>
      <tr class="t-title"><td>FIDE id</td></tr>
      <tr class="t-data fyi"><td>{p.fide_id ? p.fide_id : '(none)'}</td></tr>
      <tr class="t-title"><td>Data as of</td></tr>
      <tr class="t-data fyi"><td>{updated}</td></tr>
     </tbody>
    </table>
   </section>
  {/if}

 {:catch getDataErr}
  <p>Error: {getDataErr.message}</p>
 {/await}
</div>

<script>
    import Spinner from '../misc/Spinner.svelte';
    import {get_lang, goto, get_url_query_vars} from '../shared';
    import {call_api_promise} from '../shared';

    // const page_lang = get_lang();
    let updated = '';
    let p = {}
    const i18n = window.App_i18n.ratings_player_status;    // See: hugo/assets/i18n/i18n.<lang>.js

    function cfc_expiry(expiry) {
        if (!expiry) return '&ndash;'
        if (expiry > '2080-01-01') return 'LIFE';
        if (expiry < '1980-01-01') return '&ndash;';
        return expiry;
    }
    function cfc_expiry_class(expiry) {
        let date = new Date();
        const now_ymd = date.toISOString().split('T')[0];
        date.setDate(date.getDate() + 14);
        const warn_ymd = date.toISOString().split('T')[0];
        if (!expiry || expiry <= now_ymd) return 'expired';
        if (expiry <= warn_ymd) return 'warning';
        return '';
    }
    function rating(value, indicator) {
        return (indicator > 40) ? value
            : `<i>(${value}) in ${indicator}g</i>`;
    }

    function getDataPromise() {
        const q_vars = get_url_query_vars();
        const cfc_id = q_vars['id'] || '0';
        const url = 'https://server.chess.ca/api/player/v1/' + cfc_id;
        return call_api_promise({
            method:'GET', url, onComplete, onError
        });

        function onComplete(event, rsp) {
            rsp = rsp || {};
            updated = rsp.updated;
            p = rsp.player || {};

            const el_h1 = document.getElementById('ws-page-title');
            if (el_h1) el_h1.innerText = `${p.name_first} ${p.name_last}`;
        }
        function onError(event) {}
    }
</script>

<style>
 table { max-width: 400px; }
 table tr.t-title td {
     font-size:0.75rem; vertical-align: bottom; padding:0; height:1.75rem;
 }
 table tr.t-data td {
     font-weight: bold; background-color: #dfd;
     font-size:1.2rem; padding:0.25rem 0.5rem;
 }
 table tr.t-data.expired td { background-color: #fdd; }
 table tr.t-data.warning td { background-color: #ffa; }
 table tr.t-data.fyi td { background-color: #f8f8f8; font-weight: normal; }
</style>