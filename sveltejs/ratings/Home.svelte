
<section class="container content pad-touch-only">
 <div class="notes">&mdash; {@html i18n.search_intro}</div>

 <h4 style="border-top:1px solid #759556; margin-top:2rem;">{i18n.search_for_players}</h4>
 <form on:submit|preventDefault={search_players}>
  <div class="field is-grouped is-grouped-multiline" on:submit|preventDefault={search_players}>
   <p class="control">
    <label class="label is-small">{i18n.cfc_id}
     <input bind:value={p_cfc} class="input is-small" type="text" placeholder={i18n.cfc_id}
         on:keyup={e=>{on_keyup(e, 'p')}}>
    </label>
   </p>
   <p class="control">
    <label class="label is-small">{i18n.inp_first}
     <input bind:value={p_first} class="input is-small" type="text" placeholder={i18n.inp_first}
         on:keyup={e=>{on_keyup(e, 'p')}}>
    </label>
   </p>
   <p class="control">
    <label class="label is-small">{i18n.inp_last}
     <input bind:value={p_last} class="input is-small" type="text" placeholder={i18n.inp_last}
         on:keyup={e=>{on_keyup(e, 'p')}}>
    </label>
   </p>
  </div>
  {#if err.s4p === 'err_enter_criteria'}
   <p class="ws-error">{i18n.err_enter_criteria}</p>
  {/if}
  <button type="submit" class="button is-small is-info" on:click|preventDefault={search_players}>{i18n.search}</button>
 </form>
</section>

<section class="container content pad-touch-only">
 <h4 style="border-top:1px solid #759556; margin-top:2rem;">{i18n.search_for_events}</h4>
 <form on:submit|preventDefault={search_tournaments}>
  <div class="field is-grouped is-grouped-multiline">
   <p class="control">
    <label class="label is-small">{i18n.inp_event_name}
     <input bind:value={p_last} class="input is-small" type="text" placeholder={i18n.inp_event_name}
         on:keyup={e=>{on_keyup(e, 't')}}>
    </label>
   </p>
  </div>
  {#if err.s4t === 'err_enter_criteria'}
   <p class="ws-error">{i18n.err_enter_criteria}</p>
  {/if}
  <div class="field">
   <p class="control">
    <button type="submit" class="button is-small is-info" on:click|preventDefault={search_tournaments}>{i18n.search}</button>
   </p>
  </div>
 </form>
</section>

<section class="container content pad-touch-only">
 <h4 style="border-top:1px solid #759556; margin-top:2rem;">{i18n.reports}</h4>
 <ul>
  <li><a href="/{page_lang}/ratings/player/lists-top/">{i18n.top_players}</a></li>
  <li><a href="/{page_lang}/ratings/tournament/lists/">{i18n.tournament_lists}</a></li>
 </ul>
</section>


<script>
    export let page_lang = 'en';

    import {get_translator_map, goto} from "../shared";
    //import InputText from "../misc/InputText.svelte";

    let go = goto;
    let p_cfc = '';       // input: player cfc id
    let p_first = '';     // input: player first name
    let p_last = '';      // input: player last name
    let t_name = '';      // input: tournament name
    let err = {s4p: '', s4t: ''};

    function on_keyup(event, type) {
        err.s4p = '';
        err.s4t = '';
        if (event.key==='Enter' && type==='p') search_players(event);
        if (event.key==='Enter' && type==='t') search_tournaments(event);
    }

    function search_players(e) {
        console.log('this = ', this);
        e && e.stopPropagation && e.stopPropagation();
        const el = e && e.target;
        p_cfc = p_cfc.trim();
        p_first = p_first.trim();
        p_last = p_last.trim();

        if (p_cfc !== '') {
            goto(`/[[lang]]/ratings/p/?id=${encodeURI(p_cfc)}`, el);
        } else if (p_first !== '' || p_last !== '') {
            goto(`/[[lang]]/ratings/p/sr/?fn=${encodeURI(p_first)}&ln=${encodeURI(p_last)}`, el);
        } else {
            err.s4p = 'err_enter_criteria';
        }
    }

    function search_tournaments(e) {
        e && e.stopPropagation && e.stopPropagation();
        const el = e && e.target;
        t_name = t_name.trim();

        if (t_name !== '') {
            goto_url(`/[[lang]]/ratings/t/sr/?n=${encodeURI(t_name)}`, el);
        } else {
            err.s4t = 'err_enter_criteria';
        }
    }

    const i18_map = {
        // Search Players
        search_intro: ['Use &ldquo;*&rdquo; as a wild card: Bob* Fis*er', 'Utilisez &ldquo;*&rdquo; comme joker: Bob* Fis*er'],
        cfc_id: ['CFC id', 'FCE id'],
        search_for_players: ['Search for Players', 'Recherchez des joueurs'],
        inp_first: ['First name', 'Prénom'],
        inp_last: ['Last name', 'Nom de famille'],
        search: ['Search', 'Chercher'],
        err_enter_criteria: ['Enter search criteria', 'Entrez les critères de recherche'],
        // Search Events
        search_for_events: ['Search for Tournaments', 'Rechercher des tournois'],
        inp_event_name: ['Tournament name', 'Nom du tournoi'],
        // Reports
        reports: ['Reports', 'Rapports'],
        top_players: ['Top Players', 'Meilleurs joueurs'],
        tournament_lists: ['Tournament Lists', 'Listes de tournois'],
    };
    const i18n_langs = {en:0, fr:1}
    const foo = get_translator_map()
    const i18n = get_translator_map(page_lang === 'fr' ? 1 : 0, i18_map);
</script>
