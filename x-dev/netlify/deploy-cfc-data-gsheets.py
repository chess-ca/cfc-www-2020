#!/usr/bin/env python3
# ======================================================================
# netlify/deploy-gsheets.py
#   - Get CFC Data from Google Sheets, convert to JavaScript,
#     and save all data in a single Javascript file for use by the Hugo build.
#   - CFC Data: Upcoming Events, News Flashes, Clubs, ...
#   - Sheets must be published. Click "File" > "Publish to the web" >
#     "Link" tab > select the data tab's name; select CSV; click "Publish".
#     Under "Publisch content and settings", ensure "Automatically republish
#     when changes are made" is checked.
# ======================================================================
import argparse, csv, io, re, json, pathlib
import urllib.request, datetime
from pathlib import Path

EVENTS_GSHEET = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR0OdgsCSYzlRBMOMkLFTHVuIcdXNSz7XQ3KWz4jtJr5fH4wHzDv1HRP3ytG4PwqxAXdTQLjOL0srAB/pub?gid=0&single=true&output=csv'
EVENTS_KEYS = ['//', 'type', 'name', 'start', 'end', 'city', 'prov', 'links']

NEWSFLASH_GSHEET = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT2D3ne_UlPK6d4ABWRGdwOb5vLuajOTCK-NNqurRWtcdY9s7F5b_o5hj72hir4GbCxVvtnkdXP-Jy8/pub?gid=0&single=true&output=csv'
NEWSFLASH_KEYS = ['//', 'start', 'end', 'highlight', 'en', 'fr']

CLUBS_GSHEET = ''
CLUBS_KEYS = []

CFC_DATA_FILENAME = 'cfc-data.js'
CFC_DATA_VARNAME = 'ws_cfc_data'

_yyyy_mm_dd = datetime.datetime.now().strftime('%Y-%m-%d')
_re_date = re.compile(r'\s*(\d{4})-([01]\d)-([0123]\d)\s*')
_re_markdown_link = re.compile(r'\[(.*?)]\((.*?)\)')
_months = {     # Maps month number to English & French abbreviation
    '01': ['Jan', 'janv'],  '02': ['Feb', 'févr'], '03': ['Mar', 'mars'],
    '04': ['Apr', 'avr'],   '05': ['May', 'mai'],  '06': ['June', 'juin'],
    '07': ['July', 'juil'], '08': ['Aug', 'aout'], '09': ['Sept', 'sept'],
    '10': ['Oct', 'oct'],   '11': ['Nov', 'nov'],  '12': ['Dec', 'déc'],
}


def main():
    out_dir = get_output_directory()
    cfc_data = {
        'events': get_events(),
        'newsflashes': get_news_flashes(),
        'clubs': get_clubs(),
    }
    write_javascript(cfc_data, out_dir)
    exit(0)

def get_output_directory():
    ap = argparse.ArgumentParser(
        description='CFC Data: get from Google Sheets and convert to Javascript.')
    ap.add_argument('-o', '--out', type=str, required=True,
        help='Output file that will contain the event data as Javascript code.')
    args = ap.parse_args()
    out_dir = Path(args.out)
    return out_dir


def get_events():
    print('Getting EVENTS data ...')
    events = get_from_google_sheets(EVENTS_GSHEET, EVENTS_KEYS)
    filtered = []
    for e in events:
        if e['//'] != '':
            continue    # It's a comment line!
        del e['//']     # Not used by the front-end
        if e['type'] == '' or e['name'] == '':
            continue    # Critical info missing
        if e['end'] < _yyyy_mm_dd:
            continue    # Event is in the past
        e['links'] = _markdown(e['links'])
        if '<a' not in e['links']:
            e['links'] = '<a href="{}">website</a>'.format(e['links'])

        # ---- Dates: convert to human readable English and French
        e['dates'] = _nice_dates(e['start'], e['end'])

        filtered.append(e)

    return sorted(filtered, key=lambda e: (e['start'], e['name']))


def get_news_flashes():
    print('Getting NEWS FLASH data ...')
    newsflashes = get_from_google_sheets(NEWSFLASH_GSHEET, NEWSFLASH_KEYS)
    filtered = []
    for nf in newsflashes:
        if nf['//'] != '':
            continue    # It's a comment line!
        del nf['//']    # Not used by the front-end
        if nf['end'] < _yyyy_mm_dd:
            continue    # News is in the past
        nf['highlight'] = str(nf['highlight'])[0:1].upper()
        nf['en'] = _markdown(nf['en'])
        nf['fr'] = _markdown(nf['fr'])

        filtered.append(nf)

    return sorted(filtered, key=lambda nf: (nf['start'], nf['end']), reverse=True)


def get_clubs():
    return []


def write_javascript(cfc_data, out_dir):
    js_file = out_dir / CFC_DATA_FILENAME
    js_file.parent.mkdir(parents=True, exist_ok=True)
    with open(js_file, 'w') as js_fp:
        js_fp.write('\twindow.{} = '.format(CFC_DATA_VARNAME))
        json.dump(cfc_data, js_fp, indent='\t')
        js_fp.write(';')
    print('... Javascript created: {}'.format(js_file))


def get_from_google_sheets(gsheets_url, keys):
    print('... from Google Sheet: {}'.format(gsheets_url))
    with urllib.request.urlopen(gsheets_url) as csv_fp:
        csv_bytes = csv_fp.read()
    print('Received {} bytes'.format(len(csv_bytes)))
    csv_str = csv_bytes.decode('utf8')

    csv_rdr = csv.DictReader(io.StringIO(csv_str))
    dict_list = []
    for row in csv_rdr:
        a_dict = { keys[i]: str(val).strip()
            for i, val in enumerate(row.values())
            if i < len(keys)
        }
        dict_list.append(a_dict)
    return dict_list


def _markdown(md_str):
    html = str(md_str).strip()
    for m in _re_markdown_link.finditer(html):
        html = html.replace(
            m.group(0),
            '<a href="{}">{}</a>'.format(m.group(2), m.group(1))
        )
    return html


def _nice_dates(start, end):
    # Converts dates to human readable English and French.
    # Note: English is "Month day"; French is "day month".
    s_m = _re_date.match(start)
    if s_m is None:
        return {'en': 'BAD: {}'.format(start)}
    e_m = _re_date.match(end)
    if e_m is None:
        return {'en': 'BAD: {}'.format(end)}
    s_mm, s_dd = s_m[2], s_m[3].lstrip('0')
    if s_mm not in _months.keys():
        return {'en': 'BAD: {}'.format(start)}
    e_mm, e_dd = e_m[2], e_m[3].lstrip('0')
    if e_mm not in _months.keys():
        return {'en': 'BAD: {}'.format(end)}

    dates = dict()
    if s_mm != e_mm:
        dates['en'] = '{} {}-{} {}'.format(_months[s_mm][0], s_dd, _months[e_mm][0], e_dd)
        dates['fr'] = '{} {}-{} {}'.format(s_dd, _months[s_mm][1], e_dd, _months[e_mm][1])
    elif s_dd != e_dd:
        dates['en'] = '{} {}-{}'.format(_months[s_mm][0], s_dd, e_dd)
        dates['fr'] = '{}-{} {}'.format(s_dd, e_dd, _months[s_mm][1])
    else:
        dates['en'] = '{} {}'.format(_months[s_mm][0], s_dd)
        dates['fr'] = '{} {}'.format(s_dd, _months[s_mm][1])
    return dates


main()
