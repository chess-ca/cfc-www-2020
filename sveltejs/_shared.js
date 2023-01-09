const cfc_server_prod = 'https://server.chess.ca/';
const cfc_server_local = 'http://127.0.0.1:5000/';
const cfc_server_default = cfc_server_prod;

/**
 * Call an API to get data for a page. URL substitutions are
 * done for "cfc-server://", "[[qvars]]", and "[[qvar.x]]".
 *
 * @param url - URL of the API (with substitutable tokens)
 * @param on_success - function called when API succeeds
 * @param on_error - function called when API fails
 * @return {Promise<*>}
 */
export function get_data_promise(url, on_success, on_error) {
    url = url_substitutions(url);
    console.log('API: Calling:\n' + url)
    return fetch(url).then(
            rsp => rsp.json()
        ).then(data => {
            console.log('API: Success:', data);
            return on_success ? on_success(data) : data;
        }).catch(error => {
            console.error('API: Error:', error);
            on_error && on_error(error);
            throw error;
        });
}

function url_substitutions(url) {
    const qvars = get_url_query_vars();
    //---- Substitute hostname alias depending on api=<environment>
    const api_env = qvars.api || 'prod';
    if (api_env === 'l') {
        url = url.replace('cfc-server://', cfc_server_local);
    } else {
        url = url.replace('cfc-server://', cfc_server_default);
    }
    //---- Substitute [[qvars]] with all query vars of the web page (except api=)
    delete qvars.api;
    url = url.replaceAll(
        '[[qvars]]',
        () => qvars_to_qstr(qvars)
    );
    //---- Substitute [[qvar.x]] with the query var "x" of the web page
    url = url.replaceAll(
        /\[\[qvar\.(.+?)]]/g,       // "?" ==> don't be greedy!
        (m, key) => (qvars[key] || '')
    );
    return url;

    function qvars_to_qstr(qvars) {
        const props = [];
        for (const prop in qvars) {
            if (qvars.hasOwnProperty(prop))
                props.push(prop+'='+encodeURI(qvars[prop]));
        }
        return props.join('&');
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
 * Mount SvelteJS components.  For each HTML tag with attribute "sveltejs",
 * mount an instance of a SvelteJS component.
 *
 * Names of HTML tags may be mixed case with hyphens. In the map, they must be
 * lower-case with underscores replacing hyphens.
 *
 * Attributes of the HTML tags may be mixed case. In MyCode.svelte,
 * the attribute names *MUST* be lower-case (translated by the browser)
 * with underscores replacing hyphens (translated by this function).
 *
 * @param {Map} tag_component_map: A map of `tag-names` to SvelteJS components.
 *      Example: for &lt;My-App-Tag&gt;, ["my_app_tag"] = &lt;sveltejs-object&gt;.
 * @param {string[]} excluded_attrs: names of attributes of the element
 *      to exclude from passing to the Svelte component.
 */
export function mount_sveltejs_components(tag_component_map, excluded_attrs) {
    excluded_attrs = excluded_attrs || ['sveltejs', 'style'];
    const component_list = document.querySelectorAll('[sveltejs]');
    for (const c_el of component_list) {
        //---- Map the <tag-name> to a Svelte component
        const c_tag = c_el.tagName.toLowerCase();
        const c_svelte = tag_component_map[c_tag.replaceAll('-', '_')];
        if (!c_svelte) {
            // Component not defined in this JS bundle (but may be in another bundle)
            continue;
        }
        //---- Get component's props from mount element's attributes
        const c_props = {};
        for (const attr of c_el.attributes) {
            if (!excluded_attrs.includes(attr.name)) {
                c_props[attr.name] = attr.value;
            }
        }
        //---- Create/mount Svelete component (with target & props)
        const c_instance = new c_svelte({target: c_el, props: c_props});
    }
    for (const el of document.querySelectorAll('[s-cloak]')) {
        el.attributes.removeNamedItem('s-cloak');
    }
    // Notes:
    //  - FYI, before this code added base props to every component (page_lang, etc)
    //    but Svelte would complain if undeclared or if declared but not used. So, removed.
}

/**
 * Get the siblings of a DOM element (excludes itself).
 * Useful in SvelteJS components to get the siblings of
 * an element added with bind:this={my_el}.
 * @param element
 * @param remove - if not false, remove from parent
 * @returns {Map<any, any>}
 */
export function get_siblings(element, remove) {
    remove = remove !== false;
    const el_parent = element.parentElement;
    const children = new Map();
    for (let i=0; i<el_parent.children.length; i++) {
        const child = el_parent.children.item(i);
        if (child === element) continue;
        children.set(child.id || i, child);
    }
    if (remove) {
        children.forEach(child => el_parent.removeChild(child));
    }
    return children;
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
    let qvars = window.page_url_query_vars;
    if (qvars === undefined) {
        const q_str = window.location.search.slice(1).trim();  // drop the "?" prefix
        if (q_str === '') {
            qvars = {};
        } else {
            const q_pairs = q_str.split('&');
            qvars = {};
            for (const pair of q_pairs) {
                const n_v = pair.split('=', 2);
                qvars[n_v[0]] = (n_v.length < 2)
                    ? true                // var without a value is boolean true
                    : decodeURI(n_v[1]);  // var with encoded value
            }
        }
        window.page_url_query_vars = qvars;
    }
    return qvars;
}

/**
 * Get value for key in the URL's query string (...?x=1&y=2)
 * @param key - name of variable in query string
 * @param default_value - value if key is not in query string
 * @returns {string|boolean} - value (boolean "true" if key but no value)
 */
export function query_var(key, default_value) {
    const qvars = get_url_query_vars();
    return (qvars[key] === undefined) ? default_value : qvars[key];
}

/**
 * Return the values from the URL's hash.
 * - For /path/to/page/#/v1/v2/ return ['v1', 'v2', '']
 * @returns {string[]}
 */
export function get_url_hash_values() {
    let hash = window.location.hash.slice(1);      // drop the "#" prefix
    return (hash.trim() === '') ? [] : hash.split('/');
}

/**
 * Add listeners for "clickgo".  For containers (such as a table and its rows),
 * instead of one listener per contained item (row) have just one listener on
 * the container (table).  For performance.  Formerly done by AlpineJS.
 */
export function add_clickgo_listeners() {
    document.querySelectorAll('[clickgo-listener]').forEach(el => {
        el.addEventListener('click', event => {
            const el_goto = event.target.closest('[clickgo]');
            if (el_goto) {
                const go_url = el_goto.getAttribute('clickgo');
                window.location.assign(go_url);
            }
        });
    });
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
        const langs_from_to = url.slice(5).split(':');
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
 * For performance, can have just 1 click listener for MANY clickable
 * elements. Set onclick on an ancestor of all the clickable elements
 * and set "data-goto" attribute on each clickable element.
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

/**
 * Invokes the handler function iff the "enter" key was pressed (code=13).
 * For accessibility (a11y), actions caused by clicks should also be
 * caused by the "enter" key. The browser does it already for some elements
 * (<a>, <button>, <input>); must add it for others (<div>, <tbody>, etc).
 * @param {function(Event)} clickHandler- called if [enter] key was pressed
 * @returns {(function(Event): void)}
 */
// Ref: https://dev.to/receter/easy-accessible-click-handlers-4jkb
export function a11y_click(clickHandler) {
    return (event) => {
        if (event.keyCode === 13 /* [enter] key */) {
            clickHandler(event);
        }
    };
}

/**
 * Insert CFC constants:
 * - "junior-year-of-birth": the current year cut-off for Juniors.
 */
export function insert_cfc_constants() {
    const junior_yob = String((new Date()).getFullYear() - 20);

    const el_list = document.querySelectorAll('[cfc-constant]');
    el_list.forEach(el => {
        const name = el.getAttribute('cfc-constant');
        if (name === 'junior-year-of-birth') {
            el.textContent = junior_yob;
        }
    });
}