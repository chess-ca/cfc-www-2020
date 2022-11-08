{#if flash_list && (flash_list.length > 0)}
 <div class="news-flashes">
  {#each flash_list as flash}
   <div class="flash highlight-{flash.highlight}">{@html flash.text}</div>
  {/each}
 </div>
{/if}

<script>
    import {get_data} from "../data_access";

    export let lang = 'en';

    const flash_list = get_data.newsflashes(lang);
</script>

<style>
    .news-flashes { margin-bottom:1rem; }
    .news-flashes div {
        font-size:0.8rem;
        border:1px solid #bbb; border-radius:6px;
        padding:2px 0.5rem; margin-bottom:0.2rem;
    }
    .news-flashes div.highlight-g { background-color:#D6F5B8; }
    .news-flashes div.highlight-y { background-color:#FFFFCC; }
    .news-flashes div.highlight-o { background-color:#FFF8E0; }
    .news-flashes div.highlight-r { background-color:#FFDDDD; }
</style>
