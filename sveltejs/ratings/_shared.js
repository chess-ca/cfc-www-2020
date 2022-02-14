/**
 * Format a City & Province
 * @param city
 * @param prov
 * @return {string|*}
 */
export function fmt_city_prov(city, prov) {
    if (prov === 'FO') {
        return city;
    } else if (city === '') {
        return prov;
    }
    return `${city}, ${prov}`;
}

/**
 * Format a CFC expiry date.
 * @param date
 * @return {string|*}
 */
export function fmt_cfc_expiry(date) {
    if (!date) return '&ndash;';
    if (date > '2080-01-01') return 'LIFE';
    if (date < '1980-01-01') return '&ndash;';
    return date;
}

/**
 * Format a CFC rating for HTML output.
 * @param value - a rating (may be provisional)
 * @param indicator - If <=40, rating is provisional and this is the
 *      number of games rated. Else it player's highest rating.
 * @return {*|string} - the formatted rating.
 */
export function fmt_rating(value, indicator) {
    return (indicator > 40) ? value : `<i>(${value})</i>`;
}

/**
 * Format a CFC rating indicator for HTML output
 * @param indicator
 * @param i18n_suffix - "g" for English, "j" for French
 * @return {*|string}
 */
export function fmt_rating_indicator(indicator, i18n_suffix) {
    if (indicator > 40) return indicator;
    return `<i>(${indicator} ${i18n_suffix || ''})</i>`;
}
