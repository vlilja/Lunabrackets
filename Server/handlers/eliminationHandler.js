const db = require('../DB/dbOperations');

function initializeMatch(dbClient, leagueId, matchKey, match) {
  const pOne = (match.playerOne && match.playerOne.id) ? match.playerOne.id : null;
  const pTwo = (match.playerTwo && match.playerTwo.id) ? match.playerTwo.id : null;
  return db.elimination.updateFirstRoundMatch(dbClient, leagueId, matchKey, pOne, pTwo);
}

module.exports = {

  createElimination(dbClient, leagueId) {
    return db.elimination.insertElimination(dbClient, leagueId);
  },

  createEliminationMatches(dbClient, leagueId) {
    const matches = [];
    // First round
    matches.push({ key: '1', winnerProceeds: '5' });
    matches.push({ key: '2', winnerProceeds: '6' });
    matches.push({ key: '3', winnerProceeds: '7' });
    matches.push({ key: '4', winnerProceeds: '8' });
    // Second round
    matches.push({ key: '5', winnerProceeds: '9' });
    matches.push({ key: '6', winnerProceeds: '9' });
    matches.push({ key: '7', winnerProceeds: '10' });
    matches.push({ key: '8', winnerProceeds: '10' });
    // Third round
    matches.push({ key: '9', winnerProceeds: '11' });
    matches.push({ key: '10', winnerProceeds: '11' });
    // Fourth round
    matches.push({ key: '11', winnerProceeds: null });
    const promises = [];
    matches.forEach((match) => {
      promises.push(db.elimination.insertEliminationMatch(dbClient, leagueId, match));
    });
    return Promise.all(promises);
  },

  updatePlayersToElimination(dbClient, leagueId, placements, groupA, groupB, groupC, groupD) {
    const promises = [];
    const groups = [{ key: 'A', players: groupA }, { key: 'B', players: groupB }, { key: 'C', players: groupC }, { key: 'D', players: groupD }];
    const matches = {};
    placements.forEach((match) => {
      matches[match.match_key] = {
        playerOne: match.player_one,
        playerTwo: match.player_two,
      };
    });
    const matchKeys = Object.keys(matches);
    groups.forEach((group) => {
      group.players.forEach((player) => {
        const seed = group.key + player.ranking;
        matchKeys.forEach((key) => {
          if (matches[key].playerOne === seed) {
            matches[key].playerOne = player;
          }
          if (matches[key].playerTwo === seed) {
            matches[key].playerTwo = player;
          }
        });
      });
    });
    matchKeys.forEach((key) => {
      promises.push(initializeMatch(dbClient, leagueId, key, matches[key]));
    });
    return promises;
  },

  getEliminationMatches(dbClient, leagueId) {
    return db.elimination.getEliminationMatches(dbClient, leagueId);
  },

  getPlacements(dbClient) {
    return db.elimination.getEliminationPlacements(dbClient);
  },

  updateBracket(dbClient, leagueId, match) {
    const promises = [];
    promises.push(db.elimination.updateMatchScore(dbClient, leagueId, match));
    const result = match.getResult();
    if (!result) {
      throw new Error('Match not finished');
    }
    const nextMatchKey = match.winnerNextMatchKey;
    if (match.key.match(/^[1-4]$/g) || Number(match.key) % 2 === 0) {
      promises.push(this.updateEliminationMatch(dbClient, leagueId, nextMatchKey, null, result.winner));
    } else {
      promises.push(this.updateEliminationMatch(dbClient, leagueId, nextMatchKey, result.winner, null));
    }
    return promises;
  },

  updateEliminationMatch(dbClient, leagueId, matchKey, playerOne = 0, playerTwo = 0) {
    let promise;
    if (playerOne) {
      promise = db.elimination.updatePlayerOneToMatch(dbClient, leagueId, matchKey, playerOne);
    } else if (playerTwo) {
      promise = db.elimination.updatePlayerTwoToMatch(dbClient, leagueId, matchKey, playerTwo);
    }
    return promise;
  },

};
