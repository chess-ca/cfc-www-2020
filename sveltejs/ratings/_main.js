
import {mount_sveltejs_components, get_attr} from '../shared';
import RatingsHome from './Home.svelte';
import RatingsPlayerDetails from './PlayerDetails.svelte';
import RatingsPlayerStatus from './PlayerStatus.svelte';

const sveltejs_components = {
    ratings_home: RatingsHome,
    ratings_player_details: RatingsPlayerDetails,
    ratings_player_status: RatingsPlayerStatus
}

window.addEventListener('load', (event) => {
    mount_sveltejs_components(sveltejs_components);
});
