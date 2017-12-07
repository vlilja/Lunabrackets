var Bracket = require('./Bracket');


var RoundRobinBracket = function(matches, size) {
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

RoundRobinBracket.prototype = Object.create(Bracket.prototype);
RoundRobinBracket.prototype.constructor = RoundRobinBracket;

module.exports = RoundRobinBracket;
