var db = require('../DB/dbOperations');


module.exports = {

  createQualifier: function(dbClient, leagueId) {
    return db.qualifier.insertQualifier(dbClient, leagueId);
  },

  /*
  Create qualifier matches
  */
  createQualifierMatches: function(dbClient, qualifierId) {
    var winnerSide = createWinnerSideMatches();
    var loserSide = createLoserSideMatches();
    var matches = {
      winnerSide: winnerSide,
      loserSide: loserSide
    }
    var promises = [];
    matches.winnerSide.forEach((match) => {
      promises.push(db.qualifier.insertMatch(dbClient, qualifierId, match));
    });
    matches.loserSide.forEach((match) => {
      promises.push(db.qualifier.insertMatch(dbClient, qualifierId, match));
    });
    return Promise.all(promises);
  },

  updatePlayersToQualifier: function(dbClient, leagueId, placements, groupA, groupB, groupC, groupD) {
    var promises = [];
    var groups = [{key:'A', players:groupA},{key:'B', players:groupB}, {key:'C', players:groupC}, {key:'D', players:groupD}];
    var matches = {};
    placements.forEach((match) => {
      matches[match.match_key] = {
        playerOne: match.player_one,
        playerTwo: match.player_two
      };
    })
    groups.forEach((group) => {
      group.players.forEach((player) => {
        var seed = group.key+player.ranking;
        for(var key in matches) {
          if(matches[key].playerOne === seed) {
            matches[key].playerOne = player;
          }
          if(matches[key].playerTwo === seed) {
            matches[key].playerTwo = player;
          }
        }
      })
    })
    for (var key in matches) {
      promises.push(initializeMatch(dbClient, leagueId, key, matches[key]));
    }
    return promises;
  },

  getMatches: function(dbClient, leagueId) {
    return db.qualifier.getMatches(dbClient, leagueId);
  },

  updateQualifiersMatch(dbClient, leagueId, matchKey, playerOne=0, playerTwo=0){
    if(playerOne) {
      return db.qualifier.updatePlayerOneToMatch(dbClient, leagueId, matchKey, playerOne);
    }
    else if(playerTwo) {
      return db.qualifier.updatePlayerTwoToMatch(dbClient, leagueId, matchKey, playerTwo);
    }
  }

}

function initializeMatch(dbClient, leagueId, matchKey, match) {
  var pOne = match.playerOne.id ? match.playerOne.id : null;
  var pTwo = match.playerTwo.id ? match.playerTwo.id : null;
  return db.qualifier.updateFirstRoundMatch(dbClient, leagueId, matchKey, pOne, pTwo);
}

function createWinnerSideMatches() {
  var winnerSide = [];
  //Create first round
  for (var i = 1, k = 1; i < 9; i++) {
    winnerSide.push({
      key: i,
      winnerProceeds: 'A' + k,
      loserProceeds: 'L' + k
    });
    if (i % 2 === 0) {
      k++;
    }
  }
  //Create winners first round
  for (var i = 1, k = 1; i < 5; i++) {
    winnerSide.push({
      key: 'A' + i,
      winnerProceeds: 'B' + k,
      loserProceeds: 'L' + (9 - i)
    });
    if (i % 2 === 0) {
      k++;
    }
  }
  //Create winners third round
  for (var i = 1, k = 11; i < 3; i++, k++) {
    winnerSide.push({
      key: 'B' + i,
      winnerProceeds: null,
      loserProceeds: 'L' + k
    });
  }
  return winnerSide;
}

function createLoserSideMatches() {
  var loserSide = [];
  //Create first loser round
  for (var i = 1; i < 5; i++) {
    loserSide.push({
      key: 'L' + i,
      winnerProceeds: 'L' + (i + 4)
    });
  }
  //Create loser second round
  for (var i = 1, k = 9; i < 5; i++) {
    if (i === 3) {
      k++
    }
    loserSide.push({
      key: 'L' + (i + 4),
      winnerProceeds: 'L' + k
    });
  }
  //Create loser third round
  for (var i = 9; i < 11; i++) {
    loserSide.push({
      key: 'L' + i,
      winnerProceeds: 'L' + (i + 2)
    });
  }
  //Create loser fourth round
  for (var i = 11; i < 13; i++) {
    loserSide.push({
      key: 'L' + i,
      winnerProceeds: null
    });
  }
  return loserSide;
}