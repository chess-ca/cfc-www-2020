
import {mount_sveltejs_components, get_attr} from '../_shared';
import ratings_home from './Home.svelte';
import ratings_player_search from './PlayerSearch.svelte';
import ratings_player_details from './PlayerDetails.svelte';
import ratings_player_top from './PlayerTop.svelte';
import ratings_player_status from './PlayerStatus.svelte';

const sveltejs_components = {
    ratings_home, ratings_player_search, ratings_player_details,
    ratings_player_top, ratings_player_status
}

window.addEventListener('load', (event) => {
    mount_sveltejs_components(sveltejs_components);
});
