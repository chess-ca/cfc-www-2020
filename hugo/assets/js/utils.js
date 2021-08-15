//======================================================================
// utils.js - Shared Utilities
//======================================================================

//----------------------------------------------------------------------
// call_api():  Call an API on the CFC server
//  - Although Fetch is fancier, it doesn't support IE11 without
//    polyfills for Fetch which then require polyfills for Promises.
//  - Although XMLHttpRequest is old-school, it works on newer and
//    older browsers (without another dependency to worry about).
//----------------------------------------------------------------------
export function call_api(options) {
    const default_api_prefix = 'https://server.chess.ca/api';
    // const default_api_prefix = 'http://127.0.0.1:5000/api';

    const null_func = function() {};

    const page_data = options.page_data || {};
    const lang = page_data['lang'] || 'en';
    const timeout = options.timeout || 8000;
    const method = String(options.method || 'GET').toUpperCase();
    const api = options.api || null;
    const api_prefix = options.api_prefix || default_api_prefix;
    const body = options.body || {};
    const onSuccess = options.onSuccess || null_func;
    const onFail = options.Fail || null_func;
    const onFail_alert = options.onFail_alert || true;
    const onTimeout = options.onTimeout || null_func;
    const onTimeout_alert = options.onTimeout_alert || true;

    const xhr = new XMLHttpRequest();
    xhr.timeout = timeout;
    xhr.ontimeout = function () {
        console.log('API call timed-out:', method, api, xhr);
        onTimeout(page_data, xhr);
        if (onTimeout_alert) {
            alert( lang === 'fr'
                ? 'La demande a expiré. Réessayez plus tard.'
                : 'Request timed-out. Try again later.');
        }
    };
    xhr.onload = function () {
        const rsp = xhr.response && JSON.parse(xhr.response);
        if (xhr.status >= 200 && xhr.status < 300) {
            console.log('API success:', method, api, rsp);
            onSuccess(page_data, rsp || {}, xhr);
        } else {
            console.log('API failed:', method, api, rsp);
            onFail(page_data, rsp || {}, xhr);
            if (onFail_alert) {
                alert(page_data.lang === 'fr'
                    ? 'Échec de l\'appel au serveur FCE.\n\nRéessayez plus tard.'
                    : 'Call to CFC Server failed.\n\nTry again later.');
            }
        }
    };
    if (method==='POST') {
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    }
    xhr.open(method, api_prefix + api);
    xhr.send(body);
}


//----------------------------------------------------------------------
// go(): go to a new page/url
//----------------------------------------------------------------------
export function go(dest, el) {
    if (el && el.addClass) {
        // This Bulma.io class adds a spinner to buttons
        el.addClass('is-loading')
    }
    if (dest === '<<<') {
        history.back();
    } else if (dest === '>>>') {
        history.forward();
    } else if (dest.startsWith('lang=')) {
        const langs_from_to = dest.substring(5).split(':');
        const lang_from = `/${langs_from_to[0]}`;
        const lang_to = `/${langs_from_to[1]}`;
        const new_url = String(window.location).replace(lang_from, lang_to, 1);
        window.location.replace(new_url);
    } else {
        dest = dest.replaceAll('[[lang]]', get_page_lang());
        window.location.assign(dest);
    }
}

export function get_attr(el, name, default_value='') {
    if ( ! el.hasAttributes() ) return default_value;
    let attr = el.attributes.getNamedItem(name);
    if ( attr === null ) return default_value;
    return attr.value;
}

export function get_page_lang() {
    const el_html = document.getElementsByTagName('html')[0];
    return el_html.getAttribute('lang') || 'en'
}

export function get_provinces (lang, exclude) {
    lang = lang || 'en';
    let p_list = [
        {code: "AB", name: "Alberta"},
        {code: "BC", name: "British Columbia"},
        {code: "MB", name: "Manitoba"},
        {code: "NB", name: "New Brunswick"},
        {code: "NL", name: "Newfoundland and Labrador"},
        {code: "NT", name: "Northwest Territories"},
        {code: "NS", name: "Nova Scotia"},
        {code: "NU", name: "Nunavut"},
        {code: "ON", name: "Ontario"},
        {code: "PE", name: "Prince Edward Island"},
        {code: "QC", name: "Québec"},
        {code: "SK", name: "Saskatchewan"},
        {code: "YT", name: "Yukon"},
        {code: "US", name: "USA"},
        {code: "FO", name: "Foreign"},
    ];
    if (exclude) {
        let filtered_list = [];
        for (let i=0; i<p_list.length; i++) {
            let p = p_list[i]
            if ( ! exclude.includes(p.code) ) {
                filtered_list.push(p);
            }
        }
        p_list = filtered_list;
    }
    return p_list;
}


/**
 * Returns variable name/vars from the URL's query string.
 * - /path/to/page?x=1&y=2&z=a%20b ==> {x:'1', y:'2', z:'a b'}
 *
 * @returns {string: string, ...}
 */
export function get_url_query_vars() {
    let q = window.location.search.substr(1)    // drop the "?" prefix
    q = q.split('&');
    let qvars = {};
    for (var i=0; i<q.length; i++) {
        var v_v = q[i].split('=', 2);
        if (v_v.length < 2) {
            qvars[v_v[0]] = true;   // a var without a value
        } else {
            qvars[v_v[0]] = decodeURI(v_v[1]);
        }
    }
    return qvars;
}

export function css_insert_once(id, css) {
    const long_id = 'inserted-css-' + id;
    let el_style = document.getElementById(long_id);
    if (el_style) return;   // CSS was already inserted!

    el_style = document.createElement('style');
    el_style.id = long_id;
    el_style.appendChild(document.createTextNode(css));

    const el_head = document.getElementsByTagName('head')[0];
    el_head.appendChild(el_style);
}
