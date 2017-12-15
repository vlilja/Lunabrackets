var Bracket = require('./Bracket');


var RoundRobinBracket = function(matches, size, players) {
  Bracket.call(this, matches, players, size);
  this.type = 'Round Robin Bracket';
  this.grid = createGrid(this.matches, this.players);
  this.scores = {}
  this.players.forEach((player) => {
    this.scores[player.id] = 0;
  })

  this.countScores = function() {
    this.matches.forEach((match) => {
      var result = match.getResult();
      if(result) {
        this.scores[result.winner]++;
      }
    })
  }
  this.countScores();

  this.sortRows = function(playerOrder) {
    var players = [];
    while(playerOrder.length > 0){
      var playerId = playerOrder.shift();
      var player = this.players.find((p) => {
        return p.id === playerId;
      })
      players.push(player);
    }
    this.players = players;
    this.grid = createGrid(this.matches, this.players);
  }

}

function createGrid(matches, players) {
  var grid = [];
  players.forEach((player) => {
     var row = [];
     players.forEach((p) => {
       row.push({pOne:player.id, pTwo:p.id});
     })
     row.forEach((match) => {
       match.match = matches.find((m) => {
         return (m.playerOne.id === match.pOne && m.playerTwo.id === match.pTwo) ||
         (m.playerTwo.id === match.pOne && m.playerOne.id === match.pTwo)
       })
     })
     grid.push(row);
  })
  return grid;
}

RoundRobinBracket.prototype = Object.create(Bracket.prototype);
RoundRobinBracket.prototype.constructor = RoundRobinBracket;

module.exports = RoundRobinBracket;
