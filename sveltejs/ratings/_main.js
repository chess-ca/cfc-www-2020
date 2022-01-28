
import {mount_sveltejs_components, get_attr} from '../shared';
import RatingsHome from './Home.svelte';
import RatingsPlayerDetails from './PlayerDetails.svelte';

const sveltejs_components = {
    ratings_home: RatingsHome,
    ratings_player_details: RatingsPlayerDetails
}

window.addEventListener('load', (event) => {
    mount_sveltejs_components(sveltejs_components);
});
