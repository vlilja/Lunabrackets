var Bracket = require('./Bracket');


var DoubleEliminationBracket = function(matches, size) {
  Bracket.call(this, matches, size);
  var brackets = constructor(matches, size);
  this.type = 'Double Elimination Bracket';


  this.upperBracket = brackets.upperBracket;
  this.lowerBracket = brackets.lowerBracket;

  this.completeMatch = function(match) {
    if (match instanceof Match) {
      var result = match.getResult();
      if (match.key.charAt(0) === 'L') {
        var nextMatch = this.lowerBracket.find((next) => {
          return match.winnerNextMatchKey === next.key;
        })
      }
    }
  }

}

function constructor(matches, size) {
  var upperBracket = [];
  var lowerBracket = [];
  var firstRoundSize = size / 2;
  var loserFirstRoundSize = firstRoundSize/2;
  var upperBracketRounds = {};
  var lowerBracketRounds = {};
  var num = 1;
  var keys = {
    1: 'R1',
    2: 'A',
    3: 'B',
    4: 'C'
  };
  while (firstRoundSize !== 1) {
    upperBracketRounds[keys[num]] = {
      number: num,
      matches: []
    };
    lowerBracketRounds['L' + num] = {
      number: num,
      matches: []
    };
    firstRoundSize = firstRoundSize / 2;
    num++;
  }
  lowerBracketRounds['L' + num] = {
    number: num,
    matches: []
  };
  matches.forEach((match) => {
    var key = match.key.charAt(0);
    if (key === 'L') {
      lowerBracket.push(match);
    } else {
      if (!isNaN(Number(key))) {
        upperBracketRounds['R1'].matches.push(match);
      } else {
        upperBracketRounds[key].matches.push(match);
      }
    }
  })
  lowerBracket.sort((a ,b) => {
    return Number(a.key.substr(1)) - Number(b.key.substr(1));
  })
  var k = loserFirstRoundSize/2;
  var i = 0;
  var rounds = [];
  var round = [];
  console.log(lowerBracket.length);
  while(lowerBracket.length>0) {
    if(i < k){
    var match = lowerBracket.pop();
    round.push(match);
    i++;
    }
    else {
      i=0;
      rounds.push(round);
      round = [];
      if(rounds.length % 2 === 0 && rounds.length !== 0){
        k = k * 2;
      }
    }
  }
  rounds.push(round);
  console.log(rounds);
  for(var key in lowerBracketRounds) {
    lowerBracketRounds[key].matches = rounds.pop();
  }
  upperBracket = upperBracketRounds;
  lowerBracket = lowerBracketRounds;
  console.log(lowerBracket.L1);
  return {
    upperBracket: upperBracket,
    lowerBracket: lowerBracket
  };
}

DoubleEliminationBracket.prototype = Object.create(Bracket.prototype);
DoubleEliminationBracket.prototype.constructor = DoubleEliminationBracket;

module.exports = DoubleEliminationBracket;
