#!/usr/bin/env python3
# ======================================================================
# netlify/events-build.py
#   - Get Upcoming Events from a Google Sheet, convert to JavaScript,
#     and save in a file for use by the Hugo build.
# ======================================================================
import argparse, csv, io, re, json, pathlib
import urllib.request, datetime

GSHEETS_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR0OdgsCSYzlRBMOMkLFTHVuIcdXNSz7XQ3KWz4jtJr5fH4wHzDv1HRP3ytG4PwqxAXdTQLjOL0srAB/pub?gid=0&single=true&output=csv'


def main():
    args = parse_args()
    events_csv = get_csv_from_google_sheets(GSHEETS_URL)
    events_py = convert_csv_to_python(events_csv)
    write_javascript_file(events_py, args.out)
    exit(0)


def parse_args():
    ap = argparse.ArgumentParser(
        description='CFC Upcoming Events: get from Google Sheets and convert to Javascript.')
    ap.add_argument('-o', '--out', type=str, required=True,
        help='Output file that will contain the event data as Javascript code.')
    return ap.parse_args()


def get_csv_from_google_sheets(gsheets_url):
    print('Requesting CSV data from Google Sheets ...\nURL: {}'.format(gsheets_url))
    with urllib.request.urlopen(gsheets_url) as csv_fp:
        csv_bytes = csv_fp.read()
    print('Received {} bytes'.format(len(csv_bytes)))
    csv_str = csv_bytes.decode('utf8')
    return csv_str


def convert_csv_to_python(csv_str):
    # Pattern (Markdown links) example:  "...[Google](https://google.com)..."
    link_re = re.compile(r'\[(.*?)]\((.*?)\)')
    yyyymmdd = datetime.datetime.now().strftime('%Y-%m-%d')

    csv_rdr = csv.DictReader(io.StringIO(csv_str))
    fn = csv_rdr.fieldnames
    events = []
    for row in csv_rdr:
        # ---- Event's basic values
        event = dict(
            incl=str(row[fn[0]]).strip(),
            type=str(row[fn[1]]).strip(),
            name=str(row[fn[2]]).strip(),
            start=str(row[fn[3]]).strip(),
            end=str(row[fn[4]]).strip(),
            city=str(row[fn[5]]).strip(),
            prov=str(row[fn[6]]).strip(),
        )
        if event['incl'] != '':         # It's a comment line!
            continue
        del event['incl']               # not used by front-end
        if event['type'] == '' or event['name'] == '':
            continue
        if event['end'] < yyyymmdd:
            continue

        # ---- Event's link(s): can be a simple URL or markdown
        event['url'] = ''
        links = str(row[fn[7]]).strip()
        if links == '':         # no link
            pass
        elif '[' not in links:  # no markdown syntax; just a plan URL.
            event['url'] = links
            links = '<a href="{}">website</a>'.format(links)
        else:                   # markdown syntax found
            for i, m in enumerate(link_re.finditer(links)):
                if i == 0:
                    event['url'] = m.group(2)
                links = links.replace(m.group(0), '<a href="{}">{}</a>'.format(m.group(2), m.group(1)))
        event['links'] = links

        # ---- Dates: convert to human readable English and French
        event['dates'] = nice_dates(event['start'], event['end'])

        events.append(event)

    events = sorted(events, key=lambda e: (e['start'], e['name']))
    return events


def write_javascript_file(events, js_file):
    pathlib.Path(js_file).parent.mkdir(parents=True, exist_ok=True)
    with open(js_file, 'w') as js_fp:
        js_fp.write('\twindow.ws_cfc_events = ')
        json.dump(events, js_fp, indent=None)
        js_fp.write(';')
    print('{} events saved in: {}'.format(len(events), js_file))


_months = {     # Maps month number to English & French abbreviation
    '01': ['Jan', 'janv'],  '02': ['Feb', 'févr'], '03': ['Mar', 'mars'],
    '04': ['Apr', 'avr'],   '05': ['May', 'mai'],  '06': ['June', 'juin'],
    '07': ['July', 'juil'], '08': ['Aug', 'aout'], '09': ['Sept', 'sept'],
    '10': ['Oct', 'oct'],   '11': ['Nov', 'nov'],  '12': ['Dec', 'déc'],
}


def nice_dates(start, end):
    # Converts dates to human readable English and French.
    # Note: English is "Month day"; French is "day month".
    mm1 = start[5:7]
    dd1 = start[8:10].lstrip('0')
    mm2 = end[5:7]
    dd2 = end[8:10].lstrip('0')

    dates = dict()
    if mm1 != mm2:
        dates['en'] = '{} {}-{} {}'.format(_months[mm1][0], dd1, _months[mm2][0], dd2)
        dates['fr'] = '{} {}-{} {}'.format(dd1, _months[mm1][1], dd2, _months[mm2][1])
    elif dd1 != dd2:
        dates['en'] = '{} {}-{}'.format(_months[mm1][0], dd1, dd2)
        dates['fr'] = '{}-{} {}'.format(dd1, dd2, _months[mm1][1])
    else:
        dates['en'] = '{} {}'.format(_months[mm1][0], dd1)
        dates['fr'] = '{} {}'.format(dd1, _months[mm1][1])
    return dates


main()
