module.exports = function Match(id, key, winnerNextMatchKey, loserNextMatchKey, playerOne, playerTwo, raceTo, walkOver, _void) {
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
  this.void = Number(_void) || 0;

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

  this.setAsVoid = function () {
    this.void = 1;
  }

  this.getResult = function() {
    const p1score = Number(this.playerOne.score);
    const p2score = Number(this.playerTwo.score);
    if (p1score > p2score) {
        return {
          winner: this.playerOne.id,
          loser: this.playerTwo.id
        }
    } else if (p2score > p1score) {
        return {
          winner: this.playerTwo.id,
          loser: this.playerOne.id
        }
    }
    else if(this.walkOver === 1){
      winner = this.playerOne ? this.playerOne.id : this.playerTwo.id;
      return {winner: winner, loser:null}
    }
    else if(this.void === 1) {
      return {winner: null, loser:null};
    }
    else {
      return null;
    }
  }

}
