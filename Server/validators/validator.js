const { Match } = require('lunabrackets-datamodel');

module.exports = {

  validateMatch(obj, user) {
    const match = Object.assign(new Match(), obj);
    if (Number.isNaN(Number(match.id))) {
      return false;
    }
    if (!match.playerOne.id || !match.playerTwo.id) {
      return false;
    }
    if (user.admin === '0' && user.id !== match.playerOne.id && user.id !== match.playerTwo.id) {
      return false;
    }
    if (Number.isNaN(Number(match.playerOne.score))) {
      return false;
    }
    if (Number.isNaN(Number(match.playerTwo.score))) {
      return false;
    }
    return true;
  },

};
