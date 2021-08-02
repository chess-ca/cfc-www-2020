
export default { pre_init }

const page_id = 'pg-ratings-tournament-lists';

function pre_init(page_data) {
    if (page_data.page_id !== page_id) return;

    page_data.now_yyyy = (new Date()).getFullYear();
}
