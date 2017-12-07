var Group = require('./Group');

module.exports = function League(id, name, gameType, players, stage) {
  this.id = id || '';
  this.name = name || '';
  this.gameType = gameType || '';
  this.stage = stage || '';
  this.players = players || [];
}
