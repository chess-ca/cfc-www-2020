<div bind:this={el_root}>
 <div id="join-intro-dest"></div>

 <div class="select">
  <select bind:value={is_member}>
   <option value="">{i18n.q_cfc_member}</option>
   <option value="N">{i18n.cfc_never}</option>
   <option value="Y">{i18n.cfc_i_am}</option>
   <option value="Y">{i18n.cfc_i_was}</option>
  </select>
 </div>

 <div class:hide={is_member !== 'Y'} class="mt-3">
  <div id="join-is-member-dest" class="mt-3"></div>

  <div class="select">
   <select bind:value={knows_cfc_id}>
    <option value="">{i18n.q_know_cfc}</option>
    <option value="Y">{i18n.cfc_known}</option>
    <option value="N">{i18n.cfc_unknown}</option>
   </select>
  </div>

  <div class:hide={knows_cfc_id !== 'Y'} class="mt-3">
   <div id="join-same-ids-dest"></div>

   <div class="select">
    <select bind:value={knows_justgo_pw}>
     <option value="">{@html i18n.q_justgo_pw}</option>
     <option value="Y">{@html i18n.justgo_pw_known}</option>
     <option value="N">{@html i18n.justgo_pw_unknown}</option>
    </select>
   </div>
  </div>
 </div>

 <div class:hide={!show_create_justgo_id}
     id="join-create-justgo-id-dest" class="mt-3"></div>

 <div class:hide={!show_justgo_pw_reset_part1}
      id="join-justgo-pw-reset-part1-dest" class="mt-3">
  <div class="select">
   <select bind:value={got_reset_email}>
    <option value="">{i18n.q_pw_reset_email}</option>
    <option value="Y">{i18n.pw_reset_received}</option>
    <option value="N">{i18n.pw_reset_not_received}</option>
   </select>
  </div>
 </div>

 <div class:hide={!show_justgo_pw_reset_part2}
     id="join-justgo-pw-reset-part2-dest" class="mt-3"></div>

 <div class:hide={!show_justgo_signin}
      id="join-justgo-signin-dest" class="mt-3">
  <a class="button is-info" href="https://cfc.justgo.com/" target="_blank" rel="noreferrer">{i18n.go_to_justgo}</a>
 </div>

 <div class:hide={!show_buy_cfc}
     id="join-buy-cfc-dest" class="mt-3"></div>

 <div class:hide={!show_contact_cfc_find_id}
      id="join-show-contact-cfc-find-id-dest" class="mt-3">
  <a class="button is-info" href="https://forms.gle/miag39Q6tutM7pmc7" target="_blank" rel="noreferrer">{i18n.contact_cfc}</a>
 </div>

 <div class:hide={!show_contact_cfc_add_email}
      id="join-show-contact-cfc-add-email-dest" class="mt-3">
  <a class="button is-info" href="https://forms.gle/miag39Q6tutM7pmc7" target="_blank" rel="noreferrer">{i18n.contact_cfc}</a>
 </div>
</div>

<script>
 import {onMount} from 'svelte';
 import {get_data} from "../data_access";
 import {get_siblings} from '../_shared';

 const i18n = get_data.page_i18n();
 let el_root;
 let is_member = '';
 let knows_cfc_id = '';
 let knows_justgo_pw = '';
 let got_reset_email = '';
 $: show_create_justgo_id = (is_member === 'N');
 $: show_justgo_pw_reset_part1 = is_member === 'Y'
     && knows_cfc_id === 'Y' && knows_justgo_pw === 'N';
 $: show_justgo_pw_reset_part2 = is_member === 'Y'
     && knows_cfc_id === 'Y' && knows_justgo_pw === 'N'
     && got_reset_email === 'Y';
 $: show_justgo_signin = is_member === 'N'
     || (is_member === 'Y'
         && knows_cfc_id === 'Y'
         && (
             (knows_justgo_pw === 'N' && got_reset_email === 'Y')
             || knows_justgo_pw  === 'Y'
         )
     );
 $: show_buy_cfc = is_member === 'N'
     || (is_member === 'Y'
         && knows_cfc_id === 'Y'
         && (
             (knows_justgo_pw === 'N' && got_reset_email === 'Y')
             || knows_justgo_pw === 'Y'
         )
     );
 $: show_contact_cfc_find_id = is_member === 'Y'
     && knows_cfc_id === 'N';
 $: show_contact_cfc_add_email = is_member === 'Y'
     && knows_cfc_id === 'Y'
     && knows_justgo_pw === 'N'
     && got_reset_email === 'N';

 onMount(() => {
     const children = get_siblings(el_root, true);
     const frag_ids = [
         'intro', 'is-member', 'same-ids', 'create-justgo-id',
         'justgo-pw-reset-part1', 'justgo-pw-reset-part2',
         'justgo-signin', 'buy-cfc',
         'show-contact-cfc-find-id', 'show-contact-cfc-add-email'
     ];
     for (let frag_id of frag_ids) {
         const el_src = children.get('join-'+frag_id);
         const el_dest = document.getElementById(`join-${frag_id}-dest`);
         el_dest.prepend(el_src.content);
     }
 });
</script>

<style>
 select { background-color:#ffc; }
 .hide { display: none !important; }
</style>