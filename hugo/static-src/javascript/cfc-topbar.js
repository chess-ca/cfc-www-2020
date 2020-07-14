/**
 * @file VueJS component for <cfc-topbar> tag
 * Adds the top banner of web pages, including top navigation.
 *  - Based on Bulma navbar menus.
 * @author Don Parakin, 2020
 */

const vue_tag = 'cfc-topbar';
const vue_props = {
    lang: { type:String, default:'en' }
};

const vue_template = `<div><slot></slot></div>`;

const v22ue_template = `
 <section id="ws-topbar" class="container">
  <aside class="menu is-pulled-left is-overlay">
   <ul class="menu-list">
{{ insideListTags }}    
   </ul>
  </aside>
  <div class="is-pulled-right">
   <div class="is-hidden-tablet"><i class="fas fa-bars fa-border"></i></div>
   <a class="button is-small is-outline is-primary" >{{ otherLang }}</a>
  </div>
  <a class="" :href="'/'+lang+'/'">
   <img :src="'/img/cfc.logo/cfc.logo.433x100.'+langlang+'.png'" class="is-hidden-mobile" style="min-height:100px;">
   <img :src="'/img/cfc.logo/cfc.logo.177x100.'+langlang+'.png'" class="is-hidden-tablet" style="min-height:100px;">
  </a>
  <nav class="level" role="navigation" aria-label="main navigation">
   <div class="level-left">
    <slot></slot>
    <a class="menu-item" href="/fr/">Français</a>
   </div>
  </nav>
 </section>
`;

const v1ue_template = `
 <section id="ws-topbar" class="container">
  <aside class="menu is-pulled-left is-overlay" style="width:120px; xxmargin-left:-132px;">
   <ul class="menu-list" style="text-align:right;">
    <li><a class="menu-item" href="/en/">Home</a></li>
    <li><a class="menu-item active" href="/en/players/">Players</a></li>
    <li><a class="menu-item" href="/en/organizers/">Organizers</a></li>
    <li><a class="menu-item" href="/en/elite/">Elite</a></li>
    <li><a class="menu-item" href="/en/cfc/">CFC</a></li>
    <li><a class="menu-item" href="/en/news/">News</a></li>
   </ul>
  </aside>
  <div class="is-pulled-right">
   <div class="is-hidden-tablet"><i class="fas fa-bars fa-border"></div>
   <a class="button is-small is-outline is-primary" >{{ otherLanguage.toUpperCase() }}</a>
  </div>
  <a class="navbar-item" :href="'/'+lang+'/'">
   <img :src="'/img/cfc.logo/cfc.logo.433x100.'+langlang+'.png'" class="is-hidden-mobile" style="min-height:100px;">
   <img :src="'/img/cfc.logo/cfc.logo.177x100.'+langlang+'.png'" class="is-hidden-tablet" style="min-height:100px;">
  </a>
  <!--nav class="level" role="navigation" aria-label="main navigation">
   <div class="level-left">
    <slot></slot>
   </div>
  </nav-->
 </section>
`;
const v0ue_template = `   
 <section id="ws-topbar">
  <nav class="navbar container" role="navigation" aria-label="main navigation">

   <div class="navbar-brand">
    <a class="navbar-item" :href="'/'+lang+'/'">
     <img :src="'/img/cfc.logo/cfc.logo.433x100.'+langlang+'.png'" width="433" height="100">
    </a>
    <a role="button" class="navbar-burger burger {is_active}"
        aria-label="menu" aria-expanded="false" href="#toggle"
        @click.prevent="toggleMenu">
     <span aria-hidden="true"></span>
     <span aria-hidden="true"></span>
     <span aria-hidden="true"></span>
    </a>
   </div>

   <div class="navbar-menu pad-touch-only" v-bind:class="{'is-active':isMenuOpen}" id="navbarBasicExample">
    <div class="navbar-end">
     <slot></slot>
    </div>
   </div>
  </nav>
 </section>
`;

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
