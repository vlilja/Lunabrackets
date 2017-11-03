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

  initializeMatch: function(dbClient, leagueId, matchKey, match ) {
    var pOne = match.playerOne ? match.playerOne.id : null;
    var pTwo = match.playerTwo ? match.playerTwo.id : null;
    return db.elimination.updateFirstRoundMatch(dbClient, leagueId, matchKey, pOne, pTwo);
  }

}
