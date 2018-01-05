
module.exports = {

  startTransaction(c) {
    return new Promise((resolve, reject) => {
      console.log('Starting transaction');
      c.query('START TRANSACTION', (err) => {
        if (err) {
          reject(err);
        } else {
          resolve('Started transaction');
        }
      });
    });
  },

  endTransaction(c, success, cb, response = 0) {
    console.log('Ending transaction');
    if (success && !cb) {
      console.log('Ended in success');
      c.query('COMMIT', (err) => {
        if (err) {
          console.log(err);
        }
        console.log('committed');
      });
    }
    if (success) {
      console.log('Ended in success');
      c.query('COMMIT', (err, rows) => {
        if (err) {
          cb(err);
        }
        cb(rows, response);
      });
    }
    if (!success) {
      console.log('Ended in error');
      c.query('ROLLBACK', (err) => {
        if (err) {
          cb(new Error('Rollback failed'));
        }
        cb(new Error('Transaction failed'));
      });
    }
  },

};
