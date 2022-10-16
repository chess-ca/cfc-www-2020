
{#await getting_data}
 <div style="margin-top:4rem;"><Spinner/></div>

{:then d}
 <!-- ---- ---- Player Status ---- ---- -->
 <section aria-label="Player Status" class="container pad-touch-only">
  <table on:click={goto_handler} on:keyup={a11y_click(goto_handler)}>
   <tbody>
    <tr class="t-title"><td>CFC id</td></tr>
    <tr class="t-data" class:expired={!found}><td>{p.cfc_id}</td></tr>
    {#if found}
     <tr class="t-title"><td>CFC expiry date</td></tr>
     <tr class="t-data {cfc_expiry_class(p.cfc_expiry)}"><td>{fmt_cfc_expiry(p.cfc_expiry)}</td></tr>
     <tr class="t-title"><td>First name</td></tr>
     <tr class="t-data"><td>{p.name_first}</td></tr>
     <tr class="t-title"><td>Last name</td></tr>
     <tr class="t-data"><td>{p.name_last}</td></tr>
     <tr class="t-title"><td>Rating - REGULAR</td></tr>
     <tr class="t-data"><td>{@html fmt_rating(p.regular_rating, p.regular_indicator)}</td></tr>
     <tr class="t-title"><td>Rating - QUICK</td></tr>
     <tr class="t-data"><td>{@html fmt_rating(p.quick_rating, p.quick_indicator)}</td></tr>
     <tr class="t-title"><td>Residence</td></tr>
     <tr class="t-data"><td>{p.addr_city + ', ' + p.addr_province}</td></tr>
     <tr class="t-title"><td>FIDE id</td></tr>
     {#if p.fide_id}
      <tr class="t-data" data-goto="https://ratings.fide.com/profile/{p.fide_id}"><td>{p.fide_id}</td></tr>
     {:else}
      <tr class="t-data fyi"><td>(none)</td></tr>
     {/if}
     <tr class="t-title"><td>Data as of</td></tr>
     <tr class="t-data fyi"><td>{d.updated}</td></tr>
    {/if}
   </tbody>
  </table>
  {#if !found}
   <p>NOT FOUND!</p>
  {/if}
 </section>

{:catch error}
 <p>Error: {error.message}</p>
{/await}

<script>
    import Spinner from '../misc/Spinner.svelte';
    import {get_data_promise, goto_handler, a11y_click} from '../_shared';
    import {fmt_cfc_expiry, fmt_rating} from './_shared';

    let p = {};
    let found = false;

    const getting_data = get_data_promise(
        'cfc-server://api/player/v1/[[qvar.id]]',
        d => {
            d.updated = d.updated || '';
            p = d.player || {};
            found = Boolean(p.name_last);
            if (p.name_first && p.name_last) {
                const el_h1 = document.getElementById('ws-page-title');
                if (el_h1)
                    el_h1.innerText = `${p.name_first} ${p.name_last}`;
            }
            return d;
        }
    );

    function cfc_expiry_class(expiry) {
        let date = new Date();
        const now_ymd = date.toISOString().split('T')[0];
        date.setDate(date.getDate() + 14);
        const warn_ymd = date.toISOString().split('T')[0];
        if (!expiry || expiry <= now_ymd) return 'expired';
        if (expiry <= warn_ymd) return 'warning';
        return '';
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