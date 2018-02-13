module.exports = {
  searchPlayers(c, playerName, cb) {
    c.query(`SELECT id, firstName, lastName, nickName FROM players WHERE firstName LIKE '${playerName}%' OR lastName LIKE '${playerName}%'`, (err, rows) => {
      if (err) {
        cb(err);
      } else {
        cb(rows);
      }
    });
  },
  getPlayerById(c, id, cb) {
    c.query(`SELECT * FROM players WHERE id='${id}';`, (err, rows) => {
      if (err) {
        cb(err);
      } else {
        cb(rows[0]);
      }
    });
  },
  getAllPlayers(c, cb) {
    c.query('SELECT id, firstName, lastName, nickName, handicap FROM players', (err, rows) => {
      if (err) {
        cb(err);
      } else {
        cb(rows);
      }
    });
  },
  getPlayersByLeagueId(c, leagueId, cb) {
    c.query(`SELECT player_id, firstName, lastName, league_participants.handicap FROM league_participants INNER JOIN\
     players ON league_participants.player_id = players.id  WHERE league_id = '${leagueId}';`, (err, rows) => {
      if (err) {
        cb(err);
      } else {
        cb(rows);
      }
    });
  },
  // INSERT OPERATIONS
  insertPlayer(c, player) {
    return new Promise((resolve, reject) => {
      const { firstName, lastName, nickName } = player;
      const queryString = `INSERT INTO players(firstName, lastName, nickName) VALUES('${firstName}', '${lastName}', '${nickName}')`;
      c.query(queryString, (error, rows) => {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          resolve(rows.info.insertId);
        }
      });
    });
  },
};
