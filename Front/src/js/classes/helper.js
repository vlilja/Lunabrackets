import phrases from "../../Phrases";

module.exports = {
  determineGameName: function(id) {
    var gameName;
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
  }
}
