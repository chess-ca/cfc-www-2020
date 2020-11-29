//======================================================================
// Share Utilities
//======================================================================

//----------------------------------------------------------------------
// Function: api
//  - Although Fetch is fancier, it doesn't support IE11 without
//    polyfills for Fetch which then require polyfills for Promises.
//  - Although XMLHttpRequest is old-school, it works on newer and
//    older browsers (without another dependency to worry about).
//----------------------------------------------------------------------
const api_prefix = 'https://server.chess.ca/api';

export function api(options) {
    const method = String(options.method || 'GET').toUpperCase();
    const api = options.api || null;
    const body = options.body || {};
    const null_fn = function() {};
    const onSuccess = options.onSuccess || null_fn;
    const onFail = options.Fail || null_fn;

    const xhr = new XMLHttpRequest();
    xhr.timeout = 10000;
    xhr.ontimeout = function (e) {
        console.log('API:', method, api, 'Timed-out:', xhr);
        onFail({apicode:-101}, xhr);
    };
    xhr.onload = function () {
        const rsp = xhr.response && JSON.parse(xhr.response);
        if (xhr.status >= 200 && xhr.status < 300) {
            console.log('API:', method, api, 'Success:', xhr);
            onSuccess(rsp || {}, xhr);
        } else {
            console.log('API:', method, api, 'Fail:', xhr);
            onFail(rsp || {}, xhr);
        }
    };
    if (method==='POST') {
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    }
    let api_url = api_prefix + api;
    xhr.open(method, api_url);
    xhr.send(body);
}
