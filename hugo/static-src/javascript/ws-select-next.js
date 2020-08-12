/**
 * @file VueJS component for <ws-photobox> tag
 * @author Don Parakin, 2020
 */
const vue_tag = 'ws-select-next';
const vue_props = {
    selected: { type:String },
    urls: { type:Array }
};

const vue_template = `
  <div class="field is-grouped is-grouped-multiline">
   <div class="control">
    <div class="select is-medium is-primary">
     <select v-model="url_selected" @change="goto_next" class="is-focused">
      <option v-for="u in url_list" :value="u.url" :selected="u.url === selected">{{u.text}}</option>
     </select>
    </div>
   </div>
  </div>
`;

const vue_data = function() {
    return {
        url_list: [],
        url_selected: ''
    };
};

const vue_beforeMount = function() {
    this.url_selected = this.selected;
    for (let i=0; i<this.urls.length; i++) {
        let u = this.urls[i];
        console.log('beforeMount:', 'u:', u);
        u.key = i;
        u.url = u.url || "/";
        u.text = u.text.replace(/%20/g, ' ') || "?";
        this.url_list.push(u);
    }
};

function goto_next() {
    window.location.href = this.url_selected;
}

/**
 * @function Add this VueJS component to Vue.
 */
export function add_component(Vue) {
    Vue.component(vue_tag, {
        props: vue_props,
        data: vue_data,
        methods: { goto_next:goto_next },
        beforeMount: vue_beforeMount,
        template: vue_template
    });
}
