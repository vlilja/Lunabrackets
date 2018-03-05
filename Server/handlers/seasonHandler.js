const db = require('../DB/dbOperations');
const logger = require('winston');
const { Season, League, Tournament } = require('lunabrackets-datamodel');
const userHandler = require('./userHandler');

const dbClient = require('../DB/dbconnect').initConnection();

function isAdmin(id) {
  return userHandler.getUserById(id)
    .then(user => new Promise((resolve, reject) => {
      if (user.admin !== '1') {
        reject(new Error('User not admin'));
      }
      resolve();
    }));
}

module.exports = {

  getAllSeasons(cb) {
    const promise = db.season.getAllSeasons(dbClient);
    promise.then((data) => {
      const seasons = [];
      data.forEach((season) => {
        seasons.push(Object.assign(new Season(), season));
      });
      cb(seasons);
    })
      .catch((error) => {
        logger.error(error);
        cb(error);
      });
  },

  getSeason(seasonId, cb) {
    const promises = [];
    promises.push(db.season.getSeasonById(dbClient, seasonId));
    promises.push(db.league.getLeaguesBySeason(dbClient, seasonId));
    promises.push(db.tournament.getTournamentsBySeasonId(dbClient, seasonId));
    Promise.all(promises).then((response) => {
      const seasons = [];
      response[0].forEach((season) => {
        seasons.push(Object.assign(new Season(), season));
      });
      const leagues = [];
      response[1].forEach((league) => {
        leagues.push(Object.assign(new League(), league));
      });
      const tournaments = [];
      response[2].forEach((tournament) => {
        tournaments.push(Object.assign(new Tournament(), tournament));
      });
      seasons[0].leagues = leagues;
      seasons[0].tournaments = tournaments;
      cb(seasons);
    })
      .catch((error) => {
        logger.error(error);
        cb(error);
      });
  },

  createSeason(season, userId, cb) {
    const seasonObj = Object.assign(new Season(), season);
    const promise = isAdmin(userId);
    promise.then(() => {
      if (season.name) {
        return db.season.getSeasonByName(dbClient, season.name);
      }
      throw new Error('Season name missing');
    })
      .then((response) => {
        if (response.length !== 0) {
          throw new Error('Season with that name already exists');
        }
        return db.season.insertSeason(dbClient, seasonObj);
      })
      .then(() => {
        cb('Season created successfully');
      })
      .catch((error) => {
        logger.error(error);
        cb(error);
      });
  },

  setActive(seasonId, userId, cb) {
    const promise = isAdmin(userId);
    promise.then(() => db.season.updateActiveStatus(dbClient, seasonId, 1))
      .then(() => {
        cb('Season set active');
      })
      .catch((error) => {
        logger.error(error);
        cb(error);
      });
  },

  setInactive(seasonId, userId, cb) {
    const promise = isAdmin(userId);
    promise.then(() => db.season.updateActiveStatus(dbClient, seasonId, 0))
      .then(() => {
        cb('Season set inactive');
      })
      .catch((error) => {
        logger.error(error);
        cb(error);
      });
  },

};
