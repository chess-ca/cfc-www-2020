#!/usr/bin/env python3

GSHEETS_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR0OdgsCSYzlRBMOMkLFTHVuIcdXNSz7XQ3KWz4jtJr5fH4wHzDv1HRP3ytG4PwqxAXdTQLjOL0srAB/pub?gid=0&single=true&output=csv'

import urllib.request
import argparse, csv, io, re, json, pathlib
from datetime import datetime

_mm2mmm = {
    '01':'Jan', '02':'Feb', '03':'Mar', '04':'Apr', '05':'May', '06':'June',
    '07':'July', '08':'Aug', '09':'Sept', '10':'Oct', '11':'Nov', '12':'Dec',
}


def main():
    args = parse_args()
    csv_str = get_csv_file_from_google_sheets(GSHEETS_URL)
    csv_py = convert_csv_file_to_python(csv_str)
    create_javascript_file(csv_py, args.out)
    exit(0)


def parse_args():
    ap = argparse.ArgumentParser(
        description='CFC Event Data: get from Google Sheets and convert to Javascript.')
    ap.add_argument('-o', '--out', type=str, required=True,
        help='Output file that will contain the event data as Javascript code.')
    return ap.parse_args()


def get_csv_file_from_google_sheets(gsheets_url):
    print('Requesting CSV data from Google Sheets ...\n\tURL: {}'.format(gsheets_url))
    with urllib.request.urlopen(gsheets_url) as csv_fp:
        csv_bytes = csv_fp.read()
    print('\tReceived {} bytes'.format(len(csv_bytes)))
    csv_str = csv_bytes.decode('utf8')
    return csv_str


def convert_csv_file_to_python(csv_str):
    print('Converting CSV data (string) to Python ...')
    yyyymmdd = datetime.now().strftime('%Y-%m-%d')
    csv_py = []
    rdr = csv.DictReader(io.StringIO(csv_str))
    fn = rdr.fieldnames
    for row in rdr:
        event = csv_row_to_dict(row, rdr)
        if event['incl'] != '':         # It's a comment line!
            continue
        if event['type'] == '' or event['name'] == '':
            continue
        if event['end'] < yyyymmdd:
            continue
        csv_py.append(event)
    csv_py = sorted(csv_py, key=lambda e: (e['start'], e['name']))
    return csv_py


# Pattern (Markdown links) example:  "...[Google](https://google.com)..."
link_re = re.compile(r'\[(.*?)\]\((.*?)\)')


def csv_row_to_dict(row, rdr):
    fn = rdr.fieldnames

    main_url = ''
    links = str(row[fn[7]]).strip()
    if links == '':         # no link
        pass
    elif '[' not in links:  # no markdown syntax; just a plan URL.
        links = '<a href="{}">website</a>'.format(links)
    else:                   # markdown syntax found
        for i, m in enumerate(link_re.finditer(links)):
            if i == 0:
                main_url = m.group(2)
            links = links.replace(m.group(0), '<a href="{}">{}</a>'.format(m.group(2), m.group(1)))

    event = {
        'incl': str(row[fn[0]]).strip(),
        'type': str(row[fn[1]]).strip(),
        'name': str(row[fn[2]]).strip(),
        'start': str(row[fn[3]]).strip(),
        'end': str(row[fn[4]]).strip(),
        'city': str(row[fn[5]]).strip(),
        'prov': str(row[fn[6]]).strip(),
        'url': main_url,
        'links': links,
    }
    event['dates'] = date_str(event['start'], event['end'])
    return event


def date_str(start, end):
    mm1 = _mm2mmm[start[5:7]] if start[5:7] in _mm2mmm else '???'
    dd1 = start[8:10].lstrip(' 0')
    mm2 = _mm2mmm[end[5:7]] if end[5:7] in _mm2mmm else '???'
    dd2 = end[8:10].lstrip(' 0')
    if mm1 != mm2:
        return '{} {}-{} {}'.format(mm1[0:3], dd1, mm2[0:3], dd2)
    elif dd1 != dd2:
        return '{} {}-{}'.format(mm1, dd1, dd2)
    else:
        return '{} {}'.format(mm1, dd1)


def create_javascript_file(csv_py, javascript_fn):
    print('Writing event data to Javascript file ...\n\tOutput: {}'.format(javascript_fn))
    dest_dir = pathlib.Path(javascript_fn).parent
    dest_dir.mkdir(parents=True, exist_ok=True)
    with open(javascript_fn, 'w') as js_fp:
        js_fp.write('window.ws_cfc_events = ')
        json.dump(csv_py, js_fp, indent='\t')
        js_fp.write(';\n')
    print('\tDone!')


if __name__ == '__main__':
    main()
