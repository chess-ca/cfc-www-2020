
export default { pre_init }

const page_id = 'pg-events-list';

const _log = console.log;

function pre_init(page_data) {
    if (page_data.page_id !== page_id) return;

    const pd = page_data;
    pd.e_type = '*';
    pd.e_prov = '*';
    pd.events_all = get_events_all();

    pd.get_table_rows = get_table_rows;
}

function get_events_all() {
    const now_ymd = (new Date()).toISOString().slice(0,10);
    const events_in = (window.ws_cfc_data && window.ws_cfc_data.events) || [];
    const events_out = [];
    for (let i=0; i<events_in.length; i++) {
        let e = events_in[i];
        if (e['end'] < now_ymd)
            continue;

        if (e['prov'] !== 'Online' && e['prov'] !== 'FO')
            e['city'] += (', ' + e['prov']);
        events_out.push(e);
    }
    return events_out;
}

function filter_events(event_list, e_type, e_prov) {
    const events_out = [];
    for (let i=0; i<event_list.length; i++) {
        let e = event_list[i];
        if ( (e_type === '*' || e_type === e['type'])
            && (e_prov === '*' || e_prov === e['prov']) ) {
            events_out.push(e);
        }
    }
    return events_out;
}

function get_table_rows() {
    // See notes at bottom for reasoning.
    const pd = this;

    const now_ymd = (new Date()).toISOString().slice(0,10);
    let last_yyyy = now_ymd.slice(0,4);

    const events_in = filter_events(pd.events_all, pd.e_type, pd.e_prov);

    let html = [];
    for (let i=0; i<events_in.length; i++) {
        let e = events_in[i];

        if ( e['start'].slice(0,4) > last_yyyy ) {
            // Add a row indicating start of a new year.
            last_yyyy = e['start'].slice(0,4);
            html.push(
                '<tr><td></td><td colSpan="99">',
                '<strong>---- '+last_yyyy+' ----<strong>',
                '</td></tr>'
            );
        }

        html.push(
            '<tr>',
            '<td>' + e.dates[pd.lang] + '</td>',
            '<td>' + e.name + '</td>',
            '<td>' + e.type + '</td>',
            '<td>' + e.city + '</td>',
            '<td>' + e.links + '</td>',
            '</tr>'
        );
    }
    if (html.length < 1) {
        html.push(
            '<tr><td></td><td colSpan="99">',
            pd.lang === 'fr' ? '(rien)' : '(none)',
            '</td></tr>'
        );
    }
    return html.join('');
}


//----------------------------------------------------------------------
// DEVELOPER NOTES:
// - Why a JS function generates the table rows in HTML?
//   - Ideally, would've built the table rows in the HTML using AlpineJS.
//   - But we have 2 types of rows: event detail and year separator
//     that require 2 different sets of columns.
//   - In AlpineJS, x-for loops must be on <template> tags only and the
//     <template> must have 1 child element only.
//   - Usual solution is to put the <tbody> tag inside the <template> as
//     the only child. HTML Standards allow multiple <tbody> in a <table>.
//   - Unfortunately, this seems to break Bulma.io styling. Rows in the
//     table are not styled properly. D-oh!
//   - So, as a quick hack (it works): JS generates the table HTML
//     (except for the table headers; too much i18n there).
