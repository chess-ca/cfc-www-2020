
function init(pginfo, vue_config) {
    if (pginfo.id !== 'pg-membership-how') return;

    vue_config.data = vue_config.data || {};
    vue_config.data.mbr = {
        is_member: '',
        knows_cfc_id: '',
        knows_gm_pw: '',
        got_reset_email: '',
    };
    vue_config.computed = vue_config.computed || {};
    vue_config.computed.show_create_gm_id = function() {
        return this.mbr.is_member==='N';
    }
    vue_config.computed.show_gm_pw_reset_part1 = function() {
        return this.mbr.is_member=='Y'
            && this.mbr.knows_cfc_id=='Y'
            && this.mbr.knows_gm_pw=='N';
    }
    vue_config.computed.show_gm_pw_reset_part2 = function() {
        return this.mbr.is_member=='Y'
            && this.mbr.knows_cfc_id=='Y'
            && this.mbr.knows_gm_pw=='N'
            && this.mbr.got_reset_email=='Y';
    }
    vue_config.computed.show_gm_signin = function() {
        return this.mbr.is_member=='N'
            || (this.mbr.is_member=='Y'
                && this.mbr.knows_cfc_id=='Y'
                && (
                    (this.mbr.knows_gm_pw=='N' && this.mbr.got_reset_email=='Y')
                    || this.mbr.knows_gm_pw=='Y'
                )
            );
    }
    vue_config.computed.show_buy_cfc = function() {
        return this.mbr.is_member=='N'
            || (this.mbr.is_member=='Y'
                && this.mbr.knows_cfc_id=='Y'
                && (
                    (this.mbr.knows_gm_pw=='N' && this.mbr.got_reset_email=='Y')
                    || this.mbr.knows_gm_pw=='Y'
                )
            );
    }
    vue_config.computed.show_contact_cfc_find_id = function() {
        return this.mbr.is_member=='Y'
            && this.mbr.knows_cfc_id==='N';
    }
    vue_config.computed.show_contact_cfc_add_email = function() {
        return this.mbr.is_member=='Y'
            && this.mbr.knows_cfc_id=='Y'
            && this.mbr.knows_gm_pw=='N'
            && this.mbr.got_reset_email=='N';
    }

}

export default { init }
