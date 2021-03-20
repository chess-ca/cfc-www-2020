+++
title = "Membership Statistics"
layout = "ws-single"
content_review = "2021-05-15 - Add stats for current year (available ~ May 1)"
page_css = """
    table.cfc-census td { text-align:right !important; }
    table.cfc-census td:nth-child(1) { text-align:left !important; }"""
+++

Millions of Canadians play chess at least once a year
([ref](https://www.thecanadianencyclopedia.ca/en/article/chess)).
Many thousands play much more often especially with the popularity and availability of computer and online chess.

A few thousand Canadians play more seriously in CFC-rated tournaments.
Of those tournament players who are still active, most (but not all) have active CFC memberships.

The statistics below are of those chess players with active CFC memberships.

{{< ws-svg src="cfc-membership-count.svg" alt="Count of CFC Memberships by Year" minwidth="600px" >}}

{{< ws-table data="census.2012-later.csv" table_class="cfc-census" >}}

{{< ws-table data="census.1993-2011.csv" table_class="cfc-census" >}}
