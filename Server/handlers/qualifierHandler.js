const db = require('../DB/dbOperations');

function initializeMatch(dbClient, leagueId, matchKey, match) {
  const pOne = match.playerOne.id ? match.playerOne.id : null;
  const pTwo = match.playerTwo.id ? match.playerTwo.id : null;
  return db.qualifier.updateFirstRoundMatch(dbClient, leagueId, matchKey, pOne, pTwo);
}

function createWinnerSideMatches() {
  const winnerSide = [];
  // Create first round
  for (let i = 1, k = 1; i < 9; i += 1) {
    winnerSide.push({
      key: i,
      winnerProceeds: `A${k}`,
      loserProceeds: `L${k}`,
    });
    if (i % 2 === 0) {
      k += 1;
    }
  }
  // Create winners first round
  for (let i = 1, k = 1; i < 5; i += 1) {
    winnerSide.push({
      key: `A${i}`,
      winnerProceeds: `B${k}`,
      loserProceeds: `L${9 - i}`,
    });
    if (i % 2 === 0) {
      k += 1;
    }
  }
  // Create winners third round
  for (let i = 1, k = 11; i < 3; i += 1, k += 1) {
    winnerSide.push({
      key: `B${i}`,
      winnerProceeds: null,
      loserProceeds: `L${k}`,
    });
  }
  return winnerSide;
}

function createLoserSideMatches() {
  const loserSide = [];
  // Create first loser round
  for (let i = 1; i < 5; i += 1) {
    loserSide.push({
      key: `L${i}`,
      winnerProceeds: `L${i + 4}`,
    });
  }
  // Create loser second round
  for (let i = 1, k = 9; i < 5; i += 1) {
    if (i === 3) {
      k += 1;
    }
    loserSide.push({
      key: `L${i + 4}`,
      winnerProceeds: `L${k}`,
    });
  }
  // Create loser third round
  for (let i = 9; i < 11; i += 1) {
    loserSide.push({
      key: `L${i}`,
      winnerProceeds: `L${i + 2}`,
    });
  }
  // Create loser fourth round
  for (let i = 11; i < 13; i += 1) {
    loserSide.push({
      key: `L${i}`,
      winnerProceeds: null,
    });
  }
  return loserSide;
}


module.exports = {

  createQualifier(dbClient, leagueId) {
    return db.qualifier.insertQualifier(dbClient, leagueId);
  },

  /*
  Create qualifier matches
  */
  createQualifierMatches(dbClient, qualifierId) {
    const winnerSide = createWinnerSideMatches();
    const loserSide = createLoserSideMatches();
    const matches = {
      winnerSide,
      loserSide,
    };
    const promises = [];
    matches.winnerSide.forEach((match) => {
      promises.push(db.qualifier.insertMatch(dbClient, qualifierId, match));
    });
    matches.loserSide.forEach((match) => {
      promises.push(db.qualifier.insertMatch(dbClient, qualifierId, match));
    });
    return Promise.all(promises);
  },

  updatePlayersToQualifier(dbClient, leagueId, placements, groupA, groupB, groupC, groupD) {
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

  getMatches(dbClient, leagueId) {
    return db.qualifier.getMatches(dbClient, leagueId);
  },

  getPlacements(dbClient) {
    return db.qualifier.getPlacements(dbClient);
  },

  updateBracket(dbClient, leagueId, match) {
    const promises = [];
    let winner;
    let loser;
    let wnmk;
    let lnmk;
    promises.push(db.qualifier.updateMatchScore(dbClient, leagueId, match));
    const result = match.getResult();
    if (result) {
      ({ winner, loser } = result);
      wnmk = match.winnerNextMatchKey;
      lnmk = match.loserNextMatchKey;
    } else {
      throw new Error('Match not finished');
    }
    // FIRST ROUND
    if (match.key.match(/^[1-8]$/g)) {
      if (Number(match.key) % 2 === 0) {
        promises.push(this.updateQualifiersMatch(dbClient, leagueId, lnmk, null, loser));
        promises.push(this.updateQualifiersMatch(dbClient, leagueId, wnmk, null, winner));
      } else {
        promises.push(this.updateQualifiersMatch(dbClient, leagueId, lnmk, loser, null));
        promises.push(this.updateQualifiersMatch(dbClient, leagueId, wnmk, winner, null));
      }
    }
    // WINNERS BRACKET
    if (match.key.match(/^[A|B].{1,2}$/g)) {
      const matchNum = Number(match.key.substring(1));
      if (matchNum % 2 === 0) {
        promises.push(this.updateQualifiersMatch(dbClient, leagueId, wnmk, null, winner));
      } else {
        promises.push(this.updateQualifiersMatch(dbClient, leagueId, wnmk, winner, null));
      }
      promises.push(this.updateQualifiersMatch(dbClient, leagueId, lnmk, loser, null));
    }
    // LOSERS BRACKET
    if (match.key.match(/^L.{1,2}$/g)) {
      const num = Number(match.key.split('L')[1]);
      if ((num >= 1 && num <= 4) || (num === 9 || num === 10)) {
        promises.push(this.updateQualifiersMatch(dbClient, leagueId, wnmk, null, winner));
      }
      if (num >= 5 && num <= 8) {
        if (num % 2 === 0) {
          promises.push(this.updateQualifiersMatch(dbClient, leagueId, wnmk, null, winner));
        } else {
          promises.push(this.updateQualifiersMatch(dbClient, leagueId, wnmk, winner, null));
        }
      }
    }
    return promises;
  },

  updateQualifiersMatch(dbClient, leagueId, matchKey, playerOne = 0, playerTwo = 0) {
    let promise;
    if (playerOne) {
      promise = db.qualifier.updatePlayerOneToMatch(dbClient, leagueId, matchKey, playerOne);
    } else if (playerTwo) {
      promise = db.qualifier.updatePlayerTwoToMatch(dbClient, leagueId, matchKey, playerTwo);
    }
    return promise;
  },

};
