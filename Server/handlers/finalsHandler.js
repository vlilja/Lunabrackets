var db = require('../DB/dbOperations');


module.exports = {

  createFinals: function(dbClient, leagueId) {
    return db.finals.insertFinals(dbClient, leagueId);
  },

  createFinalsMatches: function(dbClient, finalsId) {
    var matches = [];
    //first round
    for(var i = 1, k=5; i < 5; i++) {
      matches.push({key:i, winnerProceeds: k});
      if(i % 2 === 0){
        k++;
      }
    }
    //second round
    for(var i = 5, k = 7; i < 7; i++) {
      matches.push({key:i, winnerProceeds: k});
    }
    matches.push({key:7, winnerProceeds: null});
    var promises=[];
    matches.forEach((match) => {
      promises.push(db.finals.insertMatch(dbClient, finalsId, match));
    })
    return Promise.all(promises);
  },

  updateGroupWinnerToFinal(dbClient, leagueId, player, matchKey) {
    return db.finals.insertGroupWinnerToFinal(dbClient, leagueId, player.id, matchKey);
  }

}
