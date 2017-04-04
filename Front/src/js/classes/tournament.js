export default {
    tournament: {
        name: '',
        type: 'League',
        size: '8',
        gametype: '8-ball',
        handicap: false,
        cupSize:'4',
        raceto: {
          roundrobin:'1',
          double:'1',
          single:'1'
        },
        league: false
    },
    gametypes: {
        eightball: '8-ball',
        nineball: '9-ball',
        tenball: '10-ball',
        straight: 'Straight'
    },
    tournamentTypes: {
        single: 'Single',
        doubleEliminationC: 'DoubleWithCup',
        doubleElimination: 'DoubleWithoutCup',
        league: 'League'
    }
}
