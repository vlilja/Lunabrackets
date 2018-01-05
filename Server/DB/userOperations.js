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
};
