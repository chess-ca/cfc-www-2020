
import {mount_sveltejs_components} from '../_shared';
import photo_box from './PhotoBox.svelte';

const sveltejs_components = {
    photo_box
}

window.addEventListener('load', (event) => {
    mount_sveltejs_components(sveltejs_components);
});
