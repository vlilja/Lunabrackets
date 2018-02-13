module.exports = {
  getUsers(c, cb) {
    c.query('SELECT * FROM users', (err, rows) => {
      if (err) {
        cb(err);
      } else {
        cb(rows);
      }
    });
  },

  getUserByFb(c, id) {
    return new Promise((resolve, reject) => {
      const queryString = `SELECT * FROM users INNER JOIN players ON users.id = players.id WHERE fb_id = ${id}`;
      c.query(queryString, (error, rows) => {
        if (error) {
          reject(error);
        } else {
          resolve(rows);
        }
      });
    });
  },

  // INSERT OPERATIONS
  insertUser(c, playerId, fbId) {
    return new Promise((resolve, reject) => {
      const queryString = `INSERT INTO users(id, fb_id) VALUES(${playerId}, ${fbId})`;
      c.query(queryString, (error, rows) => {
        if (error) {
          reject(error);
        } else {
          resolve(rows);
        }
      });
    });
  },


};
