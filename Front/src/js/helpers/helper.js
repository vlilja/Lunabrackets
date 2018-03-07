import phrases from '../../Phrases';
import eightBall from '../../images/8ball.png';
import nineBall from '../../images/9ball.png';
import tenBall from '../../images/10ball.png';
import straightPool from '../../images/rackedballs.jpg';

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
    let image;
    switch (id) {
      case '1':
        image = eightBall;
        break;
      case '2':
        image = nineBall;
        break;
      case '3':
        image = tenBall;
        break;
      case '4':
        image = straightPool;
        break;
      default:
        break;
    }
    return image;
  },
};
