<div class="photo-box">
 <div style="--img-height: {img_height}">
  <ul bind:this={el_ul}
      on:mouseenter={() => {rotate_stop = true;}}
      on:mouseleave={() => {rotate_stop = false;}}>
  {#each photo_list as photo}
   <li>
    <img src={photo.photo_url} alt={photo.text}>
    <p>{@html photo.text}</p>
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

    export let lang = 'en';
    export let photos = 'ws_cfc_data.photobox_home'
    export let img_height = '300px';
    export let wait_ms = '8000';
    export let ease_ms = '500';

    const url_cfccdn = 'https://server.chess.ca/files';
    const url_cloud = 'https://storage.googleapis.com/cfc-public';

    let photo_list = get_photo_list(photos);
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

    function get_photo_list(img_list_variable) {
        //---- Get full list from the window.* variable
        const var_parts = String(img_list_variable).split('.');
        let img_list = window;
        for (let part of var_parts) {
            if (img_list !== undefined) {
                img_list = img_list[part]
            }
        }
        img_list = img_list || [];
        //---- Filter to remove photos not within start & end dates.
        const now_ymd = (new Date()).toISOString().slice(0,10);
        img_list = img_list.filter(photo => {
            return ((photo.start && now_ymd >= photo.start)
                && (photo.end && now_ymd <= photo.end));
        });
        //---- Map data to display formats (URLs, text)
        img_list = img_list.map(photo => {
            // Map URL suffixes to real values
            const url = photo['photo_url']
                .replaceAll('cfccdn:', url_cfccdn)
                .replaceAll('cloud:', url_cloud);
            // Set text for current language
            let text = lang === 'fr' ? photo.fr : photo.en;
            text = (text === '=' || text === '') ? photo.en : text;
            return {photo_url: url, text: text};
        });
        return img_list;
    }
</script>
