var db = require('../DB/dbOperations');

module.exports = {

  createElimination: function(dbClient, leagueId) {
    return db.elimination.insertElimination(dbClient, leagueId);
  },

  createEliminationMatches: function(dbClient, leagueId) {
    var matches = [];
    //First round
    matches.push({key:'1', winnerProceeds:'5'})
    matches.push({key:'2', winnerProceeds:'6'})
    matches.push({key:'3', winnerProceeds:'7'})
    matches.push({key:'4', winnerProceeds:'8'})
    //Second round
    matches.push({key:'5', winnerProceeds:'9'})
    matches.push({key:'6', winnerProceeds:'9'})
    matches.push({key:'7', winnerProceeds:'10'})
    matches.push({key:'8', winnerProceeds:'10'})
    //Third round
    matches.push({key:'9', winnerProceeds:'11'})
    matches.push({key:'10', winnerProceeds:'11'})
    //Fourth round
    matches.push({key:'11', winnerProceeds:null})
    var promises = [];
    matches.forEach((match) => {
      promises.push(db.elimination.insertEliminationMatch(dbClient, leagueId, match));
    })
    return Promise.all(promises);
  },

  updatePlayersToElimination: function (dbClient, leagueId, placements, groupA, groupB, groupC, groupD) {
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

  getEliminationMatches(dbClient, leagueId) {
    return db.elimination.getEliminationMatches(dbClient, leagueId);
  },

  updateBracket(dbClient, leagueId, match) {
    var promises = [];
    var player;
    promises.push(db.elimination.updateMatchScore(dbClient, leagueId, match));
    if(match.player_one_score > match.player_two_score) {
      player = match.player_one.player_id;
    }
    else {
      player = match.player_two.player_id;
    }
    if(match.match_key.match(/^[1-4]$/g) || Number(match.match_key) % 2 === 0){
      this.updateEliminationMatch(dbClient, leagueId, match.winner_next_match_key, null, player);
    }
    else {
      this.updateEliminationMatch(dbClient, leagueId, match.winner_next_match_key, player, null);
    }
    return promises;
  },

  updateEliminationMatch(dbClient, leagueId, matchKey, playerOne=0, playerTwo=0) {
    if(playerOne) {
      return db.elimination.updatePlayerOneToMatch(dbClient, leagueId, matchKey, playerOne);
    }
    else if(playerTwo) {
      return db.elimination.updatePlayerTwoToMatch(dbClient, leagueId, matchKey, playerTwo);
    }
  }

}

function initializeMatch(dbClient, leagueId, matchKey, match) {
  var pOne = (match.playerOne && match.playerOne.id) ? match.playerOne.id : null;
  var pTwo = (match.playerTwo && match.playerTwo.id) ? match.playerTwo.id : null;
  return db.elimination.updateFirstRoundMatch(dbClient, leagueId, matchKey, pOne, pTwo);
}
