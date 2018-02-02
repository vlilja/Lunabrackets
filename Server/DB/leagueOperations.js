
module.exports = {

// GET OPERATIONS
  getAllLeagues(c) {
    return new Promise((resolve, reject) => {
      const queryString = 'SELECT * FROM leagues';
      c.query(queryString, (error, rows) => {
        if (error) {
          reject(new Error(`[ERROR] getAllLeagues${error}`));
        } else {
          resolve(rows);
        }
      });
    });
  },

  getLeague(c, leagueId) {
    return new Promise((resolve, reject) => {
      const queryString = `SELECT * FROM leagues WHERE id = '${leagueId}'`;
      c.query(queryString, (error, rows) => {
        if (error) {
          reject(new Error(`[ERROR] getLeague${error}`));
        } else {
          resolve(rows);
        }
      });
    });
  },

  getLeaguesBySeason(c, seasonId) {
    return new Promise((resolve, reject) => {
      const queryString = `SELECT * FROM leagues WHERE season_id= ${seasonId}`;
      c.query(queryString, (error, rows) => {
        if (error) {
          reject(new Error(`[ERROR] getLeagueBySeason${error}`));
        } else {
          resolve(rows);
        }
      });
    });
  },

  getLeagueParticipants(c, leagueId) {
    return new Promise((resolve, reject) => {
      const queryString = `SELECT * FROM league_participants INNER JOIN players ON league_participants.player_id = players.id WHERE league_id ='${leagueId}'`;
      c.query(queryString, (error, rows) => {
        if (error) {
          reject(new Error(`[ERROR] getLeagueParticipants${error}`));
        } else {
          resolve(rows);
        }
      });
    });
  },

  getLeagueScoring(c) {
    return new Promise((resolve, reject) => {
      const queryString = 'SELECT * FROM league_scoring';
      c.query(queryString, (error, rows) => {
        if (error) {
          reject(new Error(`[ERROR] getLeagueScoring${error}`));
        } else {
          resolve(rows);
        }
      });
    });
  },

  getLeagueResults(c, leagueId) {
    return new Promise((resolve, reject) => {
      const queryString = `SELECT * FROM league_results WHERE league_id = ${leagueId}`;
      c.query(queryString, (error, rows) => {
        if (error) {
          reject(new Error(`[ERROR] getLeagueResults${error}`));
        } else {
          resolve(rows);
        }
      });
    });
  },

  // /INSERT OPERATIONS

  insertParticipants(c, leagueId, players) {
    const promises = [];
    players.forEach((player) => {
      promises.push(this.insertPlayerToLeague(c, leagueId, player.id, player.handicap));
    });
    return promises;
  },

  insertPlayerToLeague(c, leagueId, playerId, playerHandicap) {
    return new Promise((resolve, reject) => {
      const queryString = `INSERT INTO league_participants(league_id, player_id, handicap) VALUES (${leagueId},${playerId},${playerHandicap})`;
      c.query(queryString, (error, rows) => {
        if (error) {
          reject(new Error(`[ERROR] insertPlayerToLeague${error}`));
        } else {
          resolve(rows.info.insertId);
        }
      });
    });
  },

  insertLeague(c, league) {
    return new Promise((resolve, reject) => {
      const queryString = `INSERT INTO leagues(name, game, season_id) VALUES('${league.name}',${league.game}, ${league.season})`;
      c.query(queryString, (error, rows) => {
        if (error) {
          reject(new Error(`[ERROR] insertLeague${error}`));
        } else {
          console.log(rows);
          resolve(rows.info.insertId);
        }
      });
    });
  },

  insertLeagueResult(c, leagueId, playerId, place, points, bonus) {
    return new Promise((resolve, reject) => {
      const queryString = `INSERT INTO league_results(league_id, player_id, place, points, bonus) VALUES\
    (${leagueId}, ${playerId}, ${place}, ${points}, ${bonus})`;
      c.query(queryString, (error, rows) => {
        if (error) {
          reject(new Error(`[ERROR] insertLeagueResult${error}`));
        } else {
          resolve(rows);
        }
      });
    });
  },

  // UPDATE OPERATIONS
  updateLeagueStageAndRaceTo(c, leagueId, stage, raceTo) {
    return new Promise((resolve, reject) => {
      const queryString = `UPDATE leagues SET stage='${stage}', raceTo = '${raceTo}' WHERE id = '${leagueId}';`;
      c.query(queryString, (error, rows) => {
        if (error) {
          reject(new Error(`[ERROR] updateLeagueStageAndRaceTo${error}`));
        } else {
          resolve(rows);
        }
      });
    });
  },

  updateLeagueStage(c, leagueId, stage) {
    return new Promise((resolve, reject) => {
      const queryString = `UPDATE leagues SET stage='${stage}' WHERE id = '${leagueId}';`;
      c.query(queryString, (error, rows) => {
        if (error) {
          reject(new Error(`[ERROR] updateLeagueStage${error}`));
        } else {
          resolve(rows);
        }
      });
    });
  },

  updatePlayerHandicap(c, leagueId, playerId, handicap) {
    return new Promise((resolve, reject) => {
      const queryString = `UPDATE league_participants SET handicap = '${handicap}' WHERE league_id = '${leagueId}' AND player_id = '${playerId}'`;
      c.query(queryString, (error, rows) => {
        if (error) {
          reject(new Error(`[ERROR] updatePlayerHandicap${error}`));
        } else {
          resolve(rows);
        }
      });
    });
  },


};
