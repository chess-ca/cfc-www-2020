// ---------------------------------------------------------------------
// cfc-game-chess-com.js
// - Alpine plugin for "x-cfc-game-chess-com" directive.
// - PGN player for chess.com
// - chess.com requires some JS after the iframe is mounted.
//   Previously, when this was added inline, VueJS complained
//   since it doesn't like <scripts> within the vue-app.
//   By putting all this in a Vue component, everyone is happy.
// - @author Don Parakin, 2021
// ---------------------------------------------------------------------
import { get_attr } from '../utils';

function cfc_game_chess_com(el) {
    let game_id = get_attr(el, 'game-id', '6922798')

    let html = game_html.replaceAll('[GAME_ID]', game_id);
    console.log('cfc_game_chess_com: updated html with ', game_id);
    el.innerHTML = html;

    // Code from chess.com: must run after the <iframe> is mounted.
    window.addEventListener(
        "message",
        e=>{
            e['data']&&game_id===e['data']['id']&&document.getElementById(`${e['data']['id']}`)&&(document.getElementById(`${e['data']['id']}`).style.height=`${e['data']['frameHeight']+30}px`)
        }
    );
}

export default function (Alpine) {
    window.ws_globals = window.ws_globals || {};
    window.ws_globals.cfc_spinner = {
        style_appended: false
    };

    Alpine.directive('cfc-game-chess-com', cfc_game_chess_com);
}


const game_html = `<span>GAME=[GAME_ID]</span>
    <iframe id="game-[GAME_ID]"
        class="chess-com-game" allowtransparency="true" frameborder="0"
        style="width:100%;border:none;"
        src="//www.chess.com/emboard?id=[GAME_ID]">
    </iframe>
`;
