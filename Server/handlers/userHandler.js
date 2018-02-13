const db = require('../DB/dbOperations');
const dbClient = require('../DB/dbconnect').initConnection();
const transactionManager = require('../DB/transactionManager');
const logger = require('winston');

function validateUser(user) {
  let valid = true;
  if (!user.firstName && typeof user.firstName !== 'string' && user.firstName.length < 1) {
    valid = false;
  }
  if (!user.lastName && typeof user.lastName !== 'string' && user.lastName.length < 1) {
    valid = false;
  }
  if (!user.fbId) {
    valid = false;
  }
  return valid;
}

module.exports = {


  getUserByFb(id, cb) {
    const promise = db.user.getUserByFb(dbClient, id);
    promise.then((response) => {
      cb(response);
    })
      .catch((error) => {
        logger.error(error);
        cb(new Error(error));
      });
  },

  createUser(user, cb) {
    const valid = validateUser(user);
    if (valid) {
      const promise = transactionManager.startTransaction(dbClient);
      promise.then(() => db.player.insertPlayer(dbClient, user))
        .then(playerId => db.user.insertUser(dbClient, playerId, user.fbId))
        .then(() => {
          transactionManager.endTransaction(dbClient, true, cb);
        })
        .catch((error) => {
          logger.error(error);
          cb(error);
        });
    } else {
      cb(new Error('User details invalid'));
    }
  },

};
