<template>
  <h3>Hello-zzzzowie-zonga from {{name}} (speaking {{lang}})</h3>
</template>

<script>
  function data() { return {
      lang: 'en',
      name: 'CFC'
  }; }

  function created() {
      let el_html = document.getElementsByTagName('html');
      this.lang = el_html[0].getAttribute('lang') || 'en';
  }

  export default { data, created };
</script>