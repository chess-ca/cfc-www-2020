/**
 * Data Access Layer:
 *  - Central location for accessing data to keep it out of the View layers.
 *  - Data may be come from different sources from embedded <scripts> to API calls.
 */

export const get_data = {
    page_i18n, provinces, photobox_home, newsflashes,
    events_upcoming
};

export const get_data_promise = {};

const url_wwwfiles = 'https://www-files.chess.ca';
const url_cfccdn = 'https://server.chess.ca/files';
const url_cloud = 'https://storage.googleapis.com/cfc-public';

//================================ DATA SOURCES ================================
/**
 * Get the web page's i18n text for the page's language.
 * Current implementation: From `window.page_i18n` set by Hugo
 * from the [i18n] array set in the page's front-matter.
 * @returns {Object.<string, string>}
 */
function page_i18n() {
    return window.page_i18n || {};
}

/**
 * Get chess events (filtered by end date).
 * - >= Yesterday to stays past midnight GMT which is evening local time.
 * @returns {Array.<Object>}
 */
function events_upcoming() {
    let events = window.ws_cfc_data.events || [];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterday_ymd = yesterday.toISOString().slice(0,10);
    return events.filter(e => (e.end && e.end >= yesterday_ymd));
}

/**
 * Get photos for home page (filtered by start & end dates).
 * @param {string} lang - page's language
 * @returns {Array.<{photo_url: string, text: string}>}
 */
function photobox_home(lang) {
    lang = lang || 'en';
    let photos = window.ws_cfc_data.photobox_home || [];
    const today = (new Date()).toISOString().slice(0,10);
    photos = photos.filter(p => {
        return ((p.start && p.start <= today)
            && (p.end && p.end >= today));
    });
    photos = photos.map(p => { return {
        photo_url: fmt_url(p['photo_url']),
        text: fmt_lang_text(lang, p.en, p.fr)
    }; });
    return photos;
}

/**
 * Get news flashes for home page (filtered by start & end dates).
 * @param {string} lang - page's language
 * @returns {Array.<{text: string, highlight: string}>}
 */
function newsflashes(lang) {
    lang = lang || 'en';
    let flashes = window.ws_cfc_data.newsflashes || [];
    const today = (new Date()).toISOString().slice(0,10);
    flashes = flashes.filter(f => {
        return ((f.start && f.start <= today)
            && (f.end && f.end >= today));
    });
    flashes = flashes.map(f => { return {
        text: fmt_lang_text(lang, f.en, f.fr),
        highlight: String(f.highlight || '').toLowerCase()
    }; });
    return flashes;
}

/**
 * Get list of provinces including code & name.
 * Does not include "Online" or "Foreign".
 * @returns {Array.<{code: string, name: string}>}
 */
function provinces() {
    return [
        {code: 'AB', name: 'Alberta'},
        {code: 'BC', name: 'British Columbia'},
        {code: 'MB', name: 'Manitoba'},
        {code: 'NB', name: 'New Brunswick'},
        {code: 'NL', name: 'Newfoundland and Labrador'},
        {code: 'NT', name: 'Northwest Territories'},
        {code: 'NS', name: 'Nova Scotia'},
        {code: 'NU', name: 'Nunavut'},
        {code: 'ON', name: 'Ontario'},
        {code: 'PE', name: 'Prince Edward Island'},
        {code: 'QC', name: 'Québec'},
        {code: 'SK', name: 'Saskatchewan'},
        {code: 'YT', name: 'Yukon'}
    ];
}

//================================ DATA UTILITIES ================================
function fmt_url(url) {
    url = url || '[URL UNDEFINED]';
    url = url.replace('wwwfiles:', url_wwwfiles);
    url = url.replace('cfccdn:', url_cfccdn);
    url = url.replace('cloud:', url_cloud);
    return url;
}

function fmt_lang_text(lang, en_text, fr_text) {
    let text = (lang === 'fr') ? fr_text : en_text;
    if (text === '=' || text === '') text = en_text;
    return text;
}