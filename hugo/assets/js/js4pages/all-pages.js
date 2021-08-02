
import { go } from '../utils';

export default { pre_init }

function pre_init(page_data) {
    let pd = page_data;
    pd.sideNav = {
        show: false,
        toggle: sidenav_toggle
    }
    pd.go = go;
}

function sidenav_toggle(e) {
    this.sideNav.show = ! this.sideNav.show;
}
