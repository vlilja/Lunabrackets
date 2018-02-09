
const user = require('./userOperations');
const player = require('./playerOperations');
const league = require('./leagueOperations');
const group = require('./groupOperations');
const qualifier = require('./qualifierOperations');
const finals = require('./finalsOperations');
const elimination = require('./eliminationOperations');
const season = require('./seasonOperations');
const tournament = require('./tournamentOperations');


module.exports = {
  user,
  player,
  league,
  group,
  qualifier,
  finals,
  elimination,
  season,
  tournament,
};
