var db = require('../DB/dbOperations');

module.exports = {

  createUndetermined: function(dbClient, leagueId, groupA, groupB, groupC, groupD) {
    var promises = [];
    if (groupA) {
      groupA.forEach((players) => {
        var playerString = createPlayerString(players);
        promises.push(db.group.insertToUndetermined(dbClient, leagueId, 'A', playerString, players[0].ranking));
      })
    }
    if (groupB) {
      groupB.forEach((players) => {
        var playerString = createPlayerString(players);
        promises.push(db.group.insertToUndetermined(dbClient, leagueId, 'B', playerString, players[0].ranking));
      })
    }
    if (groupC) {
      groupC.forEach((players) => {
        var playerString = createPlayerString(players);
        promises.push(db.group.insertToUndetermined(dbClient, leagueId, 'C', playerString, players[0].ranking));
      })
    }
    if (groupD) {
      groupD.forEach((players) => {
        var playerString = createPlayerString(players);
        promises.push(db.group.insertToUndetermined(dbClient, leagueId, 'D', playerString, players[0].ranking));
      })
    }
    return promises;
  },

  getUndetermined: function(dbClient, leagueId) {
    return db.group.getUndetermined(dbClient, leagueId);
  },

  fixUndeterminedRankings: function(dbClient, leagueId, group) {
    var promises = [];
    group.players.forEach((player) => {
      promises.push(db.group.updateUndeterminedRanking(dbClient, leagueId, group.key, player.details.id, player.ranking));
    })
    promises.push(db.group.deleteUndeterminedRanking(dbClient, leagueId, group.key));
    return Promise.all(promises);
  }

}

function createPlayerString(players)  {
  var listedPlayers = '';
  players.forEach((player) => {
    listedPlayers = listedPlayers + player.id + ",";
  })
  listedPlayers = listedPlayers.slice(0, listedPlayers.length-1);
  return listedPlayers;
}
