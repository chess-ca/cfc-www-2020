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
const default_api_prefix = 'https://server.chess.ca/api';

export function call_api(options) {
    const page_data = options.page_data || {};
    const method = String(options.method || 'GET').toUpperCase();
    const api = options.api || null;
    const api_prefix = options.api_prefix || default_api_prefix;
    const body = options.body || {};
    const null_fn = function() {};
    const onSuccess = options.onSuccess || null_fn;
    const onFail = options.Fail || null_fn;
    const onFail_alert = options.onFail_alert || true;

    const xhr = new XMLHttpRequest();
    xhr.timeout = 10000;
    xhr.ontimeout = function (e) {
        console.log('API timed-out:', method, api, xhr);
        onFail(page_data, {apicode:-101}, xhr);
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
                    : 'Call to CFC Server failed.\n\nTry again later.'
                );
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
// go()
//----------------------------------------------------------------------
export function go(dest, el) {
    if (el && el.addClass) {
        el.addClass('is-loading')   // this Bulma.io class adds a spinner to buttons
    }
    if (dest === '<<<') {
        history.back();
    } else if (dest === '>>>') {
        history.forward();
    } else {
        dest = dest.replaceAll('[lang]', get_page_lang());
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
