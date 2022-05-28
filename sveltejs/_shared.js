import {get_page_lang} from "../hugo/assets/js/utils";

const api_aliases = {
    'cfc-api:': 'https://server.chess.ca/api'
};

export class ApiCall{
    #method;
    #url;
    #form_data;
    #file_upload;
    #lang;
    #timeout_ms = 8000;
    #show_error_alert = true;
    #show_timeout_alert = true;
    #alerts = {
        'en': 'Call to the server failed.\n\nTry again later.',
        'fr': 'L\'appel au serveur a échoué.\n\nRéessayez plus tard.'
    };
    #xhr;
    #handlers = {};

    /**
     * @param method_url - 'GET https://foo.com/api/myapi'
     * @param lang - (optional) language for alert message
     */
    constructor(method_url, lang) {
        const m_l = method_url.split(/\s+/, 2);
        this.#method = m_l[0].toUpperCase();
        this.#url = m_l[1];
        for (const key in api_aliases) {
            this.#url = this.#url.replace(key, api_aliases[key]);
        }
        this.#lang = lang || 'en';
    }

    setFormData = (form_data) => {
        this.#form_data = form_data;
    }
    setFileUpload = (file_obj) => {
        this.#file_upload = file_obj;
    }

    onProgress = (func) => {
        this.#handlers.onProgress = func;
        return this;
    }
    onComplete = (func) => {
        this.#handlers.onComplete = func;
        return this;
    }
    onError = (func) => {
        this.#handlers.onError = func;
        return this;
    }
    showErrorAlert = (value) => {
        this.#show_error_alert = Boolean(value);
        return this;
    }
    onAbort = (func) => {
        this.#handlers.onAbort = func;
        return this;
    }
    setTimeout = (time_ms) => {
        this.#timeout_ms = time_ms;
        return this;
    }
    onTimeout = (func) => {
        this.#handlers.onTimeout = func;
        return this;
    }
    showTimeoutAlert = (value) => {
        this.#show_timeout_alert = Boolean(value);
        return this;
    }

    call = () => {
        const fdata = new FormData();
        if (this.#form_data) {
            for (const key in this.#form_data) {
                if (this.#form_data.hasOwnProperty(key))
                    fdata.append(key, this.#form_data[key]);
            }
        }
        if (this.#file_upload) {
            fdata.append('file_upload', this.#file_upload, this.#file_upload.name);
        }

        const xhr = new XMLHttpRequest();
        this.#xhr = xhr;
        xhr.timeout = this.#timeout_ms;
        xhr.ontimeout = this.#handle_timeout;
        if (this.#handlers.onProgress)
            xhr.upload.addEventListener('progress', this.#handle_progress, false);
        xhr.addEventListener('load', this.#handle_complete);
        xhr.addEventListener('error', this.#handle_error);
        xhr.addEventListener('abort', this.#handle_abort);
        xhr.open(this.#method, this.#url);

        console.log('API: Call:\n\t', this.#method, this.#url);
        if (this.#form_data) console.log('\tVars:', this.#form_data);
        if (this.#file_upload) console.log('\tFile:', this.#file_upload);
        xhr.send(fdata);
    }

    call_as_promise = () => {
        const api_caller = (resolve, reject) => {
            this.#handlers.resolve = resolve;
            this.#handlers.reject = reject;
            this.call();
        }
        return new Promise(api_caller);
    }

    #handle_complete = (event) => {
        const rsp = this.#xhr.response && JSON.parse(this.#xhr.response);
        if (this.#xhr.status >= 200 && this.#xhr.status < 300) {
            console.log('API: Success:', rsp);
            this.#handlers.onComplete && this.#handlers.onComplete(event, rsp || {});
            this.#handlers.resolve && this.#handlers.resolve(rsp);
        } else {
            console.log('API: Failed:', this.#xhr.status, method, url);
            if (this.#handlers.onError) {
                this.#handlers.onError(event);
            } else if (this.#show_error_alert) {
                alert(this.#alerts[this.#lang]);
            }
            this.#handlers.reject && this.#handlers.reject(event);
        }
    }
    #handle_progress = (event) => {
        const p = Math.floor(100 * event.loaded / event.total);
        console.log('File upload: progress:', p, '%');
        this.#handlers.onProgress && this.#handlers.onProgress(event);
    }
    #handle_error = (event) => {
        console.error('API: Error:', event)
        this.#handlers.onError && this.#handlers.onError(event);
        this.#handlers.reject && this.#handlers.reject(event);
    }
    #handle_abort = (event) => {
        console.warn('API: Aborted:', event);
        this.#handlers.onAbort && this.#handlers.onAbort(event);
        this.#handlers.reject && this.#handlers.reject(event);
    }
    #handle_timeout = (event) => {
        console.error('API: Timeout:', event);
        if (this.#handlers.onTimeout) {
            this.#handlers.onTimeout(event);
        } else if (this.#show_timeout_alert) {
            alert(this.#alerts[this.#lang]);
        }
        this.#handlers.reject && this.#handlers.reject(event);
    }
}


/**
 * Call an API. A thin wrapper around XMLHttpRequest, which
 * supports onProgress (fetch doesn't).
 *
 * @param arg - a map of argument name/values.
 * @param arg.method - (default "POST") the API's URL method
 * @param arg.url - the API's URL.
 * @param arg.vars - a map of name/values for the FormData.
 * @param arg.file_obj - for file uploads, ...
 * @param arg.onProgress - function to call on "progress" events (file uploads).
 * @param arg.onComplete - function to call on "complete" events
 * @param arg.onError - function to call on "error" events
 * @param arg.onAbort - function to call on "abort" events
 */
export function call_api(arg) {
    const method = arg.method || 'GET';

    const xhr = new XMLHttpRequest();
    xhr.timeout = arg.timeout || 8000;
    xhr.ontimeout = main_onTimeout;
    xhr.upload.addEventListener('progress', main_onProgress, false);
    xhr.addEventListener('load', main_onComplete);
    xhr.addEventListener('error', main_onError);
    xhr.addEventListener('abort', main_onAbort);
    xhr.open(method, arg.url);

    console.log('API: Call:', method, arg.url);
    if (arg.vars || arg.file_obj) {
        const formdata = new FormData();
        if (arg.vars) {
            console.log('\tVars:', arg.vars);
            for (const key in arg.vars) {
                if (arg.vars.hasOwnProperty(key))
                    formdata.append(key, arg.vars[key]);
            }
        }
        if (arg.file_obj) {
            console.log('\tFile:', arg.file_obj);
            formdata.append('upload_file', arg.file_obj, arg.file_obj.name);
        }
        xhr.send(formdata);
    } else {
        xhr.send();
    }

    function main_onProgress(event) {
        const p = Math.floor(100 * event.loaded / event.total);
        console.log('... Progress:', p, '%');
        if (arg.onProgress) arg.onProgress(event);
    }
    function main_onComplete(event) {
        const rsp = xhr.response && JSON.parse(xhr.response);
        if (xhr.status >= 200 && xhr.status < 300) {
            console.log('API: Success:', rsp);
            if (arg.onComplete) arg.onComplete(event, rsp || {});
        } else {
            console.log('API: Failed:', xhr.status, method, arg.url);
            if (arg.onError) {
                arg.onError(event);
            } else {
                alert(get_lang('en') === 'fr'
                    ? 'Échec de l\'appel au serveur FCE.\n\nRéessayez plus tard.'
                    : 'Call to CFC Server failed.\n\nTry again later.');
            }
        }
    }
    function main_onError(event) {
        console.error('API: Error:', event)
        if (arg.onError) arg.onError(event);
    }
    function main_onAbort(event) {
        console.warn('API: Aborted:', event);
        if (arg.onAbort) arg.onAbort(event);
    }
    function main_onTimeout (event) {
        console.error('API: Timeout:', event);
        if (arg.onTimeout) {
            arg.onTimeout(event);
        } else if (arg.onTimeoutAlert !== false) {
            alert( get_lang('en') === 'fr'
                ? 'La demande a expiré.\n\nRéessayez plus tard.'
                : 'Request timed-out.\n\nTry again later.');
        }
    }
    // Notes:
    //  - Although XMLHttpRequest is old-school, it supports onProgress
    //    (fetch does not!) and works on all browsers (without polyfills).
}

/**
 * Return a Promise that calls an API. The Promise wraps a call to
 * call_api(), which is a thin wrapper around XMLHttpRequest, which
 * supports onProgress (fetch doesn't). Use this for frameworks
 * (like SvelteJS) that work with Promises (not callbacks).
 * @param args - Same args as for call_api().
 * @return {Promise}
 */
export function call_api_promise(args) {
    const nothing = () => {};
    const orig_onComplete = args.onComplete || nothing;
    const orig_onError = args.onError || nothing;
    function api_caller(resolve, reject) {
        args.onComplete = (event, rsp) => {
            orig_onComplete && orig_onComplete(event, rsp);
            resolve(event);
        };
        args.onError = (event) => {
            orig_onError && orig_onError(event);
            reject(event);
        };
        call_api(args);
    }
    return new Promise(api_caller);
}

/**
 * Mount SvelteJS components.  For each HTML tag with attribute "sveltejs",
 * mount an instance of a SvelteJS component.
 *
 * For tag names, in the HTML they may be mixed case with hyphens.
 * In the map, they must be lower-case with underscores replacing hyphens.
 *
 * For tag attribute names, in the HTML they may be mixed case.
 * In MyCode.svelte, the attribute names *MUST* be lower-case (translated by the browser)
 * with underscores replacing hyphens (translated by this function).
 *
 * @param tag_component_map: A map of `tag-names` to SvelteJS components.
 *      Example: for &lt;My-App-Tag&gt;, ["my_app_tag"] = &lt;sveltejs-object&gt;.
 */
export function mount_sveltejs_components(tag_component_map) {
    const component_list = document.querySelectorAll('[sveltejs]');
    component_list.forEach((c_el) => {
        const c_name = c_el.tagName.toLowerCase();
        const c_svelte = tag_component_map[c_name.replaceAll('-', '_')];
        if (!c_svelte) {
            console.error(`SvelteJS component "${c_name}" is not defined.`);
        } else {
            const c_props = {};
            const c_attrs = c_el.attributes;
            for(let i = 0; i < c_attrs.length; i++) {
                if (c_attrs[i].name !== 'sveltejs') {
                    c_props[c_attrs[i].name.toLowerCase()] = c_attrs[i].value;
                }
            }
            new c_svelte({target: c_el, props: c_props});
            // CSS might have [sveltejs] {display:none;}. Remove to show it.
            c_el.attributes.removeNamedItem('sveltejs');
        }
    });
    // Notes:
    //  - FYI, this had base props passed to every component (page_lang, etc) but I removed it
    //    because Svelte would complain if undeclared or else complain if declared but not used.
}

/**
 * Return the value of a DOM element's attribute
 * @param el - a DOM element or a selector string.
 * @param attr_name - name of attribute.
 * @param default_value - if the tag doesn't have the attribute.
 * @returns {string} - value of the attribute (or default).
 */
export function get_attr(el, attr_name, default_value=null) {
    if (typeof el === 'string') {
        el = document.querySelector(el);
        if (el === null) return default_value;
    }
    const attr = el.attributes.getNamedItem(attr_name);
    if ( attr === null ) return default_value;
    return attr.value;
    // Notes:
    //  - Don't use element.getAttribute() as that may return null or ""
    //    so unable to tell if it was set to "" or was missing (use default).
}

/**
 * Return the page's language code "en", "fr", etc.
 * @param default_lang
 * @return {string}
 */
export function get_lang(default_lang) {
    return get_attr('html', 'lang', default_lang || 'en');
    // Notes: A special case of get_attr() that is frequently used.
}

/**
 * Return the variable names/value from the URL's query string.
 * - For /path/to/page?x=1&y=2&z=my%20cat return {x:'1', y:'2', z:'my cat'}
 *
 * @returns {string: string, ...}
 */
export function get_url_query_vars() {
    let q = window.location.search.substring(1)    // drop the "?" prefix
    if (q.trim() === '') {
        return {};
    }
    q = q.split('&');
    const qvars = {};
    for (let i=0; i<q.length; i++) {
        let n_v = q[i].split('=', 2);
        if (n_v.length < 2) {
            qvars[n_v[0]] = true;   // a var without a value
        } else {
            qvars[n_v[0]] = decodeURI(n_v[1]);
        }
    }
    return qvars;
}

/**
 * Return the values from the URL's hash.
 * - For /path/to/page/#/v1/v2/ return ['v1', 'v2', '']
 * @returns {string[]}
 */
export function get_url_hash_values() {
    let hash = window.location.hash.substring(1);      // drop the "#" prefix
    return (hash.trim() === '') ? [] : hash.split('/');
}

/**
 * Go to a web page (with some handy conveniences)
 * @param url - URL of the next web page.
 *      "[[lang]]" will be replaced by the value of &lt;html lang="en">.
 *      If '&lt;&lt;&lt;', goes back; if '>>>' goes forward one page.
 *      If 'lang=en:fr', will switch languages of the current URL
 *      by replacing "/en" with "/fr" ('lang=&lt;from>:&lt;to>').
 * @param el - if specified, will add a class to the element.
 * @param add_class - CSS class to add to the element. Default is "is-loading",
 *      a Bulma.io class that adds a spinner to buttons.
 */
export function goto(url, el, add_class) {
    if (el && el.classList) {
        el.classList.add(add_class || 'is-loading');
    }
    if (url === '<<<') {
        history.back();
    } else if (url === '>>>') {
        history.forward();
    } else if (url.startsWith('lang=')) {
        // "lang=en:fr" switches language of current URL (from /en to /fr)
        const langs_from_to = url.substring(5).split(':');
        const lang_from = `/${langs_from_to[0]}`;
        const lang_to = `/${langs_from_to[1]}`;
        const new_url = String(window.location).replace(lang_from, lang_to, 1);
        window.location.replace(new_url);
    } else {
        const page_lang = get_attr('html', 'lang', 'en')
        url = url.replaceAll('[[lang]]', page_lang);
        window.location.assign(url);
    }
}

/**
 * One handler for many clickable elements. Set onclick on an ancestor of all the
 * clickable elements and set "data-goto" attribute on each clickable element.
 * @param event
 */
export function goto_handler(event) {
    const el = event.target.closest('[data-goto]');
    const attr = el && el.attributes.getNamedItem('data-goto');
    if (attr) goto(attr.value);
}

/**
 * Substitue values into a string. Useful for i18n strings.
 * Example: fmt_str('Name is {1}, {0}', 'Ringo', 'Starr');
 * @param format
 * @return {*}
 */
export function fmt_str(format) {
    const args = Array.prototype.slice.call(arguments, 1);
    return format.replace(/{(\d+)}/g, function(match, i) {
        return (typeof args[i] === 'undefined') ? match : args[i];
    });
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
