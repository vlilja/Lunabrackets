module.exports = {
  getUsers: function(c, cb) {
    c.query('SELECT * FROM users', function(err, rows) {
      if (err) {
        cb(err);
      } else {
        cb(rows);
      }
    })
  }
}
