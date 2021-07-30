
import { go } from '../utils';

function sidenav_toggle(e) {
    this.sideNav.show = ! this.sideNav.show;
}

function page_init(page_data) {
    let pd = page_data;
    pd.sideNav = {
        show: false,
        toggle: sidenav_toggle
    }
    pd.go = go;
}

export default { page_init }
