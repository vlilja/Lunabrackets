const db = require('../DB/dbOperations');

function createPlayerString(players) {
  let listedPlayers = '';
  players.forEach((player) => {
    listedPlayers = `${listedPlayers + player.id},`;
  });
  listedPlayers = listedPlayers.slice(0, listedPlayers.length - 1);
  return listedPlayers;
}

module.exports = {

  createUndetermined(dbClient, leagueId, groupA, groupB, groupC, groupD) {
    const promises = [];
    if (groupA) {
      groupA.forEach((players) => {
        const playerString = createPlayerString(players);
        promises.push(db.group.insertToUndetermined(dbClient, leagueId, 'A', playerString, players[0].ranking));
      });
    }
    if (groupB) {
      groupB.forEach((players) => {
        const playerString = createPlayerString(players);
        promises.push(db.group.insertToUndetermined(dbClient, leagueId, 'B', playerString, players[0].ranking));
      });
    }
    if (groupC) {
      groupC.forEach((players) => {
        const playerString = createPlayerString(players);
        promises.push(db.group.insertToUndetermined(dbClient, leagueId, 'C', playerString, players[0].ranking));
      });
    }
    if (groupD) {
      groupD.forEach((players) => {
        const playerString = createPlayerString(players);
        promises.push(db.group.insertToUndetermined(dbClient, leagueId, 'D', playerString, players[0].ranking));
      });
    }
    return promises;
  },

  getUndetermined(dbClient, leagueId) {
    return db.group.getUndetermined(dbClient, leagueId);
  },

  fixUndeterminedRankings(dbClient, leagueId, group) {
    const promises = [];
    group.players.forEach((player) => {
      promises.push(db.group.updateUndeterminedRanking(dbClient, leagueId, group.key, player.details.id, player.ranking));
    });
    promises.push(db.group.deleteUndeterminedRanking(dbClient, leagueId, group.key));
    return Promise.all(promises);
  },

};
