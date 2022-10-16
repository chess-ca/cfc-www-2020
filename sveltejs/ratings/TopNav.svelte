
<nav class="container content pad-touch-only mb-2" on:click={goto_handler} on:keyup={a11y_click(goto_handler)}>
 <div role="navigation" class="hide-if-print">
  <button aria-label="Page Back" class="button is-info is-small" data-goto={'<<<'}><i class="fas fa-arrow-left"></i></button>
  <button aria-label="Page Forward" class="button is-info is-small" data-goto={'>>>'}><i class="fas fa-arrow-right"></i></button>
  <button aria-label="Search" class="button is-info is-small" data-goto={'/[[lang]]/ratings/'}><i class="fas fa-search"></i></button>
  <div class="is-pulled-right">Data: {updated}</div>
 </div>
</nav>

<script>
 export let updated = '';

 import {goto_handler, a11y_click} from '../_shared';
</script>