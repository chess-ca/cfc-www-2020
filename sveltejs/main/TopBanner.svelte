<section id="ws-topbar" aria-label="Top Bar" class="container" bind:this={el_root}>
 <div class="level is-mobile">
  <div class="level-left">
   <a class="level-item" href="/{lang}/">
    <img src="/img/cfc.logo/cfc.logo.540x140.{lang}.png" class="is-hidden-mobile" style="min-height:100px;" alt="CFC Logo">
    <img src="/img/cfc.logo/cfc.logo.186x120.{lang}.png" class="is-hidden-tablet" style="min-height:100px;" alt="CFC Logo">
   </a>
  </div>
  <div class="level-right">
   <div class="level-item hide-if-print">
    <a class="button is-small is-primary is-rounded ws-bold" aria-label="switch language"
        href={other_lang()}>{lang==='fr' ? 'EN' : 'FR'}</a>
   </div>
   <div class="level-item is-hidden-tablet"
        on:click={toggleSideNav} on:keyup={a11y_click(toggleSideNav)}>
    <i class="fas fa-bars fa-border"></i>
   </div>
  </div>
 </div>

 <aside class:is-open={sideNavOpen} class="menu is-pulled-left is-overlay is-hidden-tablet"
     role="navigation" aria-label="main navigation"
     on:click={toggleSideNav} on:keyup={a11y_click(toggleSideNav)}>
  <ul class="menu-list">
   {#each menu_list as m}
    <li><a class="menu-item" href="{m.href}">{m.text}</a></li>
   {/each}
  </ul>
 </aside>

 <nav class="level is-hidden-mobile hide-if-print" aria-label="main navigation">
  <div class="level-left">
   {#each menu_list as m}
    <a class="level-item menu-item" href={m.href}>{m.text}</a>
   {/each}
  </div>
 </nav>
</section>

<script>
 import {onMount} from 'svelte';
 import {get_siblings, a11y_click} from '../_shared';

 export let lang = 'en';

 let sideNavOpen = false;
 let menu_list = [];
 let el_root;
 const el_overlay = document.getElementById('ws-overlay');

 function other_lang() {
     const url_from = window.location.pathname + window.location.search;
     const lang_from = url_from.slice(0,3);
     const lang_to = (lang_from==='/en') ? '/fr' : '/en';
     return lang_to + url_from.slice(3)
 }

 function toggleSideNav() {
     sideNavOpen = !sideNavOpen;
     el_overlay.classList.toggle('is-overlay');
 }

 onMount(() => {
     const children = get_siblings(el_root, true);
     for (const el of children.values()) {
         if (el.tagName && el.tagName.toLowerCase() === 'a') {
             menu_list.push({
                 href: el.href, text: el.innerText
             });
         }
     }
     menu_list = menu_list;   // so SvelteJS detects a change
     el_overlay.addEventListener('click', toggleSideNav);
 });
</script>