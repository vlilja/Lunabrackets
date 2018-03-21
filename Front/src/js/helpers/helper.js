import phrases from '../../Phrases';
import eightBall from '../../images/8ball.png';
import nineBall from '../../images/9ball.png';
import tenBall from '../../images/10ball.png';
import straightPool from '../../images/rackedballs.jpg';

function findHighestScore(player) {
  let highestScore = 0;
  if (player.leagues) {
    const leagueKeys = Object.keys(player.leagues);
    leagueKeys.forEach((key) => {
      const league = player.leagues[key];
      if (Number(league.points) > highestScore) {
        highestScore = Number(league.points);
      }
    });
  }
  if (player.tournaments) {
    const tournamentKeys = Object.keys(player.tournaments);
    tournamentKeys.forEach((key) => {
      const tournament = player.tournaments[key];
      if (Number(tournament.points) > highestScore) {
        highestScore = Number(tournament.points);
      }
    });
  }
  return highestScore;
}

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

  sortSeasonRanking(a, b) {
    let sortSum = b.sum - a.sum;
    if (sortSum === 0) {
      let aPlayedEvents = 0;
      let bPlayedEvents = 0;
      if (a.leagues) {
        aPlayedEvents += Object.keys(a.leagues).length;
      }
      if (b.leagues) {
        bPlayedEvents += Object.keys(b.leagues).length;
      }
      if (a.tournaments) {
        aPlayedEvents += Object.keys(a.tournaments).length;
      }
      if (b.tournaments) {
        bPlayedEvents += Object.keys(b.tournaments).length;
      }
      if (aPlayedEvents > bPlayedEvents) {
        sortSum = -1;
      } else if (bPlayedEvents > aPlayedEvents) {
        sortSum = 1;
      } else {
        const aHighestScore = findHighestScore(a);
        const bHighestScore = findHighestScore(b);
        if (aHighestScore > bHighestScore) {
          sortSum = -1;
        } else if (bHighestScore > aHighestScore) {
          sortSum = 1;
        }
      }
    }
    return sortSum;
  },

};
