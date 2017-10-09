var tournament = require('./tournamentOperations');
var user = require('./userOperations');
var player = require('./playerOperations');
var league = require('./leagueOperations');
var group = require('./groupOperations');


module.exports = {
  tournament: tournament,
  user:user,
  player:player,
  league:league,
  group:group
}
