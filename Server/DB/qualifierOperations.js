module.exports ={


  //INSERT OPERATIONS
  insertQualifier: function(c ,leagueId) {
    return new Promise((resolve, reject) => {
      var queryString = "INSERT INTO qualifiers(qualifier_id) VALUES('"+leagueId+"')";
      c.query(queryString, function(error, rows) {
        if (error) {
          reject(error);
        } else {
          resolve(rows.info.insertId);
        }
      })
    })
  },

  insertMatch: function(c, qualifierId, match) {
    return new Promise((resolve, reject) => {
      var queryString = "INSERT INTO qualifier_matches(qualifier_id, match_key, winner_next_match_key, loser_next_match_key)\
         VALUE('" + qualifierId + "','" + match.key + "','" + match.winnerProceeds + "','" + match.loserProceeds + "')";
      c.query(queryString, function(error, rows) {
        if (error) {
          reject(error);
        } else {
          resolve(rows.info.insertId);
        }
      })
    })
  },

  updateFirstRoundMatch(c, qualifierId, matchKey, playerOne, playerTwo) {
    return new Promise((resolve, reject) => {
      var queryString = "UPDATE qualifier_matches SET player_one = "+playerOne+", player_two = "+playerTwo+"\
       WHERE qualifier_id = "+qualifierId+" AND match_key = "+matchKey+";"
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
