/**
 * @file VueJS component for <cfc-photobox> tag
 * @author Don Parakin, 2020
 */

const vue_tag = 'cfc-photobox';
const vue_props = {
    lang: { type:String, default:'en' }
};

const vue_template = `<div><slot></slot></div>`;

const vue_data = function() {
    return {
        isMenuOpen: false,
    };
};

const vue_computed = {
    otherLang: function() { return this.lang==='fr' ? 'en' : 'fr'; },
    otherLanguage: function() { return this.lang==='fr' ? 'English' : 'Français'; },
    langlang: function() { return this.lang==='fr' ? 'fr-en' : 'en-fr'; },
    insideListTags: function() {
        console.log("computed: this", this);
        // console.log("computed: this.$el", this.$el);
        //console.log("mounted: this.$el.innerHTML", this.$el.innerHTML);
        return "stuff";
            // this.$el.innerHTML
            // .replace('<a', '<li><a')
            // .replace('</a>', '</a></li>');
    }
};

function withinListTags() {
    console.log("withinListTags: this", this);
    return "stuff";
    return this.$el.innerHTML
        .replace('<a', '<li><a')
        .replace('</a>', '</a></li>');
}

function toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
}

/**
 * @function Add this VueJS component to Vue.
 */
export function add_component(Vue) {
    Vue.component(vue_tag, {
        created: function() { console.log('created() this=', this)},
        props: vue_props,
        data: vue_data,
        computed: vue_computed,
        beforeMount: function() { console.log("beforeMount() this=", this)},
        mounted: function() { console.log("mounted() this=", this)},
        beforeCreate: function() { console.log("beforeCreate() this=", this)},
        methods: {toggleMenu, withinListTags},
        template: vue_template
    });
}
