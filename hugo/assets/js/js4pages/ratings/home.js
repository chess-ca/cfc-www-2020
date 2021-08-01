
import { go } from '../../utils';

function search_players(el) {
    const pd = this;
    let p_cfc = String(pd.p_cfc).trim();
    let p_first = String(pd.p_first).trim();
    let p_last = String(pd.p_last).trim();
    console.log('search_players:', p_cfc, p_first, p_last);
    if (p_cfc !== '') {
        let next = `/${pd.lang}/ratings/#/p/${p_cfc}`;
        go(next, el);
    } else if (p_first !== '' || p_last !== '') {
        let next = `/${pd.lang}/ratings/#/psr/${p_first || '*'}/${p_last || '*'}`;
        go(next, el);
    } else {
        pd.err.s4p = 'err_enter_criteria';
    }
}

function search_tournaments(el) {
    const pd = this;
    let t_name = String(pd.t_name).trim();
    if (t_name === '') {
        pd.err.s4t = 'err_enter_criteria';
    } else {
        let next = `/${pd.lang}/ratings/#/tsr?name=${t_name}`;
        go(next, el);
    }
}

function page_init(page_data) {
    if (page_data.page_id !== 'pg-ratings-home') return;

    let pd = page_data;
    pd.now_yyyy = (new Date()).getFullYear();
    pd.p_cfc = '';       // input: player cfc id
    pd.p_first = '';     // input: player first name
    pd.p_last = '';      // input: player last name
    pd.t_name = '';      // input: tournament name
    pd.err = { s4p:'', s4t:'' };

    pd.search_players = search_players;
    pd.search_tournaments = search_tournaments;
}

export default { page_init }
