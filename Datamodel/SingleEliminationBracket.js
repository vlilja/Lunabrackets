var Bracket = require('./Bracket');


var SingleEliminationBracket = function(matches, size) {
  Bracket.call(this, matches, size);
  this.type = 'Single Elimination Bracket';

  this.completeMatch = function(match) {
    if(match instanceof Match) {
      var result = match.getResult();
      if(result) {
        var winner = result.winner;
        var nextMatch = this.matches.find((next) => {
          return match.winnerNextMatchKey === next.key;
        })
        if(nextMatch) {
          if(match.isMatchNumEven()){
            nextMatch.setPlayerTwo(winner);
          }
          else {
            nextMatch.setPlayerOne(winner);
          }
        }
      }
    }
  }

}

SingleEliminationBracket.prototype = Object.create(Bracket.prototype);
SingleEliminationBracket.prototype.constructor = SingleEliminationBracket;

module.exports = SingleEliminationBracket;
