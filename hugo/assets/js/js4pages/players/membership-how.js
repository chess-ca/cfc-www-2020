
export default { pre_init }

const page_id = 'pg-membership-how';

function pre_init(page_data) {
    if (page_data.page_id !== page_id) return;

    const pd = page_data;
    pd.mbr = {
        is_member: '',
        knows_cfc_id: '',
        knows_gm_pw: '',    // knows GoMembership password
        got_reset_email: '',
    };

    pd.show_create_gm_id = function() {
        return this.mbr.is_member === 'N';
    }
    pd.show_gm_pw_reset_part1 = function() {
        return this.mbr.is_member === 'Y'
            && this.mbr.knows_cfc_id === 'Y'
            && this.mbr.knows_gm_pw === 'N';
    };
    pd.show_gm_pw_reset_part2 = function() {
        return this.mbr.is_member === 'Y'
            && this.mbr.knows_cfc_id === 'Y'
            && this.mbr.knows_gm_pw === 'N'
            && this.mbr.got_reset_email === 'Y';
    }
    pd.show_gm_signin = function() {
        return this.mbr.is_member === 'N'
            || (this.mbr.is_member === 'Y'
                && this.mbr.knows_cfc_id === 'Y'
                && (
                    (this.mbr.knows_gm_pw === 'N' && this.mbr.got_reset_email === 'Y')
                    || this.mbr.knows_gm_pw  === 'Y'
                )
            );
    }
    pd.show_buy_cfc = function() {
        return this.mbr.is_member === 'N'
            || (this.mbr.is_member === 'Y'
                && this.mbr.knows_cfc_id === 'Y'
                && (
                    (this.mbr.knows_gm_pw === 'N' && this.mbr.got_reset_email === 'Y')
                    || this.mbr.knows_gm_pw === 'Y'
                )
            );
    }
    pd.show_contact_cfc_find_id = function() {
        return this.mbr.is_member === 'Y'
            && this.mbr.knows_cfc_id === 'N';
    }
    pd.show_contact_cfc_add_email = function() {
        return this.mbr.is_member === 'Y'
            && this.mbr.knows_cfc_id === 'Y'
            && this.mbr.knows_gm_pw === 'N'
            && this.mbr.got_reset_email === 'N';
    }
}
