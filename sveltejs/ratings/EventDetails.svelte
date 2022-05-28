
<TopNav updated={updated}/>

<div>
 {#await get_data}
  <div style="margin-top:4rem;"><Spinner/></div>

 {:then data}
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
     <tbody>
     {#if !found}
      <tr>
       <td></td><td colspan="5">({@html i18n.none_found})</td>
      </tr>
     {:else}
      <tr class="ws-bg-highlight">
       <td>{event.name}</td>
       <td>{event.date_end}</td>
       <td>{event.rating_type==='Q' ? i18n.quick : i18n.regular}</td>
       <td>{event.pairings==='RR' ? i18n.rr : i18n.swiss}</td>
       <td>{event.province}</td>
       <td>{event.organizer_name || '--'}</td>
       <td>{event.arbiter_name || '--'}</td>
      </tr>
     {/if}
     </tbody>
    </table>
   </div>
  </section>
  {#if found}
   <section class="container content pad-touch-only">
    <div class="table-container">
     <table class="ws-ratings-tdlist table is-hoverable is-narrow fix-for-alpinejs">
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
      <tbody>
      {#each crosstable as ct}
       <tr on:click={() => show_player(ct.cfc_id)} class:ws-highlight={ct.cfc_id===highlighted_mid} class="is-clickable">
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

 {:catch getDataErr}
  <section class="container pad-touch-only">
   <p style="margin-top:3rem;"> <!-- TODO: try this -->
    Error: {getDataErr.message}
   </p>
  </section>
 {/await}
</div>

<script>
    import TopNav from './TopNav.svelte';
    import Spinner from '../misc/Spinner.svelte';
    import {get_url_query_vars, ApiCall, goto} from '../_shared';
    import {fmt_rating} from './_shared';

    let updated = '_';
    let event = null;
    let crosstable = null;
    let found = true;
    let max_rounds = 0;
    let round_headers = [];
    let has_provisional_ratings = false;
    let show_cfc_ids = false;

    const q_vars = get_url_query_vars();
    const requested_event_id = q_vars['id'] || '0';
    const highlighted_mid = parseInt(q_vars['p'] || '0');
    const i18n = window.App_i18n.ratings_event_details;
    const api_url = 'GET cfc-api:/event/v1/' + requested_event_id;
    const get_data = (new ApiCall(api_url))
        .onComplete(get_data_complete).call_as_promise();

    function get_data_complete(dom_event, rsp) {
        updated = rsp.updated || '?!';
        found = Boolean(rsp.event && rsp.event.crosstable);
        event = rsp.event || {};
        crosstable = event.crosstable || [];
        //---- Split results from "+27|-12|=4|..." into an array
        for (const cte of crosstable) {
            cte.results = cte.results.replaceAll('X', '&#x2A2F;').split('|');
            max_rounds = Math.max(cte.results.length, max_rounds);
            has_provisional_ratings = has_provisional_ratings
                || (cte.rating_indicator < 40);
        }
        //---- Column headings for rounds depend on tournament type (Swiss or RR)
        let r_prefix = (event.pairings==='SS') ? 'R' : '#';
        round_headers = [];
        for (let i=1; i<=max_rounds; i++) {
            round_headers.push(r_prefix + i);
        }
        if (event.name) {
            const el_h1 = document.getElementById('ws-page-title');
            if (el_h1)
                el_h1.innerText = event.name;
        }
    }

    function show_player(cfc_id) {
        goto(`/[[lang]]/ratings/p/?id=${cfc_id}`);
    }
</script>
