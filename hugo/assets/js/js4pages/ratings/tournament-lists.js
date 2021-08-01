
function page_init(page_data) {
    if (page_data.page_id !== 'pg-ratings-tournament-lists') return;

    page_data.now_yyyy = (new Date()).getFullYear();
}

export default { page_init }
