
module.exports = function Bracket(matches, players, size) {
  this.matches = matches || [];
  this.players = players || [];
  this.size = size;
  addPlayerDetailsToMatches(this.matches, this.players);
}

function addPlayerDetailsToMatches(matches, players) {
  players.forEach((player) => {
    matches.forEach((match) => {
      if(match.playerOne.id === player.id){
        match.playerOne.details = player;
      }
      if(match.playerTwo.id === player.id){
        match.playerTwo.details = player;
      }
    })
  })
}
