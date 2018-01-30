module.exports = function Match(id, key, winnerNextMatchKey, loserNextMatchKey, playerOne, playerTwo, raceTo, walkOver) {
  this.id = id;
  this.key = key || '';
  this.winnerNextMatchKey = winnerNextMatchKey || '';
  this.loserNextMatchKey = loserNextMatchKey || '';
  this.raceTo = '';
  this.playerOne = {
    id: playerOne || '',
    details: '',
    score: ''
  }
  this.playerTwo = {
    id: playerTwo || '',
    details: '',
    score: ''
  }
  this.walkOver = Number(walkOver) || 0;

  this.isMatchNumEven = function() {
    var even = false;
    var num = Number(this.key);
    if (isNaN(num)) {
      num = Number(num.substr(1));
    }
    if (num % 2 === 0) {
      even = true
    }
    return even;
  }

  this.setPlayerOne = function(player) {
    if (player instanceof Player) {
      this.playerOne.details = player;
    }
  }
  this.setPlayerTwo = function(player) {
    if (player instanceof Player) {
      this.playerTwo.details = player;
    }
  }
  this.setScore = function(pOne, pTwo) {
    this.playerOne.score = pOne;
    this.playerTwo.score = pTwo;
  }

  this.setAsWalkOver = function() {
    this.walkOver = 1;
  }

  this.getResult = function() {
    if (this.playerOne.score && this.playerTwo.score) {
      if (Number(this.playerOne.score) > Number(this.playerTwo.score)) {
        return {
          winner: this.playerOne.id,
          loser: this.playerTwo.id
        }
      } else if (Number(this.playerTwo.score) > Number(this.playerOne.score)) {
        return {
          winner: this.playerTwo.id,
          loser: this.playerOne.id
        }
      } else {
        return null;
      }
    }
    else if(this.walkOver === 1){
      winner = this.playerOne ? this.playerOne.id : this.playerTwo.id;
      return {winner: winner, loser:null}
    }
  }

}
