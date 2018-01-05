import phrases from '../../Phrases';

module.exports = {
  determineGameName(id) {
    let gameName;
    switch (id) {
      case '1':
        gameName = phrases.general.games.eight;
        break;
      case '2':
        gameName = phrases.general.games.nine;
        break;
      case '3':
        gameName = phrases.general.games.ten;
        break;
      case '4':
        gameName = phrases.general.games.straight;
        break;
      default:
        break;
    }
    return gameName;
  },

  determineGameIcon(id) {
    let gameName;
    switch (id) {
      case '1':
        gameName = '8ball.png';
        break;
      case '2':
        gameName = '9ball.png';
        break;
      case '3':
        gameName = '10ball.png';
        break;
      case '4':
        gameName = 'rackedballs.jpeg';
        break;
      default:
        break;
    }
    return gameName;
  },
};
