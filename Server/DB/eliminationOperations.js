module.exports = {

  insertElimination(c, eliminationId) {
    return new Promise((resolve, reject) => {
      const queryString = `INSERT INTO eliminations(elimination_id) VALUES(${eliminationId})`;
      c.query(queryString, (error, rows) => {
        if (error) {
          reject(new Error(`[ERROR] insertElimination${error}`));
        } else {
          resolve(rows);
        }
      });
    });
  },

  insertEliminationMatch(c, eliminationId, match) {
    return new Promise((resolve, reject) => {
      const queryString = `INSERT INTO elimination_matches(elimination_id, match_key, winner_next_match_key)\
      VALUES(${eliminationId}, ${match.key}, ${match.winnerProceeds})`;
      c.query(queryString, (error, rows) => {
        if (error) {
          reject(new Error(`[ERROR] insertEliminationMatch${error}`));
        } else {
          resolve(rows);
        }
      });
    });
  },

  updateFirstRoundMatch(c, eliminationId, matchKey, playerOne, playerTwo) {
    return new Promise((resolve, reject) => {
      const queryString = `UPDATE elimination_matches SET player_one = ${playerOne}, player_two = ${playerTwo}\
       WHERE elimination_id = ${eliminationId} AND match_key = ${matchKey};`;
      c.query(queryString, (error, rows) => {
        if (error) {
          reject(new Error(`[ERROR] updateFirstRoundMatch${error}`));
        } else {
          resolve(rows.info.insertId);
        }
      });
    });
  },

  updatePlayerOneToMatch(c, eliminationId, matchKey, player) {
    return new Promise((resolve, reject) => {
      const queryString = `UPDATE elimination_matches SET player_one = ${player} WHERE elimination_id = ${eliminationId} AND match_key='${matchKey}';`;
      c.query(queryString, (error, rows) => {
        if (error) {
          reject(new Error(`[ERROR] updatePlayerOneToMatch${error}`));
        } else {
          resolve(rows.info.insertId);
        }
      });
    });
  },

  updatePlayerTwoToMatch(c, eliminationId, matchKey, player) {
    return new Promise((resolve, reject) => {
      const queryString = `UPDATE elimination_matches SET player_two = ${player} WHERE elimination_id = ${eliminationId} AND match_key='${matchKey}';`;
      c.query(queryString, (error, rows) => {
        if (error) {
          reject(new Error(`[ERROR] updatePlayerTwoToMatch${error}`));
        } else {
          resolve(rows.info.insertId);
        }
      });
    });
  },

  updateMatchScore(c, eliminationId, match) {
    return new Promise((resolve, reject) => {
      const queryString = `UPDATE elimination_matches SET player_one_score = ${match.playerOne.score}, player_two_score = ${match.playerTwo.score}, walk_over = ${match.walkOver}, void = ${match.void} WHERE elimination_id = ${eliminationId} AND match_key = '${match.key}';`;
      c.query(queryString, (error, rows) => {
        if (error) {
          reject(new Error(`[ERROR] updateMatchScore${error}`));
        } else {
          resolve(rows.info.insertId);
        }
      });
    });
  },

  getEliminationPlacements(c) {
    return new Promise((resolve, reject) => {
      const queryString = 'SELECT match_key, player_one, player_two FROM elimination_placements;';
      c.query(queryString, (error, rows) => {
        if (error) {
          reject(new Error(`[ERROR] getEliminationPlacements${error}`));
        } else {
          resolve(rows);
        }
      });
    });
  },

  getEliminationMatches(c, leagueId) {
    return new Promise((resolve, reject) => {
      const queryString = `SELECT * FROM elimination_matches WHERE elimination_id = ${leagueId}`;
      c.query(queryString, (error, rows) => {
        if (error) {
          reject(new Error(`[ERROR] getEliminationMatches${error}`));
        } else {
          resolve(rows);
        }
      });
    });
  },

};
