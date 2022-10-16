
{#await getting_data}
 <div style="margin-top:4rem;"><Spinner/></div>
 <!--p>{@html i18n.bug_spinning}</p-->

{:then d}
 <TopNav updated={d.updated}/>
 <section class="container content pad-touch-only">
  <table class="ws-ratings-tdlist table is-hoverable is-narrow">
   <thead>
   <tr>
    <th></th>
    <th>{@html i18n.event}</th>
    <th style="min-width:8em;">{@html i18n.end_date}</th>
    <th>{@html i18n.type}</th>
    <th>{@html i18n.pairings}</th>
    <th>{@html i18n.prov}</th>
    <th>{@html i18n.org_name}</th>
    <th>{@html i18n.arb_name}</th>
   </tr>
   </thead>
   <tbody on:click={goto_handler} on:keyup={a11y_click(goto_handler)}>
   {#each d.events as event}
    <tr data-goto={'/[[lang]]/ratings/t/?id='+event.id} class="is-clickable">
     <td><div class="ws-link size-18"></div></td>
     <td>{event.name}</td>
     <td>{event.date_end}</td>
     <td>{event.rating_type}</td>
     <td>{event.pairings}</td>
     <td>{event.province}</td>
     <td data-goto={'/[[lang]]/ratings/p/?id='+event.organizer_id}>{event.organizer_name || '--'}</td>
     <td data-goto={'/[[lang]]/ratings/p/?id='+event.arbiter_id}>{event.arbiter_name || '--'}</td>
    </tr>
   {:else}
    <tr>
     <td></td><td colspan="99">{@html i18n.none_found}</td>
    </tr>
   {/each}
   </tbody>
  </table>
 </section>

{:catch error}
 <p class="ws-error">{@html i18n.err_fetching}</p>
 <p>({error.message})</p>

{/await}

<script>
    import TopNav from './TopNav.svelte';
    import Spinner from '../misc/Spinner.svelte';
    import {get_data_promise, goto_handler, a11y_click} from '../_shared';

    const i18n = window.page_i18n || {};
    const getting_data = get_data_promise(
        'cfc-server://api/event/v1/find?[[qvars]]'
    );
</script>
