
module.exports = {

  insertElimination: function (c, eliminationId) {
    return new Promise((resolve, reject) => {
      var queryString = "INSERT INTO eliminations(elimination_id) VALUES("+eliminationId+")";
      c.query(queryString, function(error, rows) {
        if (error) {
          reject(error);
        } else {
          resolve(rows);
        }
      })
    })
  },

  insertEliminationMatch: function(c, eliminationId, match) {
    return new Promise((resolve, reject) => {
      var queryString = "INSERT INTO elimination_matches(elimination_id, match_key, winner_next_match_key)\
      VALUES("+eliminationId+", "+match.key+", "+match.winnerProceeds+")";
      c.query(queryString, function(error, rows) {
        if (error) {
          reject(error);
        } else {
          resolve(rows);
        }
      })
    })
  },

  updateFirstRoundMatch: function(c, eliminationId, matchKey, playerOne, playerTwo) {
    return new Promise((resolve, reject) => {
      var queryString = "UPDATE elimination_matches SET player_one = "+playerOne+", player_two = "+playerTwo+"\
       WHERE elimination_id = "+eliminationId+" AND match_key = "+matchKey+";"
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
