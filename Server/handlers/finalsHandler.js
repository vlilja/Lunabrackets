var db = require('../DB/dbOperations');


module.exports = {

  createFinals: function(dbClient, leagueId) {
    return db.finals.insertFinals(dbClient, leagueId);
  },

  createFinalsMatches: function(dbClient, finalsId) {
    var matches = [];
    //first round
    for (var i = 1, k = 5; i < 5; i++) {
      matches.push({
        key: i,
        winnerProceeds: k
      });
      if (i % 2 === 0) {
        k++;
      }
    }
    //second round
    for (var i = 5, k = 7; i < 7; i++) {
      matches.push({
        key: i,
        winnerProceeds: k
      });
    }
    matches.push({
      key: 7,
      winnerProceeds: null
    });
    var promises = [];
    matches.forEach((match) => {
      promises.push(db.finals.insertMatch(dbClient, finalsId, match));
    })
    return Promise.all(promises);
  },
  getFinalsMatches: function(dbClient, leagueId) {
    return db.finals.getFinalsMatches(dbClient, leagueId);
  },

  updatePlayersToFinal(dbClient, leagueId, placements, groupA, groupB, groupC, groupD) {
    var promises = [];
    var groups = [{
      key: 'A',
      player: groupA
    }, {
      key: 'B',
      player: groupB
    }, {
      key: 'C',
      player: groupC
    }, {
      key: 'D',
      player: groupD
    }];
    var matches = {};
    placements.forEach((match) => {
      matches[match.match_key] = {
        playerOne: match.player_one,
        playerTwo: match.player_two
      };
    })
    groups.forEach((group) => {
      var seed = group.key + group.player.ranking;
      for (var key in matches) {
        if (matches[key].playerOne === seed) {
          matches[key].playerOne = group.player;
        }
      }
    });
    for (var key in matches) {
      promises.push(initializeMatch(dbClient, leagueId, key, matches[key]));
    }
    return promises;
  },

  updateBracket(dbClient, leagueId, match) {
    var promises = [];
    var player;
    promises.push(db.finals.updateMatchScore(dbClient, leagueId, match));
    var result = match.getResult();
    if(!result){
      throw new Error('Match not finished');
    }
    if(Number(match.key) % 2 === 0){
      promises.push(this.updateFinalsMatch(dbClient, leagueId, match.winnerNextMatchKey, null, result.winner));
    }
    else {
      promises.push(this.updateFinalsMatch(dbClient, leagueId, match.winnerNextMatchKey, result.winner, null));
    }
    return promises;
  },

  updateFinalsMatch(dbClient, leagueId, matchKey, playerOne = 0, playerTwo = 0) {
    if (playerOne) {
      return db.finals.updatePlayerOneToMatch(dbClient, leagueId, matchKey, playerOne);
    } else if (playerTwo) {
      return db.finals.updatePlayerTwoToMatch(dbClient, leagueId, matchKey, playerTwo);
    }
  }

}

function initializeMatch(dbClient, leagueId, matchKey, match) {
  var pOne = (match.playerOne && match.playerOne.id) ? match.playerOne.id : null;
  return db.finals.updatePlayerOneToMatch(dbClient, leagueId, matchKey, pOne);
}
