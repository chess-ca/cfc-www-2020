/**
 * @file VueJS component: chess.com game
 * @author Don Parakin, 2020
 */

const vue_tag = 'ws-chess-com-game';
const vue_props = {
    game_id: { type:String }
};

const vue_template = `<iframe :id="game_id"
  class="chess-com-game" allowtransparency="true" frameborder="0"
  style="width:100%;border:none;"
  :src="'//www.chess.com/emboard?id='+game_id"></iframe>`;

const vue_data = function() {
    return { };
};
const vue_mounted = function() {
    // Code from chess.com:
    window.addEventListener("message",e=>{e['data']&&this.game_id===e['data']['id']&&document.getElementById(`${e['data']['id']}`)&&(document.getElementById(`${e['data']['id']}`).style.height=`${e['data']['frameHeight']+30}px`)});
};

/**
 * @function Add this VueJS component to Vue.
 */
export function add_component(Vue) {
    Vue.component(vue_tag, {
        props: vue_props,
        data: vue_data,
        mounted: vue_mounted,
        template: vue_template
    });
}
