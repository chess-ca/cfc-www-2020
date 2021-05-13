#!/usr/bin/env python3
# ======================================================================
# netlify/deploy.py
#   - Invoked by Netlify to re-build the site.
#   - Using a deploy script instead of a &&-chain of commands (as done
#     in Netlify examples) because Netlify would not always do the
#     npm install (could not find why; script always works).
# ======================================================================
import os, io, pathlib, subprocess, urllib.request, csv, re, datetime, json

EVENTS_GSHEET = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR0OdgsCSYzlRBMOMkLFTHVuIcdXNSz7XQ3KWz4jtJr5fH4wHzDv1HRP3ytG4PwqxAXdTQLjOL0srAB/pub?gid=0&single=true&output=csv'
CLUBS_GSHEET = ''

ROOT_PATH = pathlib.Path(__file__).resolve().parents[2]
_months = {
    '01':['Jan','janv'],  '02':['Feb','févr'], '03':['Mar','mars'],
    '04':['Apr','avr'],   '05':['May','mai'],  '06':['June','juin'],
    '07':['July','juil'], '08':['Aug','aout'], '09':['Sept','sept'],
    '10':['Oct','oct'],   '11':['Nov','nov'],  '12':['Dec','déc'],
}


def main():
    do_npm_install()
    do_rollup_build()
    do_events_build_OLD()
    # do_events_build()
    do_clubs_build()
    do_hugo_build()


def do_npm_install():
    print('─'*72, '\nTASK: NPM Install')
    run_command('x-dev', 'npm install')


def do_rollup_build():
    print('─'*72, '\nTASK: Rollup Build')
    run_command('x-dev', 'npm run rollup:build-prod')


def do_events_build_OLD():
    print('─'*72, '\nTASK: Upcoming Events List (OLD)')
    cmd = 'python3 {0}/x-dev/netlify/build-events.py -o "{0}/hugo/static/data/cfc-events.js"'.format(ROOT_PATH)
    run_command('x-dev', cmd)


def do_events_build():
    print('─'*72, '\nTASK: Upcoming Events List')
    # Pattern (Markdown links) example:  "...[Google](https://google.com)..."
    link_re = re.compile(r'\[(.*?)\]\((.*?)\)')
    yyyymmdd = datetime.datetime.now().strftime('%Y-%m-%d')

    events = []
    csv_rdr = get_gsheet_as_csv(EVENTS_GSHEET)
    fn = csv_rdr.fieldnames
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
        del event['incl']
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

    dest_file = 'content/events/cfc-events.js'
    with open(ROOT_PATH / dest_file, 'w') as js_fp:
        js_fp.write('\twindow.ws_cfc_events = ')
        json.dump(events, js_fp, indent=None)
        js_fp.write(';')
    print('\tData saved in: {}'.format(dest_file))


def do_clubs_build():
    print('─'*72, '\nTASK: Chess Clubs List')
    print('(under construction)')


def do_hugo_build():
    print('─'*72, '\nTASK: Hugo Build')
    run_command('hugo', 'hugo -d public --gc')
    # cd $DIR_ROOT/hugo
    # hugo -d public --gc


def run_command(working_dir, cmd, check=True):
    shell = isinstance(cmd, str)
    print('Command:', cmd if shell else ' '.join(cmd))
    wd = ROOT_PATH if working_dir == '.' else ROOT_PATH / working_dir
    os.chdir(str(wd))
    subprocess.run(cmd, shell=shell, check=check)


def get_gsheet_as_csv(gsheet_url):
    with urllib.request.urlopen(gsheet_url) as csv_fp:
        csv_bytes = csv_fp.read()
    print('\tRead {} bytes from gsheets'.format(len(csv_bytes)))
    csv_str = csv_bytes.decode('utf8')
    csv_rdr = csv.DictReader(io.StringIO(csv_str))
    return csv_rdr


def nice_dates(start, end):
    # Convert to human readable English and French
    mm1 = start[5:7]
    dd1 = start[8:10].lstrip('0')
    mm2 = end[5:7]
    dd2 = end[8:10].lstrip('0')

    if mm1 != mm2:
        dates = dict(
            en='{} {}-{} {}'.format(_months[mm1][0], dd1, _months[mm2][0], dd2),
            fr='{} {}-{} {}'.format(dd1, _months[mm1][1], dd2, _months[mm2][1]),
        )
    elif dd1 != dd2:
        dates = dict(
            en='{} {}-{}'.format(_months[mm1][0], dd1, dd2),
            fr='{}-{} {}'.format(dd1, dd2, _months[mm1][1]),
        )
    else:
        dates = dict(
            en='{} {}'.format(_months[mm1][0], dd1),
            fr='{} {}'.format(dd1, _months[mm1][1]),
        )
    return dates

main()
