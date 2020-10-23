
function init(pginfo, vue_config) {
    if (pginfo.id !== 'pg-membership-how') return;

    vue_config.data = vue_config.data || {};
    vue_config.data.mbr = {
        is_member: '',
        knows_cfc_id: '',
        got_reset_email: '',
    };
    vue_config.computed = vue_config.computed || {};
    vue_config.computed.show_create_gm_id = function() {
        return this.mbr.is_member==='N';
    }
    vue_config.computed.show_gm_pw_reset = function() {
        return false;
        //return this.mbr.is_member==='Y' && this.mbr.knows_cfc_id==='Y';
    }
    vue_config.computed.show_gm_signin = function() {
        return this.mbr.is_member==='G';
    }
    vue_config.computed.show_buy_cfc = function() {
        return this.mbr.is_member=='N'
            || this.mbr.is_member=='G'
            || (this.mbr.knows_cfc_id=='Y' && this.mbr.got_reset_email=='Y')
    }
    vue_config.computed.show_contact_cfc_find_id = function() {
        return this.mbr.knows_cfc_id==='N';
    }
    vue_config.computed.show_contact_cfc_add_email = function() {
        return false;
    }

}

export default { init }
