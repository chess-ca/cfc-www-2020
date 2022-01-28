
<nav class="container content pad-touch-only mb-2">
 <div role="navigation" class="hide-if-print">
  <button aria-label="Page Back" class="button is-info is-small" on:click={()=>goto('<<<')}><i class="fas fa-arrow-left"></i></button>
  <button aria-label="Page Forward" class="button is-info is-small" on:click={()=>goto('>>>')}><i class="fas fa-arrow-right"></i></button>
  <button aria-label="Search" class="button is-info is-small" on:click={()=>goto('/[[lang]]/ratings/')}><i class="fas fa-search"></i></button>
  <div class="is-pulled-right">Data: {updated}</div>
 </div>
</nav>

<div>
{#await getDataPromise()}
 <Spinner/>

{:then getDataResult}
 {#if ! p.name_last}
  <!-- ---- ---- Player Not Found ---- ---- -->
  <section class="container pad-touch-only">
   <p>"{p.cfc_id}" {@html i18n.not_found}.</p>
  </section>
 {:else}
  <!-- ---- ---- Player Details ---- ---- -->
  <section aria-label="Player Details" class="container pad-touch-only">
   <div class="table-container" style="margin-bottom:1rem;">
    <table class="ws-table table is-hoverable is-narrow">
     <thead>
      <tr>
       <th>{@html i18n.name}</th>
       <th>{@html i18n.city}</th>
       <th class="td-c">{@html i18n.cfc_id}</th>
       <th class="td-c">{@html i18n.cfc_expiry}</th>
       <th class="td-c">{@html i18n.regular_rating}</th>
       <th class="td-c">{@html i18n.regular_high}</th>
       <th class="td-c">{@html i18n.quick_rating}</th>
       <th class="td-c">{@html i18n.quick_high}</th>
       <th class="td-c">FIDE<br>Id</th>
      </tr>
     </thead>
     <tbody>
      <tr class="ws-bg-highlight">
       <td>{p.name_last}, {p.name_first}</td>
       <td>{p.addr_city}, {p.addr_province}</td>
       <td class="td-c">{p.cfc_id}</td>
       <td class="td-c">{@html cfc_expiry()}</td>
       <td class="td-c">{@html rating(p.regular_rating, p.regular_indicator)}</td>
       <td class="td-c">{@html rating_indicator(p.regular_indicator)}</td>
       <td class="td-c">{@html rating(p.quick_rating, p.quick_indicator)}</td>
       <td class="td-c">{@html rating_indicator(p.quick_indicator)}</td>
       <td class="td-c">
        {#if p.fide_id}<a href="https://ratings.fide.com/profile/{p.fide_id}" target="_blank">{p.fide_id}</a>{/if}
       </td>
      </tr>
      {#if has_oa || p.regular_indicator < 40 || p.quick_indicator < 40}
      <tr>
       <td colspan="99">
        <ul style="margin-top:0;">
         {#if p.regular_indicator < 40 || p.quick_indicator < 40}
          <li>{@html i18n.provisional_notes}</li>
         {/if}
         {#if has_oa}
          <li class="is_oa ws-bg-highlight"><span>&starf;</span> {p.name_first} {i18n.thankyou} <span>&starf;</span></li>
         {/if}
        </ul>
       </td>
      </tr>
      {/if}
     </tbody>
    </table>
   </div>
  </section>

  <!-- ---- ---- Tabs: for selecting a view ---- ---- -->
  {#if has_oa}
   <section class="is_oa container">
    <div class="tabs is-boxed is-small">
     <!-- svelte-ignore a11y-missing-attribute -->
     <ul role="tablist" class="ml-0 mt-1 mb-1">
      <li class:is-active={pg_view==='played'} on:click={()=>pg_view='played'}>
       <a role="tab" aria-selected={pg_view==='played'} aria-controls="panel-played">{i18n.player}</a>
      </li>
      <li class:is-active={pg_view==='orgarb'} on:click={()=>pg_view='orgarb'}>
       <a role="tab" aria-selected={pg_view==='orbarb'} aria-controls="panel-orbarb">{i18n.org_arb}</a>
      </li>
     </ul>
    </div>
   </section>
  {/if}

  <!-- ---- ---- View: Tournaments Played ---- ---- -->
  <section id="panel-played" role="tabpanel" class="container content pad-touch-only"
      class:hide={pg_view!=='played'}>
   <div class="table-container">
    <table aria-rowcount={events_played.length} class="ws-table table fix-for-alpinejs is-hoverable is-narrow">
     <thead>
      <tr>
       <th></th>
       <th>
        <div class="field is-grouped is-grouped-multiline mb-1">
         <div class="control">
          <div class="select is-small is-primary">
           <select bind:value={filter_type}>
            <option value="">{i18n.filter_by_type}</option>
            <option value="*">{i18n.all_types}</option>
            <option value="R">{i18n.only_regular}</option>
            <option value="Q">{i18n.only_quick}</option>
           </select>
          </div>
         </div>
        </div>
        {@html i18n.event}
       </th>
       <th class="td-c">{@html i18n.end_date}</th>
       <th class="td-c">{@html i18n.type}</th>
       <th class="td-c">{@html i18n.games_played}</th>
       <th class="td-c">{@html i18n.score}</th>
       <th class="td-c">{@html i18n.rating_pre}</th>
       <th class="td-c">{@html i18n.rating_perf}</th>
       <th class="td-c">{@html i18n.rating_post}</th>
       <th class="td-c"><span class="has-text-primary">{@html i18n.rating_high}</span></th>
      </tr>
     </thead>
     <tbody on:click={goto_event_handler}
         class:only-type-R={filter_type==='R'} class:only-type-Q={filter_type==='Q'}>
      {#each events_played as t (t.id)}
       <tr data-goto="/[[lang]]/ratings/t/?id={t.id}&p={p.cfc_id}"
           class="is-clickable is-type-{t.rating_type}">
        <td><div class="ws-link size-18"></div></td>
        <td>{t.name}</td>
        <td class="td-c">{t.date_end}</td>
        <td class="td-c">{t.rating_type}</td>
        <td class="td-c">{t.games_played}</td>
        <td class="td-c">{t.score}</td>
        <td class="td-c">{t.rating_pre}</td>
        <td class="td-c">{t.rating_perf}</td>
        <td class="td-c">{@html rating(t.rating_post, t.rating_indicator)}</td>
        <td class="td-c has-text-primary">{@html rating_indicator(t.rating_indicator)}</td>
       </tr>
      {:else}
       <tr><td></td><td colspan="99">({i18n.none_found})</td></tr>
      {/each}
     </tbody>
    </table>
    <ul style="font-size:0.8rem; margin-top:2rem;">
     <li>Data: {updated}</li>
    </ul>
   </div>
  </section>

  <!-- ---- ---- View: Organizer / Arbiter ---- ---- -->
  <section id="panel-orgarb" role="tabpanel" class="container content pad-touch-only"
      class:hide={pg_view!=='orgarb'}>
   <div class="table-container">
    <table aria-rowcount={events_orgarb.length} class="ws-table table fix-for-alpinejs is-hoverable is-narrow">
     <thead>
      <tr>
       <th></th>
       <th>{@html i18n.organizer}</th>
       <th>{@html i18n.arbiter}</th>
       <th class="td-c">{@html i18n.end_date}</th>
       <th>{@html i18n.event}</th>
       <th class="td-c">{@html i18n.province}</th>
       <th class="td-c">{@html i18n.n_rounds}</th>
       <th class="td-c">{@html i18n.pairings}</th>
       <th class="td-c">{@html i18n.n_players}</th>
      </tr>
     </thead>
     <tbody on:click={goto_event_handler}>
      {#each events_orgarb as t, i (t.id)}
       <tr data-goto="/[[lang]]/ratings/t/?id={t.id}" class="is-clickable">
        <td><div class="ws-link size-18"></div></td>
        <td data-goto="/[[lang]]/ratings/p/?id={t.organizer_id}" class="maxw-120">{@html t.organizer_name || '&nbsp;&nbsp;&ndash;'}</td>
        <td data-goto="/[[lang]]/ratings/p/?id={t.arbiter_id}" class="maxw-120">{@html t.arbiter_name || '&nbsp;&nbsp;&ndash;'}</td>
        <td class="td-c">{t.date_end}</td>
        <td>{t.name}</td>
        <td class="td-c">{t.province}</td>
        <td class="td-c">{t.pairings === 'RR' ? '-' : t.n_rounds}</td>
        <td class="td-c">{t.pairings}</td>
        <td class="td-c">{t.n_players}</td>
       </tr>
      {:else}
       <tr><td></td><td colspan="99">({i18n.none_found})</td></tr>
      {/each}
     </tbody>
    </table>
    <ul style="font-size:0.8rem; margin-top:2rem;">
     <li>Data: {updated}</li>
    </ul>
   </div>
  </section>

 {/if}

{:catch getDataErr}
 <!-- TODO: try this -->
 <p>Error: {getDataErr.message}</p>
{/await}
</div>

<script>
    import Spinner from '../misc/Spinner.svelte';
    import {get_lang, goto, get_url_query_vars} from '../shared';
    import {call_api_promise, get_translator_map} from '../shared';

    const page_lang = get_lang();
    let updated = '';
    let has_oa = false;
    let p = {}
    let events_played = [];
    let events_orgarb = [];
    let pg_view = 'played';
    let filter_type = '';

    export function goto_event_handler(event) {
        const el_top = event.current;
        let el_target = event.target;
        while (el_target) {
            let a_goto = el_target.attributes.getNamedItem('data-goto');
            if (a_goto) {
                goto(a_goto.value);
                break;
            }
            el_target = el_target.parentElement;
        }
    }
    function cfc_expiry() {
        if (!p.cfc_expiry) return '&ndash;'
        if (p.cfc_expiry > '2080-01-01') return 'LIFE';
        if (p.cfc_expiry < '1980-01-01') return '&ndash;';
        return p.cfc_expiry;
    }
    function rating(value, indicator) {
        return (indicator > 40) ? value : `<i>(${value})</i>`;
    }
    function rating_indicator(indicator) {
        return (indicator > 40) ? indicator
            : `<i>(${indicator} ${page_lang==='fr' ? 'j' : 'g'})</i>`;
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
            events_played = p.events;
            events_orgarb = p.orgarb;
            has_oa = (events_orgarb.length > 0);

            const el_h1 = document.getElementById('ws-page-title');
            if (el_h1) el_h1.innerText = `${p.name_first} ${p.name_last}`;
        }
        function onError(event) {}
    }

    const i18_map = {
        event: ['Event','Événement'],
        end_date: ['End Date','Date de fin'],
        none_found: ['none found', 'personne n\'est trouve'],
        provisional_notes: [
            '<i>(&mldr;)</i> is a provisional rating. <i>(&mldr; g)</i> is the number of games rated.',
            '<i>(&mldr;)</i> est une note provisoire. <i>(&mldr; j)</i> est le nombre de jeux notés.'],

        //---- Player Details
        name: ['Name', 'Nom'],
        city: ['City', 'Ville'],
        cfc_id: ['CFC<br>Id', 'FCE<br>Id'],
        cfc_expiry: ['CFC<br>Expiry', 'Expiration<br>du FCE'],
        regular_rating: ['Regular<br>Rating', 'Cote<br>Régulière'],
        regular_high: ['Regular<br>High', 'Régulier<br>élevé'],
        quick_rating: ['Quick<br>Rating', 'Cote<br>Rapide'],
        quick_high: ['Quick<br>High', 'Rapide<br>élevé'],
        not_found: ['not found', 'pas trouvé'],

        //---- Tabs
        thankyou: ['is a chess organizer / arbiter. Thank you.', 'est un organisateur / arbitre d\'échecs. Merci.'],
        thankyou_1: ['Thank you', 'Merci'],
        thankyou_2: ['for being a chess organizer / arbiter', 'd\'être un organisateur / arbitre d\'échecs'],
        player: ['Player', 'Joueur'],
        org_arb: ['Organizer / Arbiter', 'Organisateur / Arbitre'],

        // Player's Tournaments List
        filter_by_type: ['Filter by type', 'Filtrer par type'],
        all_types: ['All Tournaments', 'Tous les tournois'],
        only_regular: ['Only regular tournaments', 'Seuls les tournois réguliers'],
        only_quick: ['Only quick tournaments', 'Seuls les tournois rapides'],
        type: ['Type', 'Type'],
        games_played: ['Games<br>Played', 'Jeux<br>joués'],
        score: ['Score', 'Score'],
        rating_pre: ['Old<br>Rating', 'Ancien<br>Cote'],
        rating_perf: ['Perf<br>Rating', 'Perf<br>Cote'],
        rating_post: ['New<br>Rating', 'Nouvelle<br>Cote'],
        rating_high: ['Highest<br>Rating', 'plus élevée<br>Cote'],
        games: ['g', 'j'],

        // Organizer / Arbiter List
        province: ['Prov','='],
        n_rounds: ['# of<br>Rounds','# de<br>tours'],
        pairings: ['Type','='],
        n_players: ['# of<br>Players','# de<br>joueurs'],
        organizer: ['Organizer','Organisateur'],
        arbiter: ['Arbiter','Arbitre']
    };
    const i18n = get_translator_map(page_lang === 'fr' ? 1 : 0, i18_map);
</script>

<style>
 .is_oa { font-weight: bold; }
 .is_oa span { color: #ffd700; font-size: 1.0rem; }
 .maxw-120 { max-width: 120px; }
 .hide { display:none; }
 .only-type-R .is-type-Q { display:none; }
 .only-type-Q .is-type-R { display:none; }
</style>