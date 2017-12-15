var Bracket = require('./Bracket');


var SingleEliminationBracket = function(matches, players, size) {
  Bracket.call(this, matches, players, size);
  this.type = 'Single Elimination Bracket';
  var rounds = constructor(matches.slice(), size);
  this.rounds = rounds;

}

function constructor(matches, size) {
  matches.sort((a, b) => {
    return Number(b.key) - Number(a.key);
  })
  var roundSize = size / 2;
  var roundkeys = ['R1', 'A', 'B', 'C', 'D', 'E', 'F'];
  var round = [];
  var rounds = {};
  var i = 0;
  var k = 0;
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

SingleEliminationBracket.prototype = Object.create(Bracket.prototype);
SingleEliminationBracket.prototype.constructor = SingleEliminationBracket;

module.exports = SingleEliminationBracket;
