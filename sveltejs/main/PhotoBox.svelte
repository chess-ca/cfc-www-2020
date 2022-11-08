<div class="photo-box">
 <div style="--img-height: {img_height}">
  <ul bind:this={el_ul}
      on:mouseenter={() => {rotate_stop = true;}}
      on:mouseleave={() => {rotate_stop = false;}}>
  {#each photo_list as photo}
   <li>
    <img src={photo.photo_url} alt={photo.text}>
    <p>{@html photo.text}{@html (photo.text.indexOf('<br>') >= 0) ? '' : '<br>&nbsp;' }</p>
   </li>
  {/each}
  </ul>
 </div>
</div>

<style>
    .photo-box { overflow: hidden; }
    .photo-box div { margin:0; overflow-x:hidden; white-space:nowrap; }
    .photo-box div ul { margin:0; }
    .photo-box div ul li {
        display:inline-block; padding-right:1rem; width: fit-content;
    }
    .photo-box div ul li img { height:var(--img-height); }
    .photo-box div ul li p { font-size:0.75rem; }
</style>

<script>
    import { onMount } from 'svelte';
    import { get_data} from "../data_access";

    export let lang = 'en';
    export let img_height = '300px';
    export let wait_ms = '8000';
    export let ease_ms = '500';

    let photo_list = get_data.photobox_home(lang);
    let rotate_stop = false;
    let el_ul;
    let interval = null;

    //---- On mount, setup the photo rotation
    onMount(() => {
        el_ul.addEventListener("transitionend", photo_rotate_step2, true);
        interval = setInterval(photo_rotate_step1, wait_ms);
        return () => clearInterval(interval);
    });
    function photo_rotate_step1() {
        if (rotate_stop) return;
        const width = el_ul.querySelector('li').offsetWidth;
        el_ul.style.transition = `all ${ease_ms}ms ease-in-out`;
        el_ul.style.transform = `translateX(-${width}px)`;
    }
    function photo_rotate_step2() {
        el_ul.style.transition = '';
        el_ul.style.transform = '';
        photo_list.push(photo_list.shift());
        photo_list = photo_list;     // tells Svelte it changed.
    }
</script>
