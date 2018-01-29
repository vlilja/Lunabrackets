const db = require('../DB/dbOperations');
const dbClient = require('../DB/dbconnect').initConnection();
const _ = require('lodash');
const transactionManager = require('../DB/transactionManager');
const groupStageHelper = require('../helpers/groupStageHelper');
const groupHandler = require('./groupHandler');
const qualifierHandler = require('./qualifierHandler');
const finalsHandler = require('./finalsHandler');
const eliminationHandler = require('./eliminationHandler');
const logger = require('winston');
const validator = require('../validators/validator');
const {
  League, Match, Player, Group,
} = require('lunabrackets-datamodel');


// HELPERS
function placePlayersByRanking(leagueId, group, placements) {
  const promises = [];
  console.log(placements);
  group.players.forEach((player) => {
    const ranking = Number(player.ranking);
    if (ranking === 1) {
      const seed = `${group.key}1`;
      const match = placements.finals.find(m => m.player_one === seed);
      promises.push(finalsHandler.updateFinalsMatch(dbClient, leagueId, match.match_key, player.details.id));
    }
    if (ranking > 1 && ranking <= 5) {
      const seed = group.key + player.ranking;
      console.log(seed);
      placements.qualifiers.forEach((match) => {
        if (match.player_one === seed) {
          promises.push(qualifierHandler.updateQualifiersMatch(dbClient, leagueId, match.match_key, player.details.id, null));
        }
        if (match.player_two === seed) {
          promises.push(qualifierHandler.updateQualifiersMatch(dbClient, leagueId, match.match_key, null, player.details.id));
        }
      });
    }
    if (ranking > 5) {
      const seed = group.key + player.ranking;
      console.log(seed);
      placements.elimination.forEach((match) => {
        if (match.player_one === seed) {
          promises.push(eliminationHandler.updateEliminationMatch(dbClient, leagueId, match.match_key, player.details.id, null));
        }
        if (match.player_two === seed) {
          promises.push(eliminationHandler.updateEliminationMatch(dbClient, leagueId, match.match_key, null, player.details.id));
        }
      });
    }
  });
  return promises;
}

