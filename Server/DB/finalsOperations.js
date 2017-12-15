module.exports = {

  //INSERT OPERATIONS
  insertFinals: function(c, leagueId) {
    return new Promise((resolve, reject) => {
      var queryString = "INSERT INTO finals(finals_id) VALUES('" + leagueId + "')";
      c.query(queryString, function(error, rows) {
        if (error) {
          reject('[ERROR] insertFinals' + error);
        } else {
          resolve(rows.info.insertId);
        }
      })
    })
  },

  insertMatch: function(c, finalsId, match) {
    return new Promise((resolve, reject) => {
      var queryString = "INSERT INTO finals_matches(finals_id, match_key, winner_next_match_key)\
         VALUE('" + finalsId + "','" + match.key + "','" + match.winnerProceeds + "')";
      c.query(queryString, function(error, rows) {
        if (error) {
          reject('[ERROR] insertMatch' + error);
        } else {
          resolve(rows.info.insertId);
        }
      })
    })
  },

  updatePlayerOneToMatch(c, finalsId, matchKey, player) {
    return new Promise((resolve, reject) => {
      var queryString = "UPDATE finals_matches SET player_one = '" + player + "' \
      WHERE finals_id = '" + finalsId + "' AND match_key = '" + matchKey + "'";
      c.query(queryString, function(error, rows) {
        if (error) {
          reject('[ERROR] updatePlayerOneToMatch' + error);
        } else {
          resolve(rows.info.insertId);
        }
      })
    })
  },

  updatePlayerTwoToMatch(c, finalsId, matchKey, player) {
    return new Promise((resolve, reject) => {
      var queryString = "UPDATE finals_matches SET player_two = '" + player + "' \
      WHERE finals_id = '" + finalsId + "' AND match_key = '" + matchKey + "'";
      c.query(queryString, function(error, rows) {
        if (error) {
          reject('[ERROR] updatePlayerTwoToMatch' + error);
        } else {
          resolve(rows.info.insertId);
        }
      })
    })
  },

  updateMatchScore: function(c, finalsId, match) {
    return new Promise((resolve, reject) => {
      var queryString = "UPDATE finals_matches SET player_one_score = "+match.playerOne.score+", player_two_score = "+match.playerTwo.score+" WHERE finals_id = "+finalsId+" AND match_key = '"+match.key+"';";
      c.query(queryString, function(error, rows) {
        if (error) {
          reject('[ERROR] updateMatchScore' + error);
        } else {
          resolve(rows.info.insertId);
        }
      })
    })
  },

  getPlacements(c) {
    return new Promise((resolve, reject) => {
      var queryString = "SELECT match_key, player_one FROM finals_placements;";
      c.query(queryString, function(error, rows) {
        if (error) {
          reject('[ERROR] getPlacements' + error);
        } else {
          resolve(rows);
        }
      })
    })
  },

  getFinalsMatches(c, leagueId) {
    return new Promise((resolve, reject) => {
      var queryString = "SELECT * FROM finals_matches WHERE finals_id = " + leagueId + "";
      c.query(queryString, function(error, rows) {
        if (error) {
          reject('[ERROR] getFinalsMatches' + error);
        } else {
          resolve(rows);
        }
      })
    })
  }


}
