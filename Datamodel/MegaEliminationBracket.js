var Bracket = require('./Bracket');


var MegaEliminationBracket = function(matches, players, size) {
  Bracket.call(this, matches, players, size);
  this.type = 'Mega Elimination Bracket';
  var rounds = constructor(matches.slice(), size);
  this.rounds = rounds;

}

function constructor(matches, size) {
  matches.sort((a, b) => {
    return Number(b.key) - Number(a.key);
  })
  var firstRoundSize = 4;
  var roundSize = (size-firstRoundSize) / 2;
  var roundkeys = ['R1', 'A', 'B', 'C', 'D', 'E', 'F'];
  var round = [];
  var rounds = {};
  for(var z = 0; z < firstRoundSize; z++){
    round.push(matches.pop());
  }
  rounds[roundkeys[0]] = round;
  round = [];
  var i = 0;
  var k = 1;
  while (matches.length > 0) {
    round.push(matches.pop());
    i++;
    if (i === roundSize) {
      rounds[roundkeys[k]] = round;
      round = [];
      roundSize/=2;
      k+=1;
      i = 0;
    }
  }
  return rounds;
}

MegaEliminationBracket.prototype = Object.create(Bracket.prototype);
MegaEliminationBracket.prototype.constructor = MegaEliminationBracket;

module.exports = MegaEliminationBracket;
