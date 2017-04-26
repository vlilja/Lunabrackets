
export default {

  setMatchOrder: function(tournamentSize, matches){
    var bracketSize = tournamentSize/2;
    var matchIdx = 0;
      for(var i = 0; i < matches.length; i++){
          var nextMatchNumber = this.calculateNextMatch(bracketSize, matches[matchIdx].number);
           matches[matchIdx].nextMatch = nextMatchNumber;
           matchIdx++;
      }
    },

  calculateNextMatch: function(bracketSize,  matchNumber) {
   var nextMatchId = matchNumber+bracketSize-(matchNumber/2);
   return Math.ceil(nextMatchId);
  }



}
