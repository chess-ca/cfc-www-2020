import {get_page_lang} from "../hugo/assets/js/utils";

/**
 * Call an API. A thin wrapper around XMLHttpRequest, which
 * supports onProgress (fetch doesn't).
 *
 * @param args - a map of argument name/values.
 * @param args.method - (default "POST") the API's URL method
 * @param args.url - the API's URL.
 * @param args.vars - a map of name/values for the FormData.
 * @param args.file_obj - for file uploads, ...
 * @param args.onProgress - function to call on "progress" events (file uploads).
 * @param args.onComplete - function to call on "complete" events
 * @param args.onError - function to call on "error" events
 * @param args.onAbort - function to call on "abort" events
 */
export function call_api(args) {
    const method = args.method || 'POST';
    let url = args.url;
    const vars = args.vars || null;
    const file_obj = args.file_obj || null;

    const onProgress = args.onProgress || null;
    const onComplete = args.onComplete || null;
    const onError = args.onError || null;
    const onErrorAlert = args.onErrorAlert || true;
    const onAbort = args.onAbort || null;
    const timeout = args.timeout || 8000;
    const onTimeout = args.onTimeout || null;
    const onTimeoutAlert = args.onTimeoutAlert || true;

    const formdata = new FormData();
    if (vars !== null) {
        for (const key in vars) {
            if (vars.hasOwnProperty(key))
                formdata.append(key, vars[key]);
        }
    }
    if (file_obj !== null) {
        formdata.append('upload_file', file_obj, file_obj.name);
    }

    const xhr = new XMLHttpRequest();
    xhr.timeout = timeout;
    xhr.ontimeout = main_onTimeout;
    xhr.upload.addEventListener('progress', main_onProgress, false);
    xhr.addEventListener('load', main_onComplete);
    xhr.addEventListener('error', main_onError);
    xhr.addEventListener('abort', main_onAbort);
    xhr.open(method, url);

    console.log('API: Calling:', method, url);
    if (vars !== null) console.log('\tVars:', vars);
    if (file_obj !== null) console.log('\tFile:', file_obj);
    xhr.send(formdata);

    //-------- Main Handlers
    function main_onProgress(event) {
        const p = Math.floor(100 * event.loaded / event.total);
        console.log('File upload: progress:', p, '%');
        onProgress && onProgress(event);
    }
    function main_onComplete(event) {
        const rsp = xhr.response && JSON.parse(xhr.response);
        if (xhr.status >= 200 && xhr.status < 300) {
            console.log('API: Success:', rsp);
            onComplete(event, rsp || {});
        } else {
            console.log('API: Failed:', xhr.status, method, url);
            if (onError) {
                onError(event);
            } else {
                alert(get_lang('en') === 'fr'
                    ? 'Échec de l\'appel au serveur FCE.\n\nRéessayez plus tard.'
                    : 'Call to CFC Server failed.\n\nTry again later.');
            }
        }
    }
    function main_onError(event) {
        console.error('API: Error:', event)
        onError && onError(event);
    }
    function main_onAbort(event) {
        console.warn('API: Aborted:', event);
        onAbort && onAbort(event);
    }
    function main_onTimeout (event) {
        console.error('API: Timeout:', event);
        if (onTimeout) {
            onTimeout(event);
        } else if (onTimeoutAlert) {
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
            orig_onComplete(event, rsp);
            resolve(event);
        };
        args.onError = (event) => {
            orig_onError(event);
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
 * Return a map of keys to i18n translated text an indicated language.
 * @param lang_index - index of required language: page_lang==='fr' ? 1 : 0
 * @param all_langs_map - { key_1: ['English text', 'French text'], key_2: ['More', '='], ...}
 * @return {map} - can be used in SvelteJS HTML as {i18n.key_1}
 */
export function get_translator_map(lang_index, all_langs_map) {
    // text_map = {'key': ['text for lang 0', 'text for lang 1']}
    const lang_map = {}
    for (const key in all_langs_map) {
        if (all_langs_map.hasOwnProperty(key)) {
            const text_list = all_langs_map[key];
            if (lang_index >= text_list.length) {
                console.error(`i18n translator: key "${key}" is missing text for index ${lang_index}.`);
                // leave it "undefined" (can find it the same way as for invalid keys).
            } else {
                let text = text_list[lang_index];
                lang_map[key] = (text === '=') ? text_list[0] : text;
            }
        }
    }
    return lang_map;
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

export function goto_event_handler(event) {
    const el_top = event.current
    let target = event.target;
    while (target) {
        target = target.parentElement;
    }
}

export function str_fmt(format) {
    const args = Array.prototype.slice.call(arguments, 1);
    return format.replace(/{(\d+)}/g, function(match, i) {
        return typeof args[i] === 'undefined' ? match : args[i];
    });
};
