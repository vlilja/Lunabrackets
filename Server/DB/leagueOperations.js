const transactionManager = require('./transactionManager');

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
  createLeague(c, league, cb) {
    const promise = transactionManager.startTransaction(c);
    // Insert league
    promise.then(() => this.insertLeague(c, league))
      .then(response => this.insertParticipants(c, response.insertId, league))
      .then(() => {
        transactionManager.endTransaction(c, true, cb);
      })
      .catch((error) => {
        console.log(`NOT CALLED${error}`);
        transactionManager.endTransaction(c, false, cb);
      });
  },

  insertParticipants(c, leagueId, league) {
    return new Promise((resolve, reject) => {
      const promises = [];
      while (league.participants.length > 0) {
        const participant = league.participants.pop();
        promises.push(this.insertPlayerToLeague(c, leagueId, participant.id, participant.handicap));
      }
      Promise.all(promises).then(() => {
        resolve();
      })
        .catch((error) => {
          reject(error);
        });
    });
  },

  insertPlayerToLeague(c, leagueId, playerId, playerHandicap) {
    return new Promise((resolve, reject) => {
      const queryString = `INSERT INTO league_participants(league_id, player_id, handicap) VALUES (${leagueId},${playerId},${playerHandicap})`;
      c.query(queryString, (error) => {
        if (error) {
          reject(new Error(`[ERROR] insertPlayerToLeague${error}`));
        } else {
          resolve();
        }
      });
    });
  },

  insertLeague(c, league) {
    return new Promise((resolve, reject) => {
      const queryString = `INSERT INTO leagues(name, game) VALUES('${league.name}',${league.game})`;
      c.query(queryString, (error, rows) => {
        if (error) {
          reject(new Error(`[ERROR] insertLeague${error}`));
        } else {
          resolve(rows.info);
        }
      });
    });
  },

  insertLeagueResult(c, leagueId, playerId, place, points) {
    return new Promise((resolve, reject) => {
      const queryString = `INSERT INTO league_results(league_id, player_id, place, points) VALUES\
    (${leagueId}, ${playerId}, ${place}, ${points})`;
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
