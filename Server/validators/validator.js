const { Match } = require('lunabrackets-datamodel');

module.exports = {

  validateMatch(obj, user) {
    const match = Object.assign(new Match(), obj);
    if ((match.walkOver === 1 || match.void === 1) && user.admin === '1') {
      return true;
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
