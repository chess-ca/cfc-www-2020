<div class="is-pulled-right">
 <a href="/{lang}/events/" class="button is-small is-primary">
  { i18n.More } &nbsp; <i class="fas fa-chevron-right"></i>
 </a>
</div>
<p class="title is-5">
 <i class="fas fa-chess-knight"></i> { i18n.Events }
</p>
{#each event_list as e}
 <div class="ws-item">
  <a href={e.url}>
   <div class="ws-more right"></div>
   { e.dates[lang] } &mdash; { e.city }
   <br>{@html e.name}
  </a>
 </div>
{/each}

<script>
    import {get_global} from "../_shared";

    export let lang = 'en';
    export let events = 'events';
    export let max = '7';

    const event_list = get_event_list(events);
    const i18n = get_i18n(lang);

    function get_event_list(event_list_variable, max_events) {
        max_events = max_events || Number(max);

        const re_cancelled = /cancelled/i;
        const today = (new Date()).toISOString().slice(0,10);
        const all_events = get_global(event_list_variable) || [];
        const events = [];
        for (let e of all_events) {
            if (
                (e.end < today)
                || (e.prov === 'FO')
                || (e.prov === 'US')
                || (e.name.match(re_cancelled))
            ) continue;
            if (e.city && e.prov && e.prov !== 'Online')
                e.city += (', ' + e.prov);

            events.push(e);
            if (events.length >= max_events) break;
        }
        return events;
    }

    function get_i18n(lang) {
        return (lang === 'fr')
            ? { More: 'Plus', Events: 'Événements'}
            : { More: 'More', Events: 'Events'};
    }
</script>
