+++
title = "CFC Membership - How"
layout = "ws-single"
pageid = "pg-membership-how"
tableofcontents = false
+++

Answer the following questions ...

<div class="select">
<select v-model="mbr.is_member">
  <option value="">CFC member?</option>
  <option value="N">I have never been a CFC member</option>
  <option value="G">I have a GoMembership id &amp; password</option>
  <option value="Y">I am a CFC member</option>
  <option value="Y">I was a CFC member in the past</option>
</select>
</div>

<div v-show="mbr.is_member=='Y'" class="mt-3">
  <div class="select">
    <select v-model="mbr.knows_cfc_id">
      <option value="">CFC membership number?</option>
      <option value="Y">I know my CFC membership number</option>
      <option value="N">I do not know my CFC membership number</option>
    </select>
  </div>
  <div v-show="mbr.knows_cfc_id=='Y'" class="mt-3">
    <div v-show="mbr.got_reset_email==''" class="mb-3">
      <p>(Step 1 of 2: request a password reset)</p>
    </div>
    <div class="select">
      <select v-model="mbr.got_reset_email">
        <option value="">Q: Did you receive a reset email?</option>
        <option value="Y">I did receive a reset email</option>
        <option value="N">I did not receive a reset email</option>
      </select>
    </div>
    <div v-show="mbr.got_reset_email=='Y'" class="mt-3">
      <p>(Step 2 of 2: complete resetting your password)</p>
    </div>
    <div v-show="mbr.got_reset_email=='N'" class="mt-3">
      <p>(Contact CFC to set your email for your CFC#)</p>
    </div>
  </div>
</div>

<div v-show="show_create_gm_id" class="mt-3">

## Create a GoMembership id
This is how to create a new GM id and pw ...
</div>

<div v-show="show_gm_pw_reset" class="mt-3">

## Reset Your GoMembership Password
This is how to reset your GM pw ...
</div>

<div v-show="show_gm_signin" class="mt-3">

## Sign-in to GoMembership
This is how to sign-in to GM ...
<br><a class="button is-info" href="https://cfc.azolve.com/" target="_blank">Go to GoMembership</a>
</div>

<div v-show="show_buy_cfc" class="mt-3">

## Buy a CFC Membership
This is how to buy a CFC membership ...
</div>

<div v-show="show_contact_cfc_find_id" class="mt-3">

## Contact the CFC
Contact the CFC to find your old CFC member id.
<br><a class="button is-info" href="https://forms.gle/miag39Q6tutM7pmc7" target="_blank">Contact the CFC</a>
</div>

<div v-show="show_contact_cfc_add_email" class="mt-3">

## Contact the CFC
Contact the CFC to add your email to your GoMembership id.
<br><a class="button is-info" href="https://forms.gle/miag39Q6tutM7pmc7" target="_blank">Contact the CFC</a>
</div>
