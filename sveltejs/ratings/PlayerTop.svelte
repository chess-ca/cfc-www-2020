
<TopNav updated={updated}/>

<div>
 <section class="container content pad-touch-only">
  <div class="field is-grouped is-grouped-multiline">
   <div class="control">
    <label for="f-topn" class="label is-small">{@html i18n.top_n_size}</label>
    <input id="f-topn" bind:value={topn} class="input is-small" type="text" on:keyup={on_keyup}>
   </div>
   <div class="control">
    <label for="f-type" class="label is-small">{@html i18n.rating_type}</label>
     <div class="select is-small">
      <select id="f-type" bind:value={type} on:change={on_keyup}>
       <option value="R">{@html i18n.regular_ratings}</option>
       <option value="Q">{@html i18n.quick_ratings}</option>
      </select>
     </div>
   </div>
  </div>

  <div class:hide-if-print={age_min<=0 && age_max>=99}>
   <div class="field is-grouped is-grouped-multiline">
    <div class="control">
     <label for="f-age-min" class="label is-small">{@html fmt_str(i18n.age_ge, now_yyyy)}</label>
     <input id="f-age-min" bind:value={age_min} class="input is-small" type="text" on:keyup={on_keyup}>
    </div>
    <div class="control">
     <label for="f-age-max" class="label is-small">{@html i18n.age_le}</label>
      <input id="f-age-max" bind:value={age_max} class="input is-small" type="text" on:keyup{on_keyup}>
    </div>
   </div>
  </div>

  <div class:hide-if-print={gender==='' && province===''}>
   <div class="field is-grouped is-grouped-multiline">
    <div class="control">
     <label for="f-gender" class="label is-small">{@html i18n.gender}</label>
     <div class="select is-small">
      <select id="f-gender" bind:value={gender} on:change={on_keyup}>
       <option value="">({@html i18n.all})</option>
       <option value="F">Female</option>
       <option value="M">Male</option>
      </select>
     </div>
    </div>
    <div class="control">
     <label for="f-province" class="label is-small">{@html i18n.province}</label>
     <div class="select is-small">
      <select id="f-province" bind:value={province} on:change={on_keyup}>
       <option value="">({@html i18n.all})</option>
       {#each prov_list as prov}
        <option value={prov.code}>{prov.name}</option>
       {/each}
      </select>
     </div>
    </div>
   </div>
  </div>

  <div class:hide-if-print={cfc_expiry_min <= date_default && last_played <= date_default}>
   <div class="field is-grouped is-grouped-multiline">
    <div class="control">
     <label for="f-cfc-expiry-min" class="label is-small">{@html i18n.cfc_expired}</label>
     <input id="f-cfc-expiry-min" bind:value={cfc_expiry_min} class="input is-small" type="text" on:keyup={on_keyup}>
    </div>
    <div class="control">
     <label for="f-last-played" class="label is-small">{@html i18n.last_event_ge}</label>
     <input id="f-last-played" bind:value={last_played} class="input is-small" type="text" on:keyup={on_keyup}>
    </div>
   </div>
  </div>

  <div class:hide-if-print={rating_min<=0 && rating_max>=99}>
   <div class="field is-grouped is-grouped-multiline">
    <div class="control">
     <label for="f-rating-min" class="label is-small">{@html i18n.rating_ge}</label>
     <input id="f-rating-min" bind:value={rating_min} class="input is-small" type="text" on:keyup={on_keyup}>
    </div>
    <div class="control">
     <label for="f-rating-max" class="label is-small">{@html i18n.rating_le}</label>
     <input id="f-rating-max" bind:value={rating_max} class="input is-small" type="text" on:keyup={on_keyup}>
    </div>
   </div>
  </div>
  <br>

  <button on:click={getData} class="button is-small is-info hide-if-print">Create Report</button>
 </section>

 {#if report_is === 'loading'}
  <div style="margin-top:4rem;">
   <Spinner>{@html i18n.bug_spinning}</Spinner>
  </div>

 {:else if report_is === 'ready'}
  <section class="container content pad-touch-only">
   <table class="ws-ratings-tdlist table fix-for-alpinejs is-hoverable is-narrow">
    <thead>
    <tr>
     <th>#</th>
     <th>{@html i18n.name}</th>
     <th>{@html i18n.city}</th>
     {#if type === 'R'}
      <th class="ta-center">{@html i18n.regular_rating}</th>
      <th class="ta-center">{@html i18n.regular_high}</th>
     {:else if type === 'Q'}
      <th class="ta-center">{@html i18n.quick_rating}</th>
      <th class="ta-center">{@html i18n.quick_high}</th>
     {/if}
     <th class="ta-center">{@html i18n.cfc_expiry}</th>
    </tr>
    </thead>
    <tbody on:click={goto_handler} on:keyup={a11y_click(goto_handler)}>
    {#if players.length ===0}
     <tr><td></td><td colspan="99">({@html i18n.none_found})</td></tr>

    {:else}
     {#each players as p}
      <tr data-goto="/[[lang]]/ratings/p/?id={p.cfc_id}" class="is-clickable">
       <td>{@html p.pos}</td>
       <td>{@html p.name_last}, {@html p.name_first}</td>
       <td>{@html fmt_city_prov(p.addr_city, p.addr_province)}</td>
       {#if type === 'R'}
        <td class="ta-center">{@html fmt_rating(p.regular_rating, p.regular_indicator)}</td>
        <td class="ta-center">{@html fmt_rating_indicator(p.regular_indicator, i18n.games)}</td>
       {:else if type === 'Q'}
        <td class="ta-center">{@html fmt_rating(p.quick_rating, p.quick_indicator)}</td>
        <td class="ta-center">{@html fmt_rating_indicator(p.quick_indicator, i18n.games)}</td>
       {/if}
       <td class="ta-center">{@html fmt_cfc_expiry(p.cfc_expiry)}</td>
      </tr>
     {/each}
     {#if has_provisional_ratings(players, type)}
      <tr>
       <td></td>
       <td colspan="99">
        <ul style="margin-top:0;">
         <li>{@html i18n.provisional_notes}</li>
        </ul>
       </td>
      </tr>
     {/if}
    {/if}
    </tbody>
   </table>
  </section>

 {:else if report_is === 'error'}
  <section class="container pad-touch-only">
   <p style="margin-top:3rem;"> <!-- TODO: try this -->
    Error: {error_message}
   </p>
  </section>

 {/if}

</div>

<script>
    import TopNav from './TopNav.svelte';
    import Spinner from '../misc/Spinner.svelte';
    import {get_data} from "../data_access";
    import {fmt_city_prov, fmt_cfc_expiry, fmt_rating, fmt_rating_indicator} from './_shared';
    import {goto_handler, call_api, get_lang, fmt_str} from '../_shared';
    import {a11y_click} from '../_shared';

    let updated = '';
    let lang = get_lang();
    let now_yyyy = (new Date()).getFullYear();
    let prov_list = get_data.provinces();

    let type = 'R';
    let topn = 50;
    let rating_min = 0;
    let rating_max = 9999;
    let age_min = 0;
    let age_max = 99;
    let gender = '';
    let province = '';
    let date_default = '1995-01-01';  // (now_yyyy - 5) + '-01-01'
    let last_played = date_default;
    let cfc_expiry_min = date_default;

    let report_is = 'empty';     // empty | loading | ready
    let error_message = '';
    let players = [];
    let player_list_is_single = false;
    const i18n = get_data.page_i18n();

    function getData() {
        report_is = 'loading';
        const args = [];
        args.push('topn=' + String(topn || '50').trim());
        args.push('type=' + type);
        if (rating_min > 0) args.push('rating_min=' + rating_min);
        if (rating_max < 9999) args.push('rating_max=' + rating_max);
        if (age_min > 0) args.push('age_min=' + age_min);
        if (age_max < 99) args.push('age_max=' + age_max);
        if (gender) args.push('gender=' + gender);
        if (province) args.push('province=' + province);
        if (last_played !== date_default) args.push('last_played=' +last_played);
        if (cfc_expiry_min !== date_default) args.push('cfc_expiry_min=' + cfc_expiry_min);
        const url = 'https://server.chess.ca/api/player/v1/top?' + args.join('&');
        return call_api({
            method:'GET', url, onComplete, onError
        });

        function onComplete(event, rsp) {
            rsp = rsp || {};
            updated = rsp.updated || '';
            players = rsp.players || [];
            report_is = 'ready';
        }
        function onError(event) {
            error_message = event.message;
            report_is = 'error';
        }
    }

    function on_keyup() {
        report_is = 'empty';
    }

    function has_provisional_ratings(players, type) {
        for (const p of players) {
            if ((type === 'R' && p.regular_indicator < 40)
                || (type === 'Q' && p.quick_indicator < 40))
                return true;
        }
        return false;
    }
</script>

<style>
  .control input, .control select { width:12rem; }
  .field.is-grouped.is-grouped-multiline:last-child {margin-bottom:0;}
  label.label {margin-bottom:0;}
</style>
