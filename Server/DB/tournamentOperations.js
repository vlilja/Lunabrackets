

module.exports = {

  // GET OPERATIONS
  getAllTournaments(c) {
    return new Promise((resolve, reject) => {
      const queryString = 'SELECT * FROM tournaments';
      c.query(queryString, (error, rows) => {
        if (error) {
          reject(new Error(`[ERROR] getAllTournaments${error}`));
        } else {
          resolve(rows);
        }
      });
    });
  },

  getTournament(c, id) {
    return new Promise((resolve, reject) => {
      const queryString = `SELECT * FROM tournaments WHERE id=${id}`;
      c.query(queryString, (error, rows) => {
        if (error) {
          reject(new Error(`[ERROR] getTournament${error}`));
        } else {
          resolve(rows);
        }
      });
    });
  },

  getTournamentScoring(c) {
    return new Promise((resolve, reject) => {
      const queryString = 'SELECT * FROM tournament_scoring';
      c.query(queryString, (error, rows) => {
        if (error) {
          reject(new Error(`[ERROR] getTournamentScoring${error}`));
        } else {
          resolve(rows);
        }
      });
    });
  },

  getTournamentResults(c, id) {
    return new Promise((resolve, reject) => {
      const queryString = `SELECT * FROM tournament_results WHERE tournament_id=${id}`;
      c.query(queryString, (error, rows) => {
        if (error) {
          reject(new Error(`[ERROR] getTournamentResults${error}`));
        } else {
          resolve(rows);
        }
      });
    });
  },

  getTournamentsBySeasonId(c, seasonId) {
    return new Promise((resolve, reject) => {
      const queryString = `SELECT * FROM tournaments WHERE season = ${seasonId}`;
      c.query(queryString, (error, rows) => {
        if (error) {
          reject(new Error(`[ERROR] getTournamentsBySeasonId${error}`));
        } else {
          resolve(rows);
        }
      });
    });
  },

  // INSERT & UPDATE
  createTournament(c, tournament) {
    return new Promise((resolve, reject) => {
      const { name, game, season } = tournament;
      const queryString = `INSERT INTO tournaments(name, game, season) VALUES('${name}', ${game}, ${season})`;
      c.query(queryString, (error, rows) => {
        if (error) {
          reject(new Error(`[ERROR] createTournament${error}`));
        } else {
          resolve(rows);
        }
      });
    });
  },

  setComplete(c, tournamentId) {
    return new Promise((resolve, reject) => {
      const queryString = `UPDATE tournaments SET status='complete' WHERE id=${tournamentId}`;
      c.query(queryString, (error, rows) => {
        if (error) {
          reject(new Error(`[ERROR] setComplete${error}`));
        } else {
          resolve(rows);
        }
      });
    });
  },

  createResult(c, tournamentId, result) {
    return new Promise((resolve, reject) => {
      const { playerId, place, points } = result;
      const queryString = `INSERT INTO tournament_results(tournament_id, player_id, place, points)\
       VALUES('${tournamentId}', ${playerId}, ${place}, ${points})`;
      c.query(queryString, (error, rows) => {
        if (error) {
          reject(new Error(`[ERROR] createResults${error}`));
        } else {
          resolve(rows);
        }
      });
    });
  },


};
