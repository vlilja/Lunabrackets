module.exports = {
  searchPlayers: function(c, playerName ,cb) {
    c.query("SELECT id, firstName, lastName FROM players WHERE firstName LIKE '" + playerName + "%' OR lastName LIKE '" + playerName + "%'", function(err, rows) {
      if (err) {
        cb(err);
      } else {
        cb(rows);
      }
    })
  },
  getPlayerById: function(c, id, cb) {
    c.query("SELECT * FROM players WHERE id='"+id+"';", function(err, rows) {
      if (err) {
        cb(err);
      } else {
        cb(rows[0]);
      }
    })
  },
  getAllPlayers: function(c, cb) {
    c.query("SELECT id, firstName, lastName, handicap FROM players", function(err, rows) {
      if (err) {
        cb(err);
      } else {
        cb(rows);
      }
    })
  },
  getPlayersByLeagueId: function(c, leagueId, cb) {
    c.query("SELECT player_id, firstName, lastName, league_participants.handicap FROM league_participants INNER JOIN\
     players ON league_participants.player_id = players.id  WHERE league_id = '"+leagueId+"';", function(err, rows) {
      if (err) {
        cb(err);
      } else {
        cb(rows);
      }
    })
  }
}
