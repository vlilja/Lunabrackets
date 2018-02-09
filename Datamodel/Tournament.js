
module.exports = function Tournament(id, name, gameType, status) {
  this.id = id || '';
  this.name = name || '';
  this.gameType = gameType || '';
  this.status = status || '';
}
