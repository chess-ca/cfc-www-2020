// ---------------------------------------------------------------------
// cfc-newsflashes.js
// - Alpine plugin for "x-cfc-newsflashes" directive.
// - Display a list of news flashes. Intended for the
//   home page to show important timely news
// - Animation by using GSAP from GreenSock.com.
// - @author Don Parakin, 2021
// ---------------------------------------------------------------------
import { get_attr, css_insert_once } from '../utils';
import { gsap } from 'gsap';

export default function (Alpine) {
    Alpine.directive('cfc-newsflashes', cfc_newsflashes);
}

function cfc_newsflashes(el, args, funcs) {
    const news_list = funcs.evaluate(args.expression);
    let page_lang = get_attr(el, 'lang', 'en');

    if (news_list.length < 1) return;
    css_insert_once('cfc-newsflashes', newsflash_css);

    let html = [];
    news_list.forEach(nf => {
        let text = page_lang === 'fr' ? nf.fr : nf.en;
        if (text==='=' || text==='') text = nf.en;
        let highlight = String(nf.highlight || '').toLowerCase();
        html.push(`<div class="flash highlight-${highlight}">${text}</div>`)
    });
    html = html.join('\n');
    html = newsflash_html.replace('[[newsflashes]]', html);
    el.innerHTML = html;

    const el_flashs = el.querySelectorAll('.flash');
    gsap.from(el_flashs, {delay:1, duration:1, x:-75, ease:'elastic'});
}

const newsflash_html = `
 <div class="cfc-newsflashes">
  [[newsflashes]]
 </div>
`;

const newsflash_css = `
    .cfc-newsflashes { margin-bottom:1rem; }
    .cfc-newsflashes div {
        font-size:0.8rem; 
        border:1px solid #bbb; border-radius:6px;
        padding:4px 0.5rem; margin-bottom:0.25rem;
    }
    .cfc-newsflashes div.highlight-g { background-color:#D6F5B8; }
    .cfc-newsflashes div.highlight-y { background-color:#FFFFCC; }
    .cfc-newsflashes div.highlight-o { background-color:#FFF8E0; }
    .cfc-newsflashes div.highlight-r { background-color:#FFDDDD; }
`;
