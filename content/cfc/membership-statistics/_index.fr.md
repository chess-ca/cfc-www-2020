+++
title = "Statistiques des membres"
layout = "ws-single"
page_css = """
    table.cfc-census td { text-align:right !important; }
    table.cfc-census td:nth-child(1) { text-align:left !important; }"""
+++

Des millions de Canadiens jouent aux échecs au moins une fois par an
([ref](https://www.thecanadianencyclopedia.ca/en/article/chess)).
Des milliers de joueurs jouent beaucoup plus souvent, surtout avec la popularité et la disponibilité des échecs informatiques et en ligne.

Quelques milliers de Canadiens jouent plus sérieusement dans des tournois classés FCE.
Parmi les joueurs de tournois encore actifs, la plupart (mais pas tous) ont des adhésions actives au FCE.

Les statistiques ci-dessous concernent les joueurs d'échecs avec des adhésions actives au FCE.

{{< ws-svg src="cfc-membership-count.svg" alt="Nombre d'adhésions au CFC par année" minwidth="600px" >}}

{{< ws-table data="census.2012-later.csv" table_class="cfc-census" >}}

{{< ws-table data="census.1993-2011.csv" table_class="cfc-census" >}}
