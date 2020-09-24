
const i18n_text = [
    //---- Common
    ['cfc_id', 'CFC id', 'FCE id'],
    ['err_enter_criteria', 'Enter search criteria', 'Entrez les critères de recherche'],
    ['err_fetching', 'Error fetching data. Try again later.', 'Erreur lors de la récupération des données. Réessayez plus tard.'],
    ['none_found', 'NONE FOUND', 'PERSONNE N\'EST TROUVE'],
    ['games', 'g', 'j'],

    //---- Page: Search
    ['search_for_players', 'Search for Players', 'Recherchez des joueurs'],
    ['inp_first', 'First name', 'Prénom'],
    ['inp_last', 'Last name', 'Nom de famille'],
    ['search', 'Search', 'Chercher'],
    ['search_for_events', 'Search for Tournaments', 'Rechercher des tournois'],
    ['search_intro', 'Use * as a wild card. Examples: Bob* Fisch*', 'Utilisez * comme joker. Exemple: Bob* Fisch*'],
    ['last_nn_days', 'Last 60 days', '60 derniers jours'],
    ['inp_event_name', 'Tournament name', 'Nom du tournoi'],
    //---- Page: PlayerSearchResults:
    //  (NONE)
    //---- Page Fragment: PlayerList
    ['name', 'Name', 'Nom'],
    ['city', 'City', 'Ville'],
    ['cfc_expiry', 'CFC Expiry', 'Expiration<br>du FCE'],
    ['regular_rating', 'Regular<br>Rating', 'Cote<br>Régulière'],
    ['regular_high', 'Regular<br>High', 'Régulier<br>élevé'],
    ['quick_rating', 'Quick<br>Rating', 'Cote<br>Rapide'],
    ['quick_high', 'Quick<br>High', 'Rapide<br>élevé'],
    ['provisional_notes',
        '<i>(&mldr;)</i> is a provisional rating. <i>(&mldr; g)</i> is the number of games rated',
        '<i>(&mldr;)</i> est une note provisoire. <i>(&mldr; j)</i> est le nombre de jeux notés'
    ],
    // Page: Player
    ['filter_by_type', 'Filter by type', 'Filtrer par type'],
    ['all_types', 'All Tournaments', 'Tous les tournois'],
    ['only_regular', 'Only regular tournaments', 'Seuls les tournois réguliers'],
    ['only_quick', 'Only quick tournaments', 'Seuls les tournois rapides'],
    ['event', 'Event', 'événement'],
    ['end_date', 'End Date', 'Date de fin'],
    ['type', 'Type', 'Type'],
    ['games_played', 'Games<br>Played', 'Jeux<br>joués'],
    ['score', 'Score', 'Score'],
    ['rating_pre', 'Old<br>Rating', 'Ancien<br>Cote'],
    ['rating_perf', 'Perf<br>Rating', 'Perf<br>Cote'],
    ['rating_post', 'New<br>Rating', 'Nouvelle<br>Cote'],
    ['rating_high', 'Highest<br>Rating', 'plus élevée<br>Cote'],
    ['missing_2005',
        'Events before 2006 are not (yet!) available. The data from before 2006 is being reconstructed and will be available soon. Thanks for your patience.',
        'Les événements avant 2006 ne sont pas (encore!) Disponibles. Les données antérieures à 2006 sont en cours de reconstitution et seront bientôt disponibles. Merci pour votre patience.'
    ],
    //---- Page: TournamentSearchResults
    //  (NONE)
    //---- Page: TournamentList
    // Re-used: event, end_date, type
    ['pairings', 'Pairings', 'Appariements'],
    ['prov', 'Prov', 'Prov'],
    ['org_name', 'Organizer', 'Organisateur'],
    //---- Page: Tournament
    // Re-used: ...
    ['player', 'Player', 'Joueur'],
    ['regular', 'Regular', 'Régulier'],
    ['quick', 'Quick', 'Rapide'],
    ['rr', 'Round Robin', 'Round Robin'],
    ['swiss', 'Swiss Sys', 'Swiss Sys'],
];

//---- Build i18n (just once, on import)
function build_i18n() {
    const el_html = document.getElementsByTagName('html')[0];
    const lang = el_html.getAttribute('lang') || 'en';
    let i_lang = lang==='fr' ? 2 : 1;
    let i18n = {};
    i18n_text.forEach(function(txt) {
        i18n[txt[0]] = txt[i_lang];
    });
    return i18n;
}

const i18n = build_i18n();

export function get_i18n() {
    return i18n;
}
