// ---------------------------------------------------------------------
// cfc-photobox.js
// - Alpine plugin for "x-cfc-photobox" directive.
// - Display a list of photos (with caption text in en/fr)
//   and rotate thru the photos (with animation).
// - Animation by using GSAP from GreenSock.com.
// - @author Don Parakin, 2021
// ---------------------------------------------------------------------
import { get_attr, css_insert_once } from '../utils';
import { gsap } from 'gsap';

export default function (Alpine) {
    Alpine.directive('cfc-photobox', cfc_photobox);
}

const url_cfccdn = 'https://server.chess.ca/files';
const url_cloud = 'https://storage.googleapis.com/cfc-public';
const default_wait_time = '10';

function cfc_photobox(el, args, funcs) {
    const photo_list = funcs.evaluate(args.expression);

    css_insert_once('cfc-photobox', photobox_css);

    let page_lang = get_attr(el, 'lang', 'en');
    let wait_time = get_attr(el, 'wait', default_wait_time);
    wait_time = parseFloat(wait_time);

    let html = [];
    photo_list.forEach(p => {
        let text = page_lang === 'fr' ? p.fr : p.en;
        text = (text === '=' || text === '') ? p.en : text;
        html.push(`<li><img src="${p.photo_url}" alt="(photo)"><p>${text}</p></li>`)
    });
    html = html.join('\n');
    html = html.replaceAll('cfccdn:', url_cfccdn);
    html = html.replaceAll('cloud:', url_cloud);
    html = photobox_html.replace('[[photos]]', html);
    el.innerHTML = html;

    const el_ul = el.querySelector('ul');
    rotate_photos(el_ul, wait_time);
}

function rotate_photos(el_ul, wait_time) {
    const el_first = el_ul.children[0];
    const el_first_width = el_first.offsetWidth;

    const timeline = gsap.timeline({
        onComplete: rotate_photos,
        onCompleteParams: [el_ul, wait_time]
    });
    timeline.to(el_first, {
        delay: wait_time, duration: 0.5,
        x: - el_first_width, scale: 0.6, rotate: -10
    });
    timeline.to(el_ul.children, {
        duration: 0.5,
        x: - el_first_width
    });
    timeline.set(el_first, { display: 'none' });
    timeline.call((el_ul, el_first) => {
        el_ul.removeChild(el_first);
        el_ul.appendChild(el_first);
    }, [el_ul, el_first])
    timeline.set(el_ul.children, {
        x:0, scale:1, rotate:0,
        display:'inline-block'
    });
}

const photobox_html = `
 <div class="cfc-photobox">
  <ul>
   [[photos]]
  </ul>
 </div>`;

const photobox_css = `
    .cfc-photobox { overflow: hidden; }
    .cfc-photobox ul { margin:0; overflow-x:hidden; white-space:nowrap; }
    .cfc-photobox ul li { display:inline-block; padding-right:1rem; width: fit-content; }
    .cfc-photobox ul li img { height:300px; }
    .cfc-photobox ul li p { font-size:0.75rem; }
`;
