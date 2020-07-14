/**
 * @file VueJS component for <cfc-comments> tag
 * Adds a bordered container for reader comments.
 *  - If "hackernews-url" prop given, show "Go To Hacker News" button.
 *  - Else show "Show Disqus" button. Click will load Disqus comments.
 *    This way pages load fast without tracking for those users
 *    who do not want to see the comments.
 * @author Don Parakin
 */
import Vue from 'vue';

const vue_tag = 'cfc-comments';
const vue_props = {
    disqusPageUrl: String,      // a Disqus parameter
    disqusPageId: String,      // a Disqus parameter
    hackernews: String,      // URL of comments on Hacker News (if any)
};

const vue_template = `   
<fieldset class="bnc-section">
 <legend>comments</legend>
 <div id="disqus_thread"></div>
 <a v-if="hackernews" class="button is-primary is-small" :href="hackernews" style="margin:.4rem 1rem;">Go To Hacker News</a>
 <button v-else-if="showButton" class="button is-primary is-small" @click="onShowComments" style="margin:.4rem 1rem;">Show Disqus</button>
</fieldset>`;

const vue_data = () => {
    return {
        showButton: true,
    };
};

function onShowComments() {
    let vm_disqusPageUrl = this.disqusPageUrl;
    let vm_disqusPageId = this.disqusPageId;
    let isLocalhost = window.location.hostname==='localhost';

    if (isLocalhost) {
        alert('Disqus is disabled for localhost (dev).');
        return;
    }
    this.showButton = false;
    //---- Disqus <script> will use window.disqus_config & update <div id="disqus_thread">
    window.disqus_config = function () {
        if (vm_disqusPageUrl) {
            this.page.url = vm_disqusPageUrl;
        }
        this.page.identifier = vm_disqusPageId;
    };
    var d = document, s = d.createElement('script');
    s.src = 'https://barenakedcoder.disqus.com/embed.js';
    s.setAttribute('data-timestamp', +new Date());
    (d.head || d.body).appendChild(s);
}

/**
 * @function Add this VueJS component to Vue.
 */
export function add_component() {
    Vue.component(vue_tag, {
        props: vue_props,
        data: vue_data,
        methods: {onShowComments},
        template: vue_template
    });
}
