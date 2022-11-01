{#if flash_list && (flash_list.length > 0)}
 <div class="news-flashes">
  {#each flash_list as flash}
   <div class="flash highlight-{flash.highlight}">{@html flash.text}</div>
  {/each}
 </div>
{/if}

<script>
    import {get_global} from "../_shared";

    export let lang = 'en';
    export let flashes = 'newsflashes';

    const flash_list = get_flash_list(flashes);

    function get_flash_list(flash_list_variable) {
        let flash_list = get_global(flash_list_variable) || [];
        //---- Filter to remove flashes if today is not within start & end dates.
        const today = (new Date()).toISOString().slice(0,10);
        flash_list = flash_list.filter(flash => {
            return ((flash.start && today >= flash.start)
                && (flash.end && today <= flash.end));
        });

        //---- Map data to display formats (text for lang)
        flash_list = flash_list.map(flash => {
            // Set text for current language
            let text = lang === 'fr' ? flash.fr : flash.en;
            text = (text === '=' || text === '') ? flash.en : text;
            const highlight = String(flash.highlight || '').toLowerCase()
            return {text: text, highlight: highlight};
        });

        return flash_list;
    }
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
