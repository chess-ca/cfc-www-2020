
import {mount_sveltejs_components} from '../_shared';
import news_flashes from './NewsFlashes.svelte';
import photo_box from './PhotoBox.svelte';
import next_events from './NextEvents.svelte';

const sveltejs_components = {
    news_flashes, photo_box, next_events
}

window.addEventListener('load', (event) => {
    mount_sveltejs_components(sveltejs_components);
});
