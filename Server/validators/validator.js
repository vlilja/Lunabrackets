var Match = require('../../Datamodel').Match;

module.exports = {

  validateMatch: function(obj) {
    var match = Object.assign(new Match(), obj);
    if (isNaN(Number(match.id))) {
      return false;
    }
    if (!match.playerOne.id || !match.playerTwo.id) {
      return false;
    }
    if (isNaN(Number(match.playerOne.score)) || isNaN(Number(match.playerTwo.score))) {
      return false;
    }
    return true;
  }

}
