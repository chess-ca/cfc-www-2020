<!--
    VueJS component: hide-or-show
    - Hide or show content.  Initially, for solutions to puzzles.
   @author Don Parakin, 2021
-->
<template>
  <div>
    <button @click="hidden = !hidden" class="button is-small">{{ hidden ? textShow : textHide }}</button>
    <div v-show="!hidden">
      <slot></slot>
    </div>
  </div>
</template>

<script>
const vue_props = {
  textHide: { type:String, default:"[Hide]" },
  textShow: { type:String, default:"[Show]" }
};

const vue_data = function() {
    return {
      hidden: true
    };
};

export default {
  props: vue_props,
  data: vue_data
}
</script>
