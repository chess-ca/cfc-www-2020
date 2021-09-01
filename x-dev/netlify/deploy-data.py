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

ROOT_DIR = Path(__file__).parents[2]
CFC_DATA_DEST = ROOT_DIR / 'hugo/assets/ext/cfc-data.js'
CFC_DATA_VARNAME = 'ws_cfc_data'

EVENTS_GSHEET = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR0OdgsCSYzlRBMOMkLFTHVuIcdXNSz7XQ3KWz4jtJr5fH4wHzDv1HRP3ytG4PwqxAXdTQLjOL0srAB/pub?gid=0&single=true&output=csv'
EVENTS_KEYS = ['//', 'type', 'name', 'start', 'end', 'city', 'prov', 'links']

NEWSFLASH_GSHEET = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT2D3ne_UlPK6d4ABWRGdwOb5vLuajOTCK-NNqurRWtcdY9s7F5b_o5hj72hir4GbCxVvtnkdXP-Jy8/pub?gid=0&single=true&output=csv'
NEWSFLASH_KEYS = ['//', 'start', 'end', 'highlight', 'en', 'fr']

PHOTOBOX_HOME_GSHEET = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT3ezBYFPIBc0K5CHdHWii2F1XCRScwa4f7BFTmYb7EcJPkDCmwno6URVYkGbXeKCmLA3komvyCuaYN/pub?gid=0&single=true&output=csv'
PHOTOBOX_HOME_KEYS = ['//', 'start', 'end', 'photo_url', 'en', 'fr']

CLUBS_GSHEET = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRUP8-HdBWnut3GY4ua3zTJk66BWumnPpIjEELWQ_IE73mDRCa6w0x_nmAAOodaIoz-sREE2UKuH16G/pub?gid=0&single=true&output=csv'
CLUBS_KEYS = ['//', 'club', 'city', 'prov', 'last_review', 'review', 'links']
CLUBS_DEST = ROOT_DIR / 'content/clubs/list/clubs.csv'


_yyyy_mm_dd = datetime.datetime.now().strftime('%Y-%m-%d')
_re_date = re.compile(r'\s*(\d{4})-([01]\d)-([0123]\d)\s*')
_re_markdown_link = re.compile(r'\[(.*?)]\((.*?)\)')
_re_first_url = re.compile(r'href=\"(.*?)\"')
_months = {     # Maps month number to English & French abbreviation
    '01': ['Jan', 'janv'],  '02': ['Feb', 'févr'], '03': ['Mar', 'mars'],
    '04': ['Apr', 'avr'],   '05': ['May', 'mai'],  '06': ['June', 'juin'],
    '07': ['July', 'juil'], '08': ['Aug', 'aout'], '09': ['Sept', 'sept'],
    '10': ['Oct', 'oct'],   '11': ['Nov', 'nov'],  '12': ['Dec', 'déc'],
}
_provs = {
    'CANADA': 'Canada',
    'AB': 'Alberta', 'BC': 'British Columbia', 'MB': 'Manitoba', 'NB': 'New Brunswick',
    'NL': 'Newfoundland', 'NS': 'Nova Scotia', 'NT': 'North West Territories',
    'NU': 'Nunavut', 'ON': 'Ontario', 'PE': 'Prince Edward Island', 'QC': 'Quebec',
    'SK': 'Saskatchewan', 'YT': 'Yukon',
}


def main():
    cfc_data = {
        'newsflashes': get_news_flashes(),
        'photobox_home': get_photobox_home(),
        'events': get_events(),
    }
    write_javascript(cfc_data, CFC_DATA_DEST)
    clubs_data = get_clubs()
    write_csv(clubs_data, CLUBS_DEST)
    exit(0)


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
        if e['links'].startswith('http'):
            e['links'] = '<a href="{}">website</a>'.format(e['links'])
        elif e['links'] != '':
            e['links'] = _markdown(e['links'])
        match = _re_first_url.search(e['links'])
        e['url'] = match.group(1) if match else ''

        # ---- Dates: convert to human readable English and French
        e['dates'] = _nice_dates(e['start'], e['end'])

        filtered.append(e)

    filtered = sorted(filtered, key=lambda e: (e['start'], e['name']))
    for i in range(len(filtered)):
        filtered[i]['oid'] = i + 1      # A unique object id for Javascript
    return filtered


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

    # Now using the order within the gsheet. Was too confusing ordered by start/end in reverse.
    # filtered = sorted(filtered, key=lambda nf: (nf['start'], nf['end']), reverse=True)
    for i in range(len(filtered)):
        filtered[i]['oid'] = i + 1      # A unique object id for Javascript
    return filtered


