
import { go, get_url_hash_values } from '../../utils';

export default { pre_init };

const page_id = 'pg-ratings-home';

function pre_init(page_data) {
    if (page_data.page_id !== page_id) return;

    const pd = page_data;
    pd.now_yyyy = (new Date()).getFullYear();
    pd.p_cfc = '';       // input: player cfc id
    pd.p_first = '';     // input: player first name
    pd.p_last = '';      // input: player last name
    pd.t_name = '';      // input: tournament name
    pd.err = { s4p:'', s4t:'' };

    pd.search_players = search_players;
    pd.search_tournaments = search_tournaments;

    const hash = get_url_hash_values();
    if (hash[0] === 'p') {
        go(`/${pd.lang}/ratings/p/?id=${hash[1]}`);
        return;
    }
}

function search_players(el) {
    const pd = this;
    const p_cfc = encodeURI(String(pd.p_cfc).trim());
    const p_first = encodeURI(String(pd.p_first).trim());
    const p_last = encodeURI(String(pd.p_last).trim());

    if (p_cfc !== '') {
        let next = `/${pd.lang}/ratings/p/?id=${p_cfc}`;
        go(next, el);
    } else if (p_first !== '' || p_last !== '') {
        let next = `/${pd.lang}/ratings/p/sr?fn=${p_first}&ln=${p_last}`;
        go(next, el);
    } else {
        pd.err.s4p = 'err_enter_criteria';
    }
}

function search_tournaments(el) {
    const pd = this;
    let t_name = encodeURI(String(pd.t_name).trim());
    if (t_name === '') {
        pd.err.s4t = 'err_enter_criteria';
    } else {
        let next = `/${pd.lang}/ratings/t/sr?n=${t_name}`;
        go(next, el);
    }
}
