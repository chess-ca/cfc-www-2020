/**
 * @file VueJS Filters
 * @author Don Parakin, 2020
 */

function uppercase(value) {
    return String.toString(value).toUpperCase();
}

/**
 * @function Add these VueJS filters to Vue.
 */
export function add_filters(Vue) {
    Vue.filter('uppercase', uppercase);
}
