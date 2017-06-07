
module.exports = {

  startTransaction: function(c) {
    return new Promise((resolve, reject) => {
      console.log('Starting transaction');
      c.query('START TRANSACTION', function(err, rows) {
        if (err) {
          reject(err);
        } else {
          resolve('Started transaction');
        }
      })
    })
  },

  endTransaction: function(c, success, cb) {
    console.log('Ending transaction');
    if (success) {
      console.log('Ended in success');
      c.query('COMMIT', function(err, rows) {
        if (err) {
          cb(err);
        }
        cb(rows);
      });
    }
    if (!success) {
      console.log('Ended in error');
      c.query('ROLLBACK', function(err, rows) {
        if (err) {
          cb(new Error('Rollback failed'));
        }
        cb(new Error('Transaction failed'));
      });
    }
  }

}
