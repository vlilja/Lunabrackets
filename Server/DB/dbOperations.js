var tournament = require('./tournamentOperations');
 user = require('./userOperations');
 player = require('./playerOperations');
 league = require('./leagueOperations');
 group = require('./groupOperations');
 qualifier = require('./qualifierOperations');
 finals = require('./finalsOperations');
 elimination = require('./eliminationOperations');


module.exports = {
  tournament: tournament,
  user:user,
  player:player,
  league:league,
  group:group,
  qualifier:qualifier,
  finals:finals,
  elimination: elimination
}
