
{#await getting_data}
 <div style="margin-top:4rem;"><Spinner/></div>

{:then d}
 <TopNav updated={d.updated}/>
 <section class="container content pad-touch-only">
  <div class="table-container">
   <table class="ws-ratings-tdlist table is-hoverable is-narrow">
    <thead>
    <tr>
     <th>{@html i18n.event}</th>
     <th>{@html i18n.end_date}</th>
     <th>{@html i18n.type}</th>
     <th>{@html i18n.pairings}</th>
     <th>{@html i18n.prov}</th>
     <th>{@html i18n.org_name}</th>
     <th>{@html i18n.arb_name}</th>
    </tr>
    </thead>
    <tbody on:click={goto_handler} on:keyup={a11y_click(goto_handler)}>
    {#if !found}
     <tr>
      <td></td><td colspan="5">({@html i18n.none_found})</td>
     </tr>
    {:else}
     <tr class="ws-bg-highlight">
      <td>{d.event.name}</td>
      <td>{d.event.date_end}</td>
      <td>{d.event.rating_type==='Q' ? i18n.quick : i18n.regular}</td>
      <td>{d.event.pairings==='RR' ? i18n.rr : i18n.swiss}</td>
      <td>{d.event.province}</td>
      {#if d.event.organizer_id}
       <td data-goto="/[[lang]]/ratings/p/?id={d.event.organizer_id}" class="is-clickable">
        {d.event.organizer_name}
       </td>
      {:else}
       <td>--</td>
      {/if}
      {#if d.event.arbiter_id}
       <td data-goto="/[[lang]]/ratings/p/?id={d.event.arbiter_id}" class="is-clickable">
        {d.event.arbiter_name}
       </td>
      {:else}
       <td>--</td>
      {/if}
     </tr>
    {/if}
    </tbody>
   </table>
  </div>
 </section>
 {#if found}
  <section class="container content pad-touch-only">
   <div class="table-container">
    <table class="ws-ratings-tdlist table is-hoverable is-narrow">
     <thead>
     <tr>
      <th>#</th>
      <th>{@html i18n.player}</th>
      <th class="ta-center">{@html i18n.score}</th>
      {#each round_headers as hdr}
       <th class="ta-right">{hdr}</th>
      {/each}
      <th>&nbsp;</th>
      <th class="ta-center">{@html i18n.rating_pre}</th>
      <th class="ta-center">{@html i18n.rating_perf}</th>
      <th class="ta-center">{@html i18n.rating_post}</th>
     </tr>
     </thead>
     <tbody on:click={goto_handler} on:keyup={a11y_click(goto_handler)}>
     {#each d.crosstable as ct}
      <tr data-goto={'/[[lang]]/ratings/p/?id='+ct.cfc_id} class:ws-highlight={ct.cfc_id===highlighted_cfc_id} class="is-clickable">
       <td>{ct.place}</td>
       <td>{ct.name} {#if show_cfc_ids}({ct.cfc_id}){/if}</td>
       <td class="ta-center">{ct.score}</td>
       {#each ct.results as r}
        <td class="ta-right">{@html r}</td>
       {/each}
       <td>&nbsp;</td>
       <td class="ta-center">{@html fmt_rating(ct.rating_pre, ct.rating_indicator)}</td>
       <td class="ta-center">{@html ct.rating_perf}</td>
       <td class="ta-center">{@html fmt_rating(ct.rating_post, ct.rating_indicator)}</td>
      </tr>
     {/each}
     </tbody>
    </table>
    <ul style="font-size:0.8rem; margin-top:2rem;">
     {#if has_provisional_ratings}
      <li>{@html i18n.provisional_notes}</li>
     {/if}
     <li><input type=checkbox bind:checked={show_cfc_ids}> {@html i18n.show_cfc_ids}</li>
    </ul>
   </div>
  </section>
 {/if}

{:catch error}
 <section class="container pad-touch-only">
  <p style="margin-top:3rem;"> <!-- TODO: try this -->
   Error: {error.message}
  </p>
 </section>

{/await}

<script>
    import TopNav from './TopNav.svelte';
    import Spinner from '../misc/Spinner.svelte';
    import {get_data_promise, get_url_query_vars, goto_handler, a11y_click} from '../_shared';
    import {fmt_rating} from './_shared';

    const i18n = window.page_i18n || {};
    let found = false;
    let n_rounds = 0;
    let round_headers = [];
    let has_provisional_ratings = false;
    let show_cfc_ids = false;
    const qv = get_url_query_vars();
    const highlighted_cfc_id = parseInt(qv['p'] || '0');

    const getting_data = get_data_promise(
        'cfc-server://api/event/v1/[[qvar.id]]',
        d => {
            found = Boolean(d.event && d.event.crosstable);
            d.event = d.event || {};
            d.crosstable = (d.event && d.event.crosstable) || [];
            d.updated = d.updated || '?';
            for (const cte of d.crosstable) {
                //---- Convert round-robin "X" into a nicer looking char
                cte.results = cte.results.replaceAll('X', '&#x2A2F;');
                //---- Split results from "+27|-12|=4|..." into an array
                cte.results = cte.results.split('|');
                n_rounds = Math.max(cte.results.length, n_rounds);
                has_provisional_ratings = has_provisional_ratings
                    || (cte.rating_indicator < 40);
            }
            //---- Column headings for rounds depend on tournament type (Swiss or RR)
            let r_prefix = (d.event.pairings==='SS') ? 'R' : '#';
            for (let n=1; n<=n_rounds; n++) {
                round_headers.push(r_prefix + n);
            }
            if (d.event.name) {
                const el_h1 = document.getElementById('ws-page-title');
                if (el_h1) el_h1.innerText = d.event.name;
            }
            return d;
        }
    );
</script>
