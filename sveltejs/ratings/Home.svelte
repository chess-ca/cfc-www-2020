
<section class="container content pad-touch-only">
 <div class="notes">&mdash; {@html i18n.search_intro}</div>

 <h4 style="border-top:1px solid #759556; margin-top:2rem;">{i18n.search_for_players}</h4>
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
 {#if err_fields === 'player'}
  <p class="ws-error">{i18n.err_enter_criteria}</p>
 {/if}
 <button type="submit" class="button is-small is-info" on:click|preventDefault={search_players}>{i18n.search}</button>
</section>

<section class="container content pad-touch-only">
 <h4 style="border-top:1px solid #759556; margin-top:2rem;">{i18n.search_for_events}</h4>
 <div class="field is-grouped is-grouped-multiline">
  <p class="control">
   <label class="label is-small">{i18n.inp_event_name}
    <input bind:value={t_name} class="input is-small" type="text" placeholder={i18n.inp_event_name}
        on:keyup={e=>{on_keyup(e, 't')}}>
   </label>
  </p>
 </div>
 {#if err_fields === 'tournaments'}
  <p class="ws-error">{i18n.err_enter_criteria}</p>
 {/if}
 <div class="field">
  <p class="control">
   <button type="submit" class="button is-small is-info" on:click|preventDefault={search_tournaments}>{i18n.search}</button>
  </p>
 </div>
</section>

<section class="container content pad-touch-only">
 <h4 style="border-top:1px solid #759556; margin-top:2rem;">{i18n.reports}</h4>
 <ul>
  <li>{i18n.players}: <a href="/{lang}/ratings/p/top/">{i18n.top_rated}</a></li>
  <li>{i18n.tournaments}:
   <a href="/{lang}/ratings/t/sr/?d=60">{i18n.recent}</a> ,
   <a href="/{lang}/ratings/t/sr/?y={now_year}">{now_year}</a> ,
   <a href="/{lang}/ratings/t/sr/?y={now_year - 1}">{now_year - 1}</a>
  </li>
 </ul>
</section>


<script>
    import {goto, get_lang, get_i18n} from "../_shared";

    const lang = get_lang('en');
    let p_cfc = '';       // input: player cfc id
    let p_first = '';     // input: player first name
    let p_last = '';      // input: player last name
    let t_name = '';      // input: tournament name
    let err_fields = '';
    const now_year = (new Date()).getFullYear();

    function on_keyup(event, type) {
        err_fields = '';
        if (event.key === 'Enter') {
            type==='p' && search_players(event);
            type==='t' && search_tournaments(event);
        }
    }

    function search_players(e) {
        e && e.stopPropagation && e.stopPropagation();
        p_cfc = p_cfc.trim();
        p_first = p_first.trim();
        p_last = p_last.trim();

        if (p_cfc !== '') {
            goto(`/[[lang]]/ratings/p/?id=${encodeURI(p_cfc)}`);
        } else if (p_first !== '' || p_last !== '') {
            goto(`/[[lang]]/ratings/p/sr/?fn=${encodeURI(p_first)}&ln=${encodeURI(p_last)}`);
        } else {
            err_fields = 'player';
        }
    }

    function search_tournaments(e) {
        e && e.stopPropagation && e.stopPropagation();
        const el = e && e.target;
        t_name = t_name.trim();

        if (t_name !== '') {
            goto(`/[[lang]]/ratings/t/sr/?n=${encodeURI(t_name)}`);
        } else {
            err_fields = 'tournaments';
        }
    }

    const i18n = get_i18n({
        //---- Search Players
        search_intro: ['Use &ldquo;*&rdquo; as a wild card: Bob* Fis*er',
            'Utilisez &ldquo;*&rdquo; comme joker: Bob* Fis*er'],
        cfc_id: ['CFC id', 'FCE id'],
        search_for_players: ['Search for Players', 'Recherchez des joueurs'],
        inp_first: ['First name', 'Prénom'],
        inp_last: ['Last name', 'Nom de famille'],
        search: ['Search', 'Chercher'],
        err_enter_criteria: ['Enter search criteria', 'Entrez les critères de recherche'],
        //---- Search Events
        search_for_events: ['Search for Tournaments', 'Rechercher des tournois'],
        inp_event_name: ['Tournament name', 'Nom du tournoi'],
        //---- Reports
        reports: ['Reports', 'Rapports'],
        players: ['Players', 'Joueurs'],
        top_rated: ['Top Rated', 'Les mieux notés'],
        tournaments: ['Tournaments', 'Tournois'],
        recent: ['Recent', 'Récents'],
    });
</script>

<style>
 ul li a {border-bottom: 1px solid #8cab6d; }
</style>
