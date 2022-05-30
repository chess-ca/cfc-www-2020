
<TopNav updated={updated}/>

{#await getDataPromise()}
 <div style="margin-top:4rem;">
  <Spinner><p>{@html i18n.bug_spinning}</p></Spinner>
 </div>

{:then getDataResult}
 <section class="container content pad-touch-only">
  <p class="notes">&mdash; {@html i18n.search_intro}</p>
  <div class="field is-grouped is-grouped-multiline">
   <div class="control">
    <label class="label is-small">{@html i18n.inp_first}
     <input bind:value={name_first} class="input is-small" type="text" on:keyup={on_keyup}>
    </label>
   </div>
   <div class="control">
    <label class="label is-small">{@html i18n.inp_last}
     <input bind:value={name_last} class="input is-small" type="text" on:keyup={on_keyup}>
    </label>
   </div>
  </div>
  {#if report_is === 'err_enter_criteria'}
   <p class="ws-error">{@html i18n.err_enter_criteria}</p>
  {/if}
  <button type="submit" class="button is-small is-info" on:click={search_players}>{@html i18n.search}</button>
 </section>

 {#if report_is === 'ready' }
  {#if players.length < 1 }
   <!-- ---- ---- Events Not Found ---- ---- -->
   <section class="container pad-touch-only">
    <p style="margin-top:3rem;">
     &ldquo;{name_first || '*'} {name_last || '*'}&rdquo; {@html i18n.not_found}
    </p>
   </section>
  {:else}
   <!-- ---- ---- Events Found ---- ---- -->
   <section class="container content pad-touch-only" x-cloak>
    <table class="ws-ratings-tdlist table fix-for-alpinejs is-hoverable is-narrow">
     <thead>
     <tr>
      <th></th>
      <th>{@html i18n.name}</th>
      <th>{@html i18n.city}</th>
      <th>{@html i18n.cfc_id}</th>
      <th class="ta-center">{@html i18n.cfc_expiry}</th>
      <th class="ta-center">{@html i18n.regular_rating}</th>
      <th class="ta-center">{@html i18n.regular_high}</th>
      <th class="ta-center">{@html i18n.quick_rating}</th>
      <th class="ta-center">{@html i18n.quick_high}</th>
      <th class="ta-center">FIDE<br>id</th>
     </tr>
     </thead>
     <tbody on:click={goto_handler}>
     {#each players as p}
      <tr data-goto="/[[lang]]/ratings/p/?id={p.cfc_id}" class="is-clickable">
       <td><div class="ws-link size-18"></div></td>
       <td>{@html p.name_last}, {@html p.name_first}</td>
       <td>{@html fmt_city_prov(p.addr_city, p.addr_province)}</td>
       <td>{@html p.cfc_id}</td>
       <td class="ta-center">{@html fmt_cfc_expiry(p.cfc_expiry)}</td>
       <td class="ta-center">{@html fmt_rating(p.regular_rating, p.regular_indicator)}</td>
       <td class="ta-center">{@html fmt_rating_indicator(p.regular_indicator, i18n.games)}</td>
       <td class="ta-center">{@html fmt_rating(p.quick_rating, p.quick_indicator)}</td>
       <td class="ta-center">{@html fmt_rating_indicator(p.quick_indicator, i18n.games)}</td>
       <td class="ta-center" data-goto="https://ratings.fide.com/profile/{p.fide_id}">
        {#if p.fide_id}
         <a href="https://ratings.fide.com/profile/{p.fide_id}" target="_blank">{@html p.fide_id}</a>
        {/if}
       </td>
      </tr>
     {/each}
     {#if has_provisional_ratings(players)}
      <tr>
       <td></td>
       <td colspan="99">
        <ul style="margin-top:0;">
         <li>{@html i18n.provisional_notes}</li>
        </ul>
       </td>
      </tr>
     {/if}
     </tbody>
    </table>
   </section>
  {/if}
 {/if}

{:catch getDataErr}
 <section class="container pad-touch-only">
  <p style="margin-top:3rem;"> <!-- TODO: try this -->
   Error: {getDataErr.message}
  </p>
 </section>

{/await}


<script>
    import TopNav from './TopNav.svelte';
    import Spinner from '../misc/Spinner.svelte';
    import {fmt_cfc_expiry, fmt_city_prov, fmt_rating, fmt_rating_indicator} from './_shared';
    import {goto, goto_handler, get_url_query_vars, call_api_promise} from '../_shared';

    let report_is = 'waiting';
    let updated = '';
    let name_first = '';
    let name_last = '';
    let players = [];
    const i18n = window.page_i18n || {};

    function getDataPromise() {
        const q_vars = get_url_query_vars();
        name_first = q_vars['fn'] || '';
        name_last = q_vars['ln'] || '';
        const url = `https://server.chess.ca/api/player/v1/find?first=${name_first}&last=${name_last}`;
        return call_api_promise({
            method:'GET', url, onComplete, onError
        });

        function onComplete(event, rsp) {
            rsp = rsp || {};
            updated = rsp.updated || '';
            players = rsp.players || [];
            report_is = 'ready';
        }
        function onError(event) {}
    }

    function on_keyup(event) {
        report_is = 'empty';
        if (event.key === 'Enter') {
            search_players(event);
        }
    }

    function search_players(event) {
        const fn = encodeURI(String(name_first).trim());
        const ln = encodeURI(String(name_last).trim());
        if ( fn || ln ) {
            goto(`/[[lang]]/ratings/p/sr/?fn=${fn}&ln=${ln}`);
        } else {
            report_is = 'err_enter_criteria';
        }
    }

    function has_provisional_ratings(players) {
        for (let i=1; i<players.length; i++) {
            let p = players[i];
            if (p.regular_indicator < 40 || p.quick_indicator < 40)
                return true;
        }
        return false;
    }
</script>
