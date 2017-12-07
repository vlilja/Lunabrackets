module.exports = function Group(id, key, name, players, matches) {
  this.id = id || '';
  this.key = key || '';
  this.name = name || '';
  this.players = players || [];
  this.matches = matches || [];
}
