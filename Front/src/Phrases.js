export default {
  general: {
    handicap: 'Handicap',
    game: 'Game',
    stage: 'Stage',
    players: 'Players',
    raceTo: 'Race to',
    group: 'Group',
    games: {
      eight: '8-ball',
      nine: '9-ball',
      ten: '10-ball',
      straight: 'Straight pool',
    },
    yes: 'Yes',
    no: 'No',
    ndash: '–',
    ranking: 'Ranking',
    place: 'Place',
    submit: 'Submit',
  },
  season: {
    heading: 'Seasons',
    active: 'Active',
    inactive: 'Inactive',
    sum: 'Sum',
  },
  league: {
    heading: 'Leagues',
    infoText: 'League is a game mode for maximum of 32 players that consists of three stages: round-robin group stage, double elimination stage and the final single elimination stage. At first the players are\n\n' +
    'divided to 4 groups where they play against each other. Winner of each group will advance straight to the final single elimination stage and last two are eliminated from the competition.\n' +
    'The rest will move on to the double elimination stage and seeded to the bracket according to their placements. From the double elimination state 4 players will advance to the final stage and rest are eliminated. In the final stage, each group stage winner will\n' +
    'be drawn an opponent from the double-elimination stage winners.',
  },
  seasonForm: {
    heading: 'Create new season',
    name: 'Name',
    create: 'Create season',
  },
  leagueForm: {
    heading: 'Create new league',
    mainFormHeading: 'Step One',
    playerHeading: 'Step Two',
    summaryHeading: 'Summary',
    formLegend: 'League',
    name: 'Name',
    game: 'Game',
    season: 'Season',
    add: 'Add',
    remove: ' Remove',
    availablePlayers: 'Available players',
    selectedPlayers: 'Selected players',
    infoCreatingLeagueHeading: 'Creating league',
    warningHeading: 'Warning',
    warningMessage: 'There are less than 32 players in the league and it will cause games with walk overs. Do you want to proceed and still create this league?',
  },
  leagueStartForm: {
    leagueSettings: 'League settings',
    groupNamesHeading: 'Group Names & Race to',
    raceTo: 'Race to',
    playerHandicaps: 'Player handicaps',
    startLeague: 'Start league',
  },
  endGroupStageForm: {
    heading: 'Group stage',
    matchesComplete: 'Matches complete',
    modalHeading: 'Incomplete matches',
    modalText: 'There are still incomplete group matches. Do you still want to start the qualifiers?',
    startQualifiers: 'Start qualifiers & elimination',
  },
  endQualifiersForm: {
    heading: 'Qualifiers stage',
    startFinals: 'Start finals',
  },
  leagueNavigation: {
    admin: 'Admin',
    results: 'Results',
    elimination: 'Elimination',
    group: 'Group',
    qualifiers: 'Qualifiers',
    finals: 'Finals',
  },
  adminView: {
    heading: 'Administration',
    leaguePanelHeading: 'League details',
    groupsHeading: 'Group names',
    handicapHeading: 'Adjust handicaps',
    currentStage: 'Current stage',
    start: 'Start',
    undeterminedRankingsHeading: 'Undetermined rankings',
    noUndetermined: 'No undetermined rankings',
    leagueComplete: 'This league has ended',
  },
  groupView: {
    wins: 'Wins',
    place: 'Place',
    matchScoreFormHeading: 'Enter match score',
    update: 'Update',
    groupStageNotStarted: 'Group stage has not started yet',
  },
  eliminationView: {
    bracketHeading: 'Elimination bracket',
    eliminationNotStarted: 'Mega elimination has not started yet',
  },
  qualifiersView: {
    winnerSide: 'Winner side',
    loserSide: 'Loser side',
    qualifiersNotStarted: 'Qualifiers have not started yet',
  },
  finalsView: {
    bracketHeading: 'Finals bracket',
    quarterFinals: 'Quarterfinals',
    semiFinals: 'Semifinals',
    finalsNotStarted: 'Finals have not started yet',
    final: 'Final',
  },
  resultsView: {
    heading: 'League results',
    points: 'Points',
    leagueNotFinished: 'League is still not finished!',
  },
  walkOverForm: {
    heading: 'Walk over',
    message: 'Walk over for',
  },
  messages: {
    matchUpdate: 'Match updated successfully',
  },
  errorMessages: {
    pageNotFound: 'Sorry we couldn\'t find what u were looking for...',
    fixRankings: 'Fix duplicate rankings',
    missingSeasonName: 'Missing season name',
    missingName: 'Missing league name',
    missingPlayers: 'Missing players',
    handicapError: 'Fix handicaps',
    invalidScore: 'Who won? Fix scores',
  },
};
