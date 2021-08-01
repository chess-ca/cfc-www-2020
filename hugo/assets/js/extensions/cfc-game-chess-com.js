// ---------------------------------------------------------------------
// cfc-game-chess-com.js
// - Alpine plugin for "x-cfc-game-chess-com" directive.
// - PGN player for chess.com
// - chess.com requires some JS after the iframe is mounted.
// - @author Don Parakin, 2021
// ---------------------------------------------------------------------
import { get_attr } from '../utils';

export default function (Alpine) {
    Alpine.directive('cfc-game-chess-com', cfc_game_chess_com);
}

function cfc_game_chess_com(el) {
    let game_id = get_attr(el, 'game', '6922798')

    let html = game_html.replaceAll('[[GAME_ID]]', game_id);
    el.innerHTML = html;

    // Code from chess.com: must run after the <iframe> is mounted.
    window.addEventListener(
        "message",
        e=>{
            e['data']&&game_id===e['data']['id']&&document.getElementById(`${e['data']['id']}`)&&(document.getElementById(`${e['data']['id']}`).style.height=`${e['data']['frameHeight']+30}px`)
        }
    );
}

const game_html = `
    <iframe id="[[GAME_ID]]"
        class="chess-com-game" allowtransparency="true" frameborder="0"
        style="width:100%;border:none;"
        src="//www.chess.com/emboard?id=[[GAME_ID]]">
    </iframe>
`;
