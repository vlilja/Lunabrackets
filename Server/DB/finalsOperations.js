module.exports ={

  //INSERT OPERATIONS
  insertFinals: function(c ,leagueId) {
    return new Promise((resolve, reject) => {
      var queryString = "INSERT INTO finals(finals_id) VALUES('"+leagueId+"')";
      c.query(queryString, function(error, rows) {
        if (error) {
          reject(error);
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
          reject(error);
        } else {
          resolve(rows.info.insertId);
        }
      })
    })
  },

  insertGroupWinnerToFinal(c, finalsId, playerOne, match_key) {
    return new Promise((resolve, reject) => {
      var queryString = "UPDATE finals_matches SET player_one = '"+playerOne+"' \
      WHERE finals_id = '"+finalsId+"' AND match_key = '"+match_key+"'";
      c.query(queryString, function(error, rows) {
        if (error) {
          reject(error);
        } else {
          resolve(rows.info.insertId);
        }
      })
    })
  }

}
