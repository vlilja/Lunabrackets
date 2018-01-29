const db = require('../DB/dbOperations');

function initializeMatch(dbClient, leagueId, matchKey, match) {
  const pOne = (match.playerOne && match.playerOne.id) ? match.playerOne.id : null;
  return db.finals.updatePlayerOneToMatch(dbClient, leagueId, matchKey, pOne);
}

module.exports = {

  createFinals(dbClient, leagueId) {
    return db.finals.insertFinals(dbClient, leagueId);
  },

  createFinalsMatches(dbClient, finalsId) {
    const matches = [];
    // first round
    for (let i = 1, k = 5; i < 5; i += 1) {
      matches.push({
        key: i,
        winnerProceeds: k,
      });
      if (i % 2 === 0) {
        k += 1;
      }
    }
    // second round
    for (let i = 5, k = 7; i < 7; i += 1) {
      matches.push({
        key: i,
        winnerProceeds: k,
      });
    }
    matches.push({
      key: 7,
      winnerProceeds: null,
    });
    const promises = [];
    matches.forEach((match) => {
      promises.push(db.finals.insertMatch(dbClient, finalsId, match));
    });
    return Promise.all(promises);
  },

  getFinalsMatches(dbClient, leagueId) {
    return db.finals.getFinalsMatches(dbClient, leagueId);
  },

  getPlacements(dbClient) {
    return db.finals.getPlacements(dbClient);
  },

  updatePlayersToFinal(dbClient, leagueId, placements, groupA, groupB, groupC, groupD) {
    const promises = [];
    const groups = [{
      key: 'A',
      player: groupA,
    }, {
      key: 'B',
      player: groupB,
    }, {
      key: 'C',
      player: groupC,
    }, {
      key: 'D',
      player: groupD,
    }];
    const matches = {};
    placements.forEach((match) => {
      matches[match.match_key] = {
        playerOne: match.player_one,
        playerTwo: match.player_two,
      };
    });
    const matchesKeys = Object.keys(matches);
    groups.forEach((group) => {
      const seed = group.key + group.player.ranking;
      matchesKeys.forEach((key) => {
        if (matches[key].playerOne === seed) {
          matches[key].playerOne = group.player;
        }
      });
    });
    matchesKeys.forEach((key) => {
      promises.push(initializeMatch(dbClient, leagueId, key, matches[key]));
    });
    return promises;
  },

  updateBracket(dbClient, leagueId, match) {
    const promises = [];
    promises.push(db.finals.updateMatchScore(dbClient, leagueId, match));
    const result = match.getResult();
    if (!result) {
      throw new Error('Match not finished');
    }
    if (Number(match.key) % 2 === 0) {
      promises.push(this.updateFinalsMatch(dbClient, leagueId, match.winnerNextMatchKey, null, result.winner));
    } else {
      promises.push(this.updateFinalsMatch(dbClient, leagueId, match.winnerNextMatchKey, result.winner, null));
    }
    return promises;
  },

  updateFinalsMatch(dbClient, leagueId, matchKey, playerOne = 0, playerTwo = 0) {
    let player;
    if (playerOne) {
      player = playerOne;
    } else if (playerTwo) {
      player = playerTwo;
    }
    return db.finals.updatePlayerOneToMatch(dbClient, leagueId, matchKey, player);
  },

};
