
import sqlite3, json, os

sqlite_db = r'C:\_TEMP\_TEST_tdlist\tdlist.txt.sqlite'


def main():
    respond_cfc_id("106488")


def respond_http_headers():
    print('content-type: application/json')
    print('cache-control: public, max-age=120, must-revalidate')
    print('status: 200')   # http status (transport layer) is not apicode (application layer)
    print()


def respond_players(cfc_id=None, last=None, first=None):
    where = []
    sqldata = []
    if cfc_id:
        where.append('cfc_id=?')
        sqldata.append(cfc_id)
    if last:
        if '*' not in last:
            where.append('last_lc=?')
        else:
            where.append('last_lc=?')
            last = last.replace('*', '%')
        sqldata.append(last.lower())
    if first:
        if '*' not in first:
            where.append('first_lc=?')
        else:
            where.append('first_lc LIKE ?')
            first = first.replace('*', '%')
        sqldata.append(first.lower())


def respond_cfc_id(cfc_id):
    with Sqlite_Dbcon(sqlite_db) as dbcon:
        dbcsr = dbcon.cursor()
        dbcsr.execute('SELECT * FROM players WHERE cfc_id=?', [cfc_id])
        player = dbcsr.fetchone()
        if player is None:
            respond_http_headers()
            print(f'{{apicode:101, error:"NOT FOUND: cfc_id={cfc_id}}}')
        else:
            respond_http_headers()
            print_players([player['data']])


def print_players(players):
    players_data = ',\n'.join(players)
    print(f'{{apicode:0, players:[\n{players_data}\n]}}')


class Sqlite_Dbcon:
    def __init__(self, sqlite_fpath):
        self.sqlite_fpath = sqlite_fpath
        if not os.path.exists(self.sqlite_fpath):
            raise Exception(f'ERROR: sqlite db not found: {self.sqlite_fpath}')
    def __enter__(self):
        self.dbcon = sqlite3.connect(self.sqlite_fpath)
        self.dbcon.row_factory = sqlite3.Row
        return self.dbcon
    def __exit__(self, type, value, traceback):
        self.dbcon.close()


main()
