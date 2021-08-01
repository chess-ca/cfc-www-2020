+++
slug = "../p/top"
title = "Meilleurs joueurs"
pageid = "pg-ratings-player-lists-top"
no_vuejs = 1
page_css = ".control input, .control select { min-width:12rem; }"

[i18n]
    # ---- For input form
    css1 = 'style="min-width:12rem;"'
    top_n_size = 'Top N (taille de la liste)'
    rating_type = 'Cote type'
    regular_ratings = 'Cote Régulière'
    quick_ratings = 'Cote Rapide'
    age_ge = 'Âge &ge; (au 1 janv. <span x-text="now_yyyy"></span>)'
    age_le = 'Âge &le;'
    gender = 'Le genre'
    province = 'Province'
    cfc_expired = 'FCE expiré &ge;'
    last_event_ge = 'Dernier événement CFC &ge;'
    rating_ge = 'Cote &ge;'
    rating_le = 'Cote &le;'
    # ---- For player-list.html partial
    name = 'Nom'
    city = 'Ville'
    cfc_id = 'FCE id'
    cfc_expiry = 'Expiration<br>du FCE'
    regular_rating = 'Cote<br>Régulière'
    regular_high = 'Régulier<br>élevé'
    quick_rating = 'Cote<br>Rapide'
    quick_high = 'Rapide<br>élevé'
    games = 'j'
    provisional_notes = '<i>(&mldr;)</i> est une note provisoire. <i>(&mldr; j)</i> est le nombre de jeux notés'
+++

{{< ws-embed-html "s1_nav.html" >}}
{{< ws-embed-html "s2_form.html" >}}
{{< ws-embed-html "s3_report.html" >}}