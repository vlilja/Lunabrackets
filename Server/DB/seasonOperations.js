module.exports = {

  // GET OPERATIONS
  getAllSeasons(c) {
    return new Promise((resolve, reject) => {
      const queryString = 'SELECT * FROM seasons';
      c.query(queryString, (error, rows) => {
        if (error) {
          reject(new Error(`[ERROR] getAllSeasons${error}`));
        } else {
          resolve(rows);
        }
      });
    });
  },

  getSeasonById(c, seasonId) {
    return new Promise((resolve, reject) => {
      const queryString = `SELECT * FROM seasons WHERE id = ${seasonId}`;
      c.query(queryString, (error, rows) => {
        if (error) {
          reject(new Error(`[ERROR] getSeasonById${error}`));
        } else {
          resolve(rows);
        }
      });
    });
  },

  getSeasonByName(c, name) {
    return new Promise((resolve, reject) => {
      const queryString = `SELECT * FROM seasons WHERE name = '${name}'`;
      c.query(queryString, (error, rows) => {
        if (error) {
          reject(new Error(`[ERROR] getSeasonByName${error}`));
        } else {
          resolve(rows);
        }
      });
    });
  },

  // INSERT OPERATIONS
  insertSeason(c, season) {
    return new Promise((resolve, reject) => {
      const queryString = `INSERT INTO seasons(name) VALUES ('${season.name}')`;
      c.query(queryString, (error, rows) => {
        if (error) {
          reject(new Error(`[ERROR] insertSeason${error}`));
        } else {
          resolve(rows);
        }
      });
    });
  },

  // UPDATE OPERATIONS
  updateActiveStatus(c, seasonId, active) {
    return new Promise((resolve, reject) => {
      const queryString = `UPDATE seasons SET active = ${active} WHERE id = ${seasonId}`;
      c.query(queryString, (error, rows) => {
        if (error) {
          reject(new Error(`[ERROR] updateActiveStatus${error}`));
        } else {
          resolve(rows);
        }
      });
    });
  },


  // DELETE OPERATIONS


};
