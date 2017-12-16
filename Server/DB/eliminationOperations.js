module.exports = {

  insertElimination: function(c, eliminationId) {
    return new Promise((resolve, reject) => {
      var queryString = "INSERT INTO eliminations(elimination_id) VALUES(" + eliminationId + ")";
      c.query(queryString, function(error, rows) {
        if (error) {
          reject('[ERROR] insertElimination' + error);
        } else {
          resolve(rows);
        }
      })
    })
  },

  insertEliminationMatch: function(c, eliminationId, match) {
    return new Promise((resolve, reject) => {
      var queryString = "INSERT INTO elimination_matches(elimination_id, match_key, winner_next_match_key)\
      VALUES(" + eliminationId + ", " + match.key + ", " + match.winnerProceeds + ")";
      c.query(queryString, function(error, rows) {
        if (error) {
          reject('[ERROR] insertEliminationMatch' + error);
        } else {
          resolve(rows);
        }
      })
    })
  },

  updateFirstRoundMatch: function(c, eliminationId, matchKey, playerOne, playerTwo) {
    return new Promise((resolve, reject) => {
      var queryString = "UPDATE elimination_matches SET player_one = " + playerOne + ", player_two = " + playerTwo + "\
       WHERE elimination_id = " + eliminationId + " AND match_key = " + matchKey + ";"
      c.query(queryString, function(error, rows) {
        if (error) {
          reject('[ERROR] updateFirstRoundMatch' + error);
        } else {
          resolve(rows.info.insertId);
        }
      })
    })
  },

  updatePlayerOneToMatch: function(c, eliminationId, matchKey, player) {
    return new Promise((resolve, reject) => {
      var queryString = "UPDATE elimination_matches SET player_one = " + player + " WHERE elimination_id = " + eliminationId + " AND match_key='" + matchKey + "';";
      c.query(queryString, function(error, rows) {
        if (error) {
          reject('[ERROR] updatePlayerOneToMatch' + error);
        } else {
          resolve(rows.info.insertId);
        }
      })
    })
  },

  updatePlayerTwoToMatch: function(c, eliminationId, matchKey, player) {
    return new Promise((resolve, reject) => {
      var queryString = "UPDATE elimination_matches SET player_two = " + player + " WHERE elimination_id = " + eliminationId + " AND match_key='" + matchKey + "';";
      c.query(queryString, function(error, rows) {
        if (error) {
          reject('[ERROR] updatePlayerTwoToMatch' + error);
        } else {
          resolve(rows.info.insertId);
        }
      })
    })
  },

  updateMatchScore: function(c, eliminationId, match) {
    return new Promise((resolve, reject) => {
      var queryString = "UPDATE elimination_matches SET player_one_score = "+match.playerOne.score+", player_two_score = "+match.playerTwo.score+" WHERE elimination_id = "+eliminationId+" AND match_key = '"+match.key+"';";
      c.query(queryString, function(error, rows) {
        if (error) {
          reject('[ERROR] updateMatchScore' + error);
        } else {
          resolve(rows.info.insertId);
        }
      })
    })
  },

  getEliminationPlacements: function(c) {
    return new Promise((resolve, reject) => {
      var queryString = "SELECT match_key, player_one, player_two FROM elimination_placements;"
      c.query(queryString, function(error, rows) {
        if (error) {
          reject('[ERROR] getEliminationPlacements' + error);
        } else {
          resolve(rows);
        }
      })
    })
  },

  getEliminationMatches: function(c, leagueId) {
    return new Promise((resolve, reject) => {
      var queryString = "SELECT * FROM elimination_matches WHERE elimination_id = " + leagueId + "";
      c.query(queryString, function(error, rows) {
        if (error) {
          reject('[ERROR] getEliminationMatches' + error);
        } else {
          resolve(rows);
        }
      })
    })
  }

}