def get_photobox_home():
    print('Getting PHOTOBOX HOME data ...')
    photos = get_from_google_sheets(PHOTOBOX_HOME_GSHEET, PHOTOBOX_HOME_KEYS)
    filtered = []
    for p in photos:
        if p['//'] != '':
            continue    # It's a comment line!
        del p['//']     # Not used by the front-end
        if p['end'] < _yyyy_mm_dd:
            continue    # Photo is in the past
        p['en'] = _markdown(p['en'])
        p['fr'] = _markdown(p['fr'])

        filtered.append(p)

    for i in range(len(filtered)):
        filtered[i]['oid'] = i + 1      # A unique object id for Javascript
    return filtered


def write_javascript(cfc_data, js_file):
    js = ['\nwindow.{} = '.format(CFC_DATA_VARNAME)]
    js.append(json.dumps(cfc_data, indent='\t'))
    js.append(';\n')

    js_file.parent.mkdir(parents=True, exist_ok=True)
    with open(str(js_file), 'wt', encoding='utf-8') as js_fp:
        js_fp.write(''.join(js))
    print('... Javascript created: {}'.format(js_file))


def get_clubs():
    print('Getting CLUBS data ...')
    clubs_gsheet = get_from_google_sheets(CLUBS_GSHEET, CLUBS_KEYS)
    clubs = []
    for c in clubs_gsheet:
        if c['//'] != '':
            continue    # It's a comment line!
        c['prov'] = c['prov'].strip().upper()
        location = '' if c['prov'] == 'CANADA' \
            else c['prov'] if c['city'] == '' \
            else '{}, {}'.format(c['city'], c['prov'])
        if c['links'].lower().startswith('http'):
            c['links'] = '[web]({})'.format(c['links'])
        clubs.append([c['prov'], location, c['club'], c['links']])

    clubs = sorted(clubs, key=lambda c: ('AA' if c[0]=='CANADA' else c[0], c[1]))
    sectioned = []
    previous_section = None
    for c in clubs:
        if c[0] != previous_section:
            sectioned.append(['--section--', _provs.get(c[0], c[0]), ''])
            previous_section = c[0]
        sectioned.append(c[1:])     # drop c[0]; only needed for sorting
    return sectioned


def write_csv(csv_data, csv_file):
    with open(str(csv_file), 'wt', encoding='utf-8') as csv_fp:
        for row in csv_data:
            cols = [c.replace('"', '""') for c in row]
            out = '"{}"\n'.format('","'.join(cols))
            csv_fp.write(out)
    print('... CSV created: {}'.format(csv_file))


def get_from_google_sheets(gsheets_url, keys):
    print('... from Google Sheet: {}'.format(gsheets_url))
    urllib.request.urlcleanup()     # Don't use cached gsheets
    with urllib.request.urlopen(gsheets_url) as csv_fp:
        csv_bytes = csv_fp.read()
    print('... Received {} bytes'.format(len(csv_bytes)))
    csv_str = csv_bytes.decode('utf8')

    csv_rdr = csv.reader(io.StringIO(csv_str))
    dict_list = []
    for row in csv_rdr:
        a_dict = { keys[i]: str(val).strip()
            for i, val in enumerate(row)
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
    # ---- If text is specified in the start date:
    parts = start.split(':')
    if len(parts) > 1:
        return {
            'en': parts[1],
            'fr': parts[2] if len(parts) > 2 else parts[1]
        }

    # ---- Date is yyyy-mm-dd; convert to human readable en & fr.
    # Note: English is "Month day"; French is "day month".
    s_m = _re_date.match(start)
    if s_m is None:
        return {'en': 'BAD: {}'.format(start)}
    e_m = _re_date.match(end)
    if e_m is None:
        return {'en': 'BAD: {}'.format(end)}
    s_mm, s_dd = s_m.group(2), s_m.group(3).lstrip('0')
    if s_mm not in _months.keys():
        return {'en': 'BAD: {}'.format(start)}
    e_mm, e_dd = e_m.group(2), e_m.group(3).lstrip('0')
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
