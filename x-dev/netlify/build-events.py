#!/usr/bin/env python3

GSHEETS_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR0OdgsCSYzlRBMOMkLFTHVuIcdXNSz7XQ3KWz4jtJr5fH4wHzDv1HRP3ytG4PwqxAXdTQLjOL0srAB/pub?gid=0&single=true&output=csv'

import urllib.request
import argparse, csv, io, json


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
    csv_py = []
    rdr = csv.DictReader(io.StringIO(csv_str))
    fn = rdr.fieldnames
    for row in rdr:
        event = csv_row_to_dict(row, rdr)
        if event['incl'] != '' or event['type'] == '' or event['name'] == '':
            continue
        del event['start']          # Not needed by front-end
        csv_py.append(event)
    return csv_py


def csv_row_to_dict(row, rdr):
    fn = rdr.fieldnames
    event = {
        'incl': str(row[fn[0]]).strip(),
        'type': str(row[fn[1]]).strip(),
        'name': str(row[fn[2]]).strip(),
        'start': str(row[fn[3]]).strip(),
        'end': str(row[fn[4]]).strip(),
        'dates': str(row[fn[5]]).strip(),
        'city': str(row[fn[6]]).strip(),
        'prov': str(row[fn[7]]).strip(),
        'links': str(row[fn[8]]).strip(),
    }
    return event


def create_javascript_file(csv_py, javascript_fn):
    print('Writing event data to Javascript file ...\n\tOutput: {}'.format(javascript_fn))
    with open(javascript_fn, 'w') as js_fp:
        js_fp.write('window.ws_cfc_events = ')
        json.dump(csv_py, js_fp, indent='\t')
        js_fp.write(';\n')
    print('\tDone!')


if __name__ == '__main__':
    main()
