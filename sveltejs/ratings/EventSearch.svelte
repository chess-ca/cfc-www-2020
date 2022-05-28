
<TopNav updated={data.updated}/>

{#if !data.status}
 <div style="margin-top:4rem;"><Spinner/></div>
 <!--p>{@html i18n.bug_spinning}</p-->

{:else if data.status === 'loaded'}
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
   <tbody on:click={goto_handler}>
   {#each data.events as event}
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

{:else if data.status === 'error'}
 <p class="ws-error">{@html i18n.err_fetching}</p>
 <p>({error_message})</p>

{:else}
 <p>Error: Unexpected data.status="{data.status}".</p>
{/if}

<script>
    import TopNav from './TopNav.svelte';
    import Spinner from '../misc/Spinner.svelte';
    import {call_api, get_url_query_vars, goto_handler} from '../_shared';
    import {onMount} from 'svelte';

    let data = {
        status: false,
        updated: '_',
        events: []
    }
    let error_message = '';
    const i18n = window.App_i18n.ratings_event_search;

    onMount(_getData);

    function _getData() {
        const qv = get_url_query_vars();
        let url = 'https://server.chess.ca/api/event/v1/';
        if (qv['n']) {
            url += 'find?n=' + encodeURI(qv['n']);
        } else if (qv['d']) {
            url += 'find?d=' + qv['d'];
        } else if (qv['y']) {
            url += 'find?y=' + qv['y'];
        } else {
            console.log('No query vars; no data to get.');
            return;     // no data to get
        }
        call_api({url, onComplete, onError});

        function onComplete(event, rsp) {
            data = {
                status: 'loaded',
                updated: rsp.updated || '???',
                events: rsp.events || []
            };
        }
        function onError(event) {
            error_message = event.message;
            data = {
                status: 'error',
                updated: '_',
                events: []
            };
        }
    }
</script>
