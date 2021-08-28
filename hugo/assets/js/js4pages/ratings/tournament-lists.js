
export default { pre_init }

const page_id = 'pg-ratings-tournament-lists';

function pre_init(page_data) {
    if (page_data.page_id !== page_id) return;

    const pd = page_data;
    pd.now_yyyy = (new Date()).getFullYear();
}