module.exports = {

  createLeague(league, cb) {
    const leagueObj = Object.assign(new League(), league);
    const transaction = transactionManager.startTransaction(dbClient);
    transaction.then(() => db.league.insertLeague(dbClient, leagueObj))
      .then(leagueId => Promise.all(db.league.insertParticipants(dbClient, leagueId, leagueObj.players)))
      .then(() => {
        transactionManager.endTransaction(dbClient, true, cb, 'League created successfully');
      })
      .catch((error) => {
        logger.error(error);
        transactionManager.endTransaction(dbClient, false, cb, error);
      });
  },

  startLeague(leagueId, players, groupNames, raceTo, cb) {
    const promise = db.league.getLeague(dbClient, leagueId);
    // validate stage
    promise.then(league => new Promise((resolve, reject) => {
      if (league[0].stage !== 'ready') {
        reject(new Error('League is already started'));
      }
      resolve('ok');
    }))
      .then(() => transactionManager.startTransaction(dbClient))
      .then(() => {
      // Adjust player handicaps
        const promises = [];
        players.forEach((player) => {
          promises.push(db.league.updatePlayerHandicap(dbClient, leagueId, player.id, player.handicap));
        });
        return Promise.all(promises);
      })
      .then(() =>
      // Create groups
        groupHandler.insertGroups(dbClient, leagueId, groupNames))
      .then(insertedGroups =>
      // Shuffle groups
        new Promise((resolve, reject) => {
          const shuffledPlayers = _.shuffle(players);
          const groupOne = new Group(insertedGroups[0]);
          const groupTwo = new Group(insertedGroups[1]);
          const groupThree = new Group(insertedGroups[2]);
          const groupFour = new Group(insertedGroups[3]);
          const groups = [groupOne, groupTwo, groupThree, groupFour];
          for (let i = 0, k = 0; i < shuffledPlayers.length; i += 1) {
            groups[k].players.push(shuffledPlayers[i]);
            k += 1;
            if (k % 4 === 0) {
              k = 0;
            }
          }
          groups.forEach((group) => {
            if (group.players.length === 0) {
              reject(new Error('Missing players from groups'));
            }
          });
          resolve(groups);
        }))
      .then((groups) => {
        let promises = [];
        // Insert group members and matches
        groups.forEach((group) => {
          promises = promises.concat(groupHandler.addGroupMembers(dbClient, group.id, group.players));
          promises = promises.concat(groupHandler.createGroupMatches(dbClient, group.id, group.players));
        });
        return Promise.all(promises);
      })
      .then(() => db.league.updateLeagueStageAndRaceTo(dbClient, leagueId, 'group', raceTo))
      .then(() => {
        logger.info('[SUCCESS]', `Params: {id:${leagueId}}`);
        transactionManager.endTransaction(dbClient, true, cb, 'League started successfully');
      })
      .catch((error) => {
        logger.error(error);
        transactionManager.endTransaction(dbClient, false, cb, error);
      });
  },

  finishLeague(leagueId, cb) {
    const promise = transactionManager.startTransaction(dbClient);
    promise.then(() => {
      const promises = [];
      promises.push(finalsHandler.getFinalsMatches(dbClient, leagueId));
      promises.push(qualifierHandler.getMatches(dbClient, leagueId));
      promises.push(eliminationHandler.getEliminationMatches(dbClient, leagueId));
      promises.push(db.league.getLeagueParticipants(dbClient, leagueId));
      promises.push(db.league.getLeagueScoring(dbClient));
      return Promise.all(promises);
    })
      .then(response => new Promise((resolve, reject) => {
        const places = [];
        const matches = {
          finals: [],
          qualifier: [],
          elimination: [],
        };
        response[0].forEach((match) => {
          const m = new Match(match.id, match.match_key, match.winner_next_match_key, match.loser_next_match_key, match.player_one, match.player_two, null, match.walk_over);
          m.setScore(match.player_one_score, match.player_two_score);
          matches.finals.push(m);
        });
        response[1].forEach((match) => {
          if (match.match_key.match(/^L[0-9]+[0-9]*$/g)) {
            const m = new Match(match.id, match.match_key, match.winner_next_match_key, match.loser_next_match_key, match.player_one, match.player_two, null, match.walk_over);
            m.setScore(match.player_one_score, match.player_two_score);
            matches.qualifier.push(m);
          }
        });
        response[2].forEach((match) => {
          const m = new Match(match.id, match.match_key, match.winner_next_match_key, match.loser_next_match_key, match.player_one, match.player_two, null, match.walk_over);
          m.setScore(match.player_one_score, match.player_two_score);
          matches.elimination.push(m);
        });
        const players = response[3];
        for (let i = 1; i <= players.length; i += 1) {
          places.push(i);
        }
        const scoring = response[4];
        const finalRankings = [];
        // Finals places
        matches.finals.sort((a, b) => Number(b.key) - Number(a.key));
        matches.finals.forEach((match, idx) => {
          const result = match.getResult();
          if (idx === 0) {
            finalRankings.push({
              place: places.shift(),
              player: result.winner,
            });
          }
          finalRankings.push({
            place: places.shift(),
            player: result.loser,
          });
        });
        // Qualifier places
        matches.qualifier.sort((a, b) => Number(b.key.substr(1)) - Number(a.key.substr(1)));
        matches.qualifier.forEach((match) => {
          const result = match.getResult();
          finalRankings.push({
            place: places.shift(),
            player: result.loser,
          });
        });
        // Elimination places
        matches.elimination.sort((a, b) => Number(b.key) - Number(a.key));
        matches.elimination.forEach((match, idx) => {
          const result = match.getResult();
          if (idx === 0) {
            finalRankings.push({
              place: places.shift(),
              player: result.winner,
            });
          }
          finalRankings.push({
            place: places.shift(),
            player: result.loser,
          });
        });
        finalRankings.forEach((rank) => {
          const score = scoring.find((scoreObj) => {
            const placesArray = scoreObj.places.split('-');
            if (placesArray.length === 1) {
              if (rank.place === Number(placesArray[0])) {
                return true;
              }
            } else if (rank.place >= Number(placesArray[0]) && rank.place <= Number(placesArray[1])) {
              return true;
            }
            return false;
          });
          rank.points = score.points;
        });
        if (finalRankings.length !== response[3].length) {
          reject(new Error('Rankings missing'));
        }
        resolve(finalRankings);
      }))
      .then((rankings) => {
        const promises = [];
        rankings.forEach((ranking) => {
          promises.push(db.league.insertLeagueResult(dbClient, leagueId, ranking.player, ranking.place, ranking.points));
        });
        return Promise.all(promises);
      })
      .then(() => db.league.updateLeagueStage(dbClient, leagueId, 'complete'))
      .then((response) => {
        transactionManager.endTransaction(dbClient, true, cb, response);
      })
      .catch((error) => {
        logger.error(error);
        cb(error);
      });
  },

  getLeagues(cb) {
    const promise = db.league.getAllLeagues(dbClient);
    promise.then((response) => {
      logger.log('info', '[SUCCESS] getLeagues');
      const leagues = [];
      response.forEach((league) => {
        leagues.push(new League(league.id, league.name, league.game, null, league.raceTo, league.stage));
      });
      cb(leagues);
    })
      .catch((error) => {
        logger.log('error', error);
        cb(new Error(error));
      });
  },

  getLeague(leagueId, cb) {
    const promises = [db.league.getLeague(dbClient, leagueId), db.league.getLeagueParticipants(dbClient, leagueId)];
    let league;
    Promise.all(promises).then((response) => {
      const leagueArray = response[0];
      const playerArray = response[1];
      const players = [];
      league = new League(leagueArray[0].id, leagueArray[0].name, leagueArray[0].game, null, leagueArray[0].raceTo, leagueArray[0].stage);
      playerArray.forEach((player) => {
        players.push(new Player(player.id, player.firstName, player.lastName, player.nickName, player.handicap));
      });
      league.players = players;
      logger.log('info', '[SUCCESS] getLeague', `Params: {id:${leagueId}}`);
      cb(league);
    })
      .catch((error) => {
        logger.log('error', error);
        cb(new Error(error));
      });
  },

  getResults(leagueId, cb) {
    const promise = db.league.getLeagueResults(dbClient, leagueId);
    promise.then((response) => {
      logger.info('[SUCCESS] getResults', `Params: {id: ${leagueId}}`);
      cb(response);
    })
      .catch((error) => {
        logger.error(error);
        cb(new Error(error));
      });
  },

  getGroups(leagueId, cb) {
    const promise = db.group.getGroupsByLeagueId(dbClient, leagueId);
    const groups = [];
    promise.then((groupArray) => {
      const promises = [];
      groupArray.forEach((group) => {
        promises.push(db.group.getGroupMembersByGroupId(dbClient, group.id, leagueId));
        groups.push(new Group(group.id, group.group_key, group.name, null, null));
      });
      return Promise.all(promises);
    })
      .then((playersByGroup) => {
        groups.forEach((group, idx) => {
          Array.prototype.push.apply(group.players, playersByGroup[idx]);
        });
        logger.log('info', '[SUCCESS] getGroups', `Params: {id:${leagueId}}`);
        cb(groups);
      })
      .catch((error) => {
        logger.log('error', error);
        cb(new Error(error));
      });
  },

  getGroupMatches(leagueId, groupId, cb) {
    const promise = groupHandler.getGroupMatches(dbClient, groupId);
    promise.then((matches) => {
      logger.info('[SUCCESS] getGroupMatches', `Params: {id: ${groupId}}`);
      cb(matches);
    })
      .catch((error) => {
        logger.error(error);
        cb(new Error(error));
      });
  },

  getGroupResults(groupId, cb) {
    const promise = db.group.getGroupResults(dbClient, groupId);
    promise.then((response) => {
      cb(response);
    })
      .catch((error) => {
        cb(error);
      });
  },

  getUndetermined(leagueId, cb) {
    const promise = groupHandler.getUndetermined(dbClient, leagueId);
    promise.then((response) => {
      cb(response);
    })
      .catch((error) => {
        cb(new Error(error));
      });
  },


  updateGroupStageMatch(leagueId, matchObj, cb) {
    const match = Object.assign(new Match(), matchObj);
    if (validator.validateMatch(match)) {
      const promise = db.group.updateGroupStageMatch(dbClient, leagueId, match);
      promise.then((response) => {
        logger.info('[SUCCESS] updateGroupStageMatch', `Params: {leagueId: ${leagueId}, matchId: ${match.id}}`);
        cb(response);
      })
        .catch((error) => {
          cb(new Error(error));
        });
    } else {
      cb(new Error('Match object not valid'));
    }
  },

  fixUndeterminedRankings(leagueId, group, cb) {
    console.log(group);
    const promise = transactionManager.startTransaction(dbClient);
    promise.then(() => groupHandler.fixUndeterminedRankings(dbClient, leagueId, group))
      .then(() => {
        // Get placements
        const promises = [];
        promises.push(finalsHandler.getPlacements(dbClient));
        promises.push(qualifierHandler.getPlacements(dbClient));
        promises.push(eliminationHandler.getPlacements(dbClient));
        return Promise.all(promises);
      })
      .then((response) => {
        const placements = {
          finals: response[0],
          qualifiers: response[1],
          elimination: response[2],
        };
        const promises = placePlayersByRanking(leagueId, group, placements);
        return Promise.all(promises);
      })
      .then(() => {
        transactionManager.endTransaction(dbClient, true, cb, 'Undetermined fixed successfully');
      })
      .catch((error) => {
        logger.error(error);
        transactionManager.endTransaction(dbClient, false, cb, 'Error fixing Undetermined');
      });
  },

  // Qualifier stage
  startQualifiers(leagueId, cb) {
    const rankedGroups = [];
    const promise = transactionManager.startTransaction(dbClient);
    promise.then(() =>
      // Create qualifier
      qualifierHandler.createQualifier(dbClient, leagueId))
      .then(() => qualifierHandler.createQualifierMatches(dbClient, leagueId))
      .then(() =>
        // Create finals
        finalsHandler.createFinals(dbClient, leagueId))
      .then(() => finalsHandler.createFinalsMatches(dbClient, leagueId))
      .then(() => eliminationHandler.createElimination(dbClient, leagueId))
      .then(() => eliminationHandler.createEliminationMatches(dbClient, leagueId))
      .then(() =>
        // Get groups
        groupHandler.getGroups(dbClient, leagueId)
          .then((response) => {
            // Get group matches and players
            response.forEach((group) => {
              rankedGroups.push(group);
            });
            const promises = [];
            response.forEach((group) => {
              promises.push(groupHandler.getGroupMatches(dbClient, group.id));
              promises.push(groupHandler.getGroupMembers(dbClient, group.id, leagueId));
            });
            return Promise.all(promises);
          })
          .then(response =>
            // Resolve group rankings
            new Promise((resolve) => {
              const groups = [];
              for (let i = 0, k = 0; i < response.length; i += 2, k += 1) {
                const matches = response[i];
                const players = response[i + 1];
                groups.push(groupStageHelper.determineRankings(matches, players));
              }
              resolve(groups);
            }))
          .then((groups) => {
            let promises = [];
            rankedGroups.forEach((group, idx) => {
              group.players = groups[idx];
              promises = promises.concat(groupHandler.updatePlayerGroupRankings(dbClient, group));
            });
            return Promise.all(promises);
          })
          .then(() => {
            const promises = [];
            // Get placements
            promises.push(finalsHandler.getPlacements(dbClient));
            promises.push(qualifierHandler.getPlacements(dbClient));
            promises.push(eliminationHandler.getPlacements(dbClient));
            return Promise.all(promises);
          })
          .then((response) => {
            const finalsPlacements = response[0];
            const qualifierPlacements = response[1];
            const eliminationPlacements = response[2];
            rankedGroups.forEach((group) => {
              group.placements = groupStageHelper.determinePlacements(group);
            });
            let promises = [];
            // Groups by group keys
            const groupA = rankedGroups.find(group => group.group_key === 'A');
            const groupB = rankedGroups.find(group => group.group_key === 'B');
            const groupC = rankedGroups.find(group => group.group_key === 'C');
            const groupD = rankedGroups.find(group => group.group_key === 'D');
            // Set group winners to finals
            const finalsPromises = finalsHandler.updatePlayersToFinal(dbClient, leagueId, finalsPlacements, groupA.placements.toFinals, groupB.placements.toFinals, groupC.placements.toFinals, groupD.placements.toFinals);
            promises = promises.concat(finalsPromises);
            // Set players to qualifiers
            const qualifierPromises = qualifierHandler.updatePlayersToQualifier(dbClient, leagueId, qualifierPlacements, groupA.placements.toQualifiers, groupB.placements.toQualifiers, groupC.placements.toQualifiers, groupD.placements.toQualifiers);
            promises = promises.concat(qualifierPromises);
            // Set players to elimination
            const eliminationPromises = eliminationHandler.updatePlayersToElimination(dbClient, leagueId, eliminationPlacements, groupA.placements.toElimination, groupB.placements.toElimination, groupC.placements.toElimination, groupD.placements.toElimination);
            promises = promises.concat(eliminationPromises);
            // Set undetermined
            const undetermined = groupHandler.createUndetermined(dbClient, leagueId, groupA.placements.undetermined, groupB.placements.undetermined, groupC.placements.undetermined, groupD.placements.undetermined);
            promises = promises.concat(undetermined);
            return Promise.all(promises);
          })
          .then(() => db.league.updateLeagueStage(dbClient, leagueId, 'qualifiers'))
          .then(() => {
            logger.info('[SUCCESS] startQualifiers', `Params: {leagueId: ${leagueId}}`);
            transactionManager.endTransaction(dbClient, true, cb);
          })
          .catch((error) => {
            logger.error(error);
            transactionManager.endTransaction(dbClient, false, (value) => {
              console.log(value);
            });
          }));
  },

  startFinals(leagueId, cb) {
    const promise = transactionManager.startTransaction(dbClient);
    promise.then(() => qualifierHandler.getMatches(dbClient, leagueId))
      .then((matches) => {
        let players = [];
        matches.forEach((match) => {
          if (match.match_key === 'B1' || match.match_key === 'B2' || match.match_key === 'L11' || match.match_key === 'L12') {
            if (Number(match.player_one_score) > Number(match.player_two_score)) {
              players.push(match.player_one);
            } else {
              players.push(match.player_two);
            }
          }
        });
        const promises = [];
        players = _.shuffle(players);
        players.forEach((player, idx) => {
          promises.push(finalsHandler.updateFinalsMatch(dbClient, leagueId, idx + 1, null, player));
        });
        if (promises.length !== 4) {
          throw new Error('Error starting Finals, players missing');
        }
        return Promise.all(promises);
      })
      .then(() => db.league.updateLeagueStage(dbClient, leagueId, 'finals'))
      .then(() => {
        transactionManager.endTransaction(dbClient, true, cb);
      })
      .catch((error) => {
        console.log(error);
        transactionManager.endTransaction(dbClient, false, cb, error);
      });
  },

  getQualifierMatches(leagueId, cb) {
    const promise = qualifierHandler.getMatches(dbClient, leagueId);
    promise.then((response) => {
      const matches = [];
      response.forEach((match) => {
        const m = new Match(match.id, match.match_key, match.winner_next_match_key, match.loser_next_match_key, match.player_one, match.player_two);
        m.setScore(match.player_one_score, match.player_two_score);
        matches.push(m);
      });
      logger.info('[SUCCESS] getQualifierMatches', `Params: {leagueId: ${leagueId}}`);
      cb(matches);
    })
      .catch((error) => {
        logger.error(error);
        cb(new Error(error));
      });
  },

  updateQualifierBracket(leagueId, matchObj, cb) {
    const match = Object.assign(new Match(), matchObj);
    const promise = transactionManager.startTransaction(dbClient);
    promise.then(() => {
      const promises = qualifierHandler.updateBracket(dbClient, leagueId, match);
      return Promise.all(promises);
    })
      .then((response) => {
        logger.info('[SUCCESS] updateQualifierBracket', `Params: {leagueId: ${leagueId}, matchId: ${match.id}}`);
        transactionManager.endTransaction(dbClient, true, cb, response);
      })
      .catch((error) => {
        logger.error(error);
        transactionManager.endTransaction(dbClient, false, cb);
      });
  },

  // ELIMINATION

  getEliminationMatches(leagueId, cb) {
    const promise = eliminationHandler.getEliminationMatches(dbClient, leagueId);
    promise.then((response) => {
      const matches = [];
      response.forEach((match) => {
        const m = new Match(match.id, match.match_key, match.winner_next_match_key, match.loser_next_match_key, match.player_one, match.player_two, null, match.walk_over);
        m.setScore(match.player_one_score, match.player_two_score);
        matches.push(m);
      });
      logger.info('[SUCCESS] getEliminationMatches', `Params: {leagueId: ${leagueId}}`);
      cb(matches);
    })
      .catch((error) => {
        logger.error(error);
        cb(new Error(error));
      });
  },

  updateEliminationBracket(leagueId, matchObj, cb) {
    const match = Object.assign(new Match(), matchObj);
    const promise = transactionManager.startTransaction(dbClient);
    promise.then(() => {
      const promises = eliminationHandler.updateBracket(dbClient, leagueId, match);
      return Promise.all(promises);
    })
      .then((response) => {
        logger.info('[SUCCESS] updateEliminationBracket', `Params: {leagueId: ${leagueId}, matchId: ${match.id}}`);
        transactionManager.endTransaction(dbClient, true, cb, response);
      })
      .catch((error) => {
        logger.error(error);
        transactionManager.endTransaction(dbClient, false, cb);
      });
  },

  // FINALS
  getFinalsMatches(leagueId, cb) {
    const promise = finalsHandler.getFinalsMatches(dbClient, leagueId);
    promise.then((response) => {
      const matches = [];
      response.forEach((match) => {
        const m = new Match(match.id, match.match_key, match.winner_next_match_key, match.loser_next_match_key, match.player_one, match.player_two, null, match.walk_over);
        m.setScore(match.player_one_score, match.player_two_score);
        matches.push(m);
      });
      cb(matches);
    })
      .catch((error) => {
        console.log(error);
        cb(new Error(error));
      });
  },

  updateFinalsBracket(leagueId, matchObj, cb) {
    const match = Object.assign(new Match(), matchObj);
    const promise = transactionManager.startTransaction(dbClient);
    promise.then(() => {
      const promises = finalsHandler.updateBracket(dbClient, leagueId, match);
      return Promise.all(promises);
    })
      .then((response) => {
        logger.info('[SUCCESS] updateFinalsBracket', `Params: {leagueId: ${leagueId}, matchId: ${match.id}}`);
        transactionManager.endTransaction(dbClient, true, cb, response);
      })
      .catch((error) => {
        logger.error(error);
        transactionManager.endTransaction(dbClient, false, cb);
      });
  },


};
