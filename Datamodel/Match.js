module.exports = function Match(id, key, winnerNextMatchKey, loserNextMatchKey, playerOne, playerTwo, raceTo) {
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
  this.getResult = function() {
    if (this.playerOne.score && this.playerTwo.score) {
      if (this.playerOne.score > this.playerTwo.score) {
        return {
          winner: this.playerOne.details,
          loser: this.playerTwo.details
        }
      } else if (this.playerTwo.score > this.playerOne.score) {
        return {
          winner: this.playerTwo.details,
          loser: this.playerOne.details
        }
      } else {
        return null;
      }
    }
  }

}
