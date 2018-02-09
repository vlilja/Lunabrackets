const db = require('../DB/dbOperations');
const dbClient = require('../DB/dbconnect').initConnection();
const transactionManager = require('../DB/transactionManager');
const logger = require('winston');


module.exports = {

  createTournament(tournament, cb) {
    const promise = db.tournament.createTournament(dbClient, tournament);
    promise.then(() => {
      logger.info('[SUCCESS] createTournament');
      cb('Success');
    })
      .catch((error) => {
        logger.error(error);
        cb(error);
      });
  },

  getTournament(id, cb) {
    const promise = db.tournament.getTournament(dbClient, id);
    promise.then((tournaments) => {
      cb(tournaments);
      logger.info('[SUCCESS] getTournament', `Params: {id + ${id}}`);
    })
      .catch((error) => {
        logger.error(error);
        cb(error);
      });
  },

  getAllTournaments(cb) {
    const promise = db.tournament.getAllTournaments(dbClient);
    promise.then((tournaments) => {
      logger.info('[SUCCESS] getAllTournaments');
      cb(tournaments);
    })
      .catch((error) => {
        logger.error(error);
        cb(error);
      });
  },

  getResults(id, cb) {
    const promise = db.tournament.getTournamentResults(dbClient, id);
    promise.then((results) => {
      logger.info('[SUCCESS] getResults', `Params: {id + ${id}}`);
      cb({ id, results });
    })
      .catch((error) => {
        logger.error(error);
        cb(error);
      });
  },

  completeTournament(tournamentId, results, cb) {
    const promise = transactionManager.startTransaction(dbClient);
    promise.then(() => db.tournament.getTournamentScoring(dbClient))
      .then((scoring) => {
        const promises = [];
        results.forEach((result) => {
          const score = scoring.find((scoreObj) => {
            const places = scoreObj.places.split('-');
            if (places.length === 1) {
              return result.place === Number(places[0]);
            } else if (Number(result.place) >= Number(places[0]) && Number(result.place) <= Number(places[1])) {
              return true;
            }
            return false;
          });
          result.points = score.points;
          promises.push(db.tournament.createResult(dbClient, tournamentId, result));
        });
        return Promise.all(promises);
      })
      .then(() => db.tournament.setComplete(dbClient, tournamentId))
      .then(() => {
        logger.info('[SUCCESS] completeTournament', `Params: {id + ${tournamentId}}`);
        transactionManager.endTransaction(dbClient, true, cb, 'Tournament results created succesfully');
      })
      .catch((error) => {
        logger.error(error);
        transactionManager.endTransaction(dbClient, false, cb);
      });
  },

};
