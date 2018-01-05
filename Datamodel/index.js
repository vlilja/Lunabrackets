var season = require('./Season');
var league = require('./League');
var match = require('./Match');
var player = require('./Player');
var group = require('./Group');
var rrbracket = require('./RoundRobinBracket');
var debracket = require('./DoubleEliminationBracket');
var sebracket = require('./SingleEliminationBracket');
var mebracket = require('./MegaEliminationBracket');

module.exports = {
  Season: season,
  League: league,
  Match: match,
  Player: player,
  Group:group,
  RoundRobinBracket: rrbracket,
  DoubleEliminationBracket: debracket,
  SingleEliminationBracket: sebracket,
  MegaEliminationBracket: mebracket
}
