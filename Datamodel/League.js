
module.exports = function League(id, name, gameType, players, raceTo, stage) {
  this.id = id || '';
  this.name = name || '';
  this.raceTo = raceTo || 1;
  this.gameType = gameType || '';
  this.stage = stage || '';
  this.players = players || [];
}
