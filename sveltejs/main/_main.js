
import {mount_sveltejs_components} from '../_shared';
import cfc_top_banner from './TopBanner.svelte';
import news_flashes from './NewsFlashes.svelte';
import photo_box from './PhotoBox.svelte';
import next_events from './NextEvents.svelte';
import cfc_events_list from './EventsList.svelte';
import membership_join from './MembershipJoin.svelte';

const sveltejs_components = {
    cfc_top_banner, news_flashes, photo_box, next_events,
    cfc_events_list, membership_join
}

window.addEventListener('load', (event) => {
    mount_sveltejs_components(sveltejs_components);
});
