const db = require('../DB/dbOperations');
const dbClient = require('../DB/dbconnect').initConnection();
const _ = require('lodash');
const transactionManager = require('../DB/transactionManager');
const groupStageHelper = require('../helpers/groupStageHelper');
const groupHandler = require('./groupHandler');
const qualifierHandler = require('./qualifierHandler');
const finalsHandler = require('./finalsHandler');
const eliminationHandler = require('./eliminationHandler');
const userHandler = require('./userHandler');
const logger = require('winston');
const validator = require('../validators/validator');
const {
  League, Match, Player, Group,
} = require('lunabrackets-datamodel');


// HELPERS
function placePlayersByRanking(leagueId, group, placements) {
  const promises = [];
  group.players.forEach((player) => {
    const ranking = Number(player.ranking);
    if (ranking === 1) {
      const seed = `${group.key}1`;
      const match = placements.finals.find(m => m.player_one === seed);
      promises.push(finalsHandler.updateFinalsMatch(dbClient, leagueId, match.match_key, player.details.id));
    }
    if (ranking > 1 && ranking <= 5) {
      const seed = group.key + player.ranking;
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

function checkForSubsitutes(grpWinners, matches) {
  const finalsPlayers = [];
  let subbedPlayers = [];
  const subbingPlayers = [];
  let filteredGrpWinners = grpWinners;
  matches.finals.forEach((m) => {
    if (Number(m.key) < 5) {
      filteredGrpWinners = filteredGrpWinners.filter(p => p !== m.playerOne.id);
      finalsPlayers.push(m.playerOne.id);
      finalsPlayers.push(m.playerTwo.id);
    }
  });
  subbedPlayers = filteredGrpWinners;
  matches.qualifiers.forEach((m) => {
    if (m.key.match(/L11|L12|B1|B2/)) {
      const result = m.getResult();
      const winner = finalsPlayers.find(p => p === result.winner);
      if (!winner) {
        subbedPlayers.push(result.winner);
      }
    }
    if (m.key.match(/L.*/)) {
      const result = m.getResult();
      const player = finalsPlayers.find(p => p === result.loser);
      if (player) {
        subbingPlayers.push(player);
      }
    }
  });
  return { substituted: subbedPlayers, substituting: subbingPlayers };
}

function scoreLeague(grpWinners, matches, players, scoring) {
  console.log(players.length);
  let finalRankings = [];
  const subs = checkForSubsitutes(grpWinners, matches);
  console.log(subs);
  const places = [];
  players.forEach((p, idx) => {
    places.push(idx + 1);
  });
  // Sort all matches to numerical order
  matches.finals.sort((a, b) => Number(b.key) - Number(a.key));
  matches.qualifiers = matches.qualifiers.filter(m => m.key.match(/L.*/));
  matches.qualifiers.sort((a, b) => Number(b.key.substr(1)) - Number(a.key.substr(1)));
  matches.elimination.sort((a, b) => Number(b.key) - Number(a.key));
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
  matches.qualifiers.forEach((match) => {
    const result = match.getResult();
    finalRankings.push({
      place: places.shift(),
      player: result.loser,
    });
  });
  matches.elimination.forEach((match, idx) => {
    const result = match.getResult();
    if (idx === 0) {
      finalRankings.push({
        place: places.shift(),
        player: result.winner,
      });
    }
    if (match.walkOver !== 1) {
      finalRankings.push({
        place: places.shift(),
        player: result.loser,
      });
    }
  });
  finalRankings = finalRankings.filter((r) => {
    if (r.place && r.player) {
      return true;
    }
    return false;
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
  // Fix subbed points
  if (subs.substituting.length > 0) {
    subs.substituting.forEach((player) => {
      const placement = finalRankings.find(place => place.player === player);
      if (placement.place < 5) {
        const scndPlacement = finalRankings.find(place => place.player === player && place.place !== placement.place);
        scndPlacement.points = scoring.find(scoreObj => scoreObj.places === '5-8').points;
        scndPlacement.player = subs.substituted.pop();
      } else {
        placement.player = subs.substituted.pop();
      }
    });
  }
  // Mark bonuses
  finalRankings.forEach((ranking) => {
    let bonus = 1;
    matches.group.forEach((m) => {
      if (m.playerOne.id === ranking.player || m.playerTwo.id === ranking.player) {
        if (!m.getResult()) {
          bonus = 0;
        }
      }
    });
    ranking.bonus = bonus;
  });
  return finalRankings;
}

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

  createLeague(league, id, cb) {
    const leagueObj = Object.assign(new League(), league);
    const transaction = transactionManager.startTransaction(dbClient);
    transaction.then(() => isAdmin(id))
      .then(() => db.league.insertLeague(dbClient, leagueObj))
      .then(leagueId => Promise.all(db.league.insertParticipants(dbClient, leagueId, leagueObj.players)))
      .then(() => {
        transactionManager.endTransaction(dbClient, true, cb, 'League created successfully');
      })
      .catch((error) => {
        logger.error(error);
        transactionManager.endTransaction(dbClient, false, cb, error);
      });
  },

  startLeague(leagueId, players, groupNames, raceTo, id, cb) {
    const promise = db.league.getLeague(dbClient, leagueId);
    // validate stage
    promise.then(league => new Promise((resolve, reject) => {
      if (league[0].stage !== 'ready') {
        reject(new Error('League is already started'));
      }
      resolve('ok');
    }))
      .then(() => transactionManager.startTransaction(dbClient))
      .then(() => isAdmin(id))
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

  finishLeague(leagueId, id, cb) {
    const promise = transactionManager.startTransaction(dbClient);
    promise.then(() => isAdmin(id))
      .then(() => groupHandler.getGroups(dbClient, leagueId))
      .then((groups) => {
        const promises = [];
        groups.forEach((group) => {
          promises.push((groupHandler.getGroupMembers(dbClient, group.id, leagueId)));
        });
        promises.push(finalsHandler.getFinalsMatches(dbClient, leagueId));
        promises.push(qualifierHandler.getMatches(dbClient, leagueId));
        promises.push(eliminationHandler.getEliminationMatches(dbClient, leagueId));
        promises.push(db.league.getLeagueParticipants(dbClient, leagueId));
        promises.push(db.league.getLeagueScoring(dbClient));
        groups.forEach((group) => {
          promises.push((groupHandler.getGroupMatches(dbClient, group.id)));
        });
        return Promise.all(promises);
      })
      .then(response => new Promise((resolve, reject) => {
        const grpWinners = [];
        for (let i = 0; i < 4; i += 1) {
          response[i].forEach((grpMember) => {
            if (grpMember.place === '1') {
              grpWinners.push(grpMember.id);
            }
          });
        }
        const matches = {
          finals: [],
          qualifiers: [],
          elimination: [],
          group: [],
        };
        response[4].forEach((match) => {
          const m = new Match(match.id, match.match_key, match.winner_next_match_key, match.loser_next_match_key, match.player_one, match.player_two, null, match.walk_over, match.void);
          m.setScore(match.player_one_score, match.player_two_score);
          matches.finals.push(m);
        });
        response[5].forEach((match) => {
          if (match.match_key.match(/(^L[0-9]+[0-9]*$)|B1|B2/g)) {
            const m = new Match(match.id, match.match_key, match.winner_next_match_key, match.loser_next_match_key, match.player_one, match.player_two, null, match.walk_over, match.void);
            m.setScore(match.player_one_score, match.player_two_score);
            matches.qualifiers.push(m);
          }
        });
        response[6].forEach((match) => {
          const m = new Match(match.id, match.match_key, match.winner_next_match_key, match.loser_next_match_key, match.player_one, match.player_two, null, match.walk_over, match.void);
          m.setScore(match.player_one_score, match.player_two_score);
          matches.elimination.push(m);
        });
        for (let i = 9; i < response.length; i += 1) {
          response[i].forEach((m) => {
            matches.group.push(m);
          });
        }
        const finalRankings = scoreLeague(grpWinners, matches, response[7], response[8]);
        console.log(finalRankings.length);
        console.log(response[7].length);
        if (finalRankings.length !== response[7].length) {
          reject(new Error('Rankings missing'));
        }
        resolve(finalRankings);
      }))
      .then((rankings) => {
        const promises = [];
        rankings.forEach((ranking) => {
          promises.push(db.league.insertLeagueResult(dbClient, leagueId, ranking.player, ranking.place, ranking.points, ranking.bonus));
        });
        return Promise.all(promises);
      })
      .then(() => db.league.updateLeagueStage(dbClient, leagueId, 'complete'))
      .then(() => {
        logger.info('[SUCCESS] finishLeague', `Params:{leagueId:${leagueId}}`);
        transactionManager.endTransaction(dbClient, true, cb);
      })
      .catch((error) => {
        logger.error(error);
        transactionManager.endTransaction(dbClient, false, cb);
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
      cb({ id: leagueId, results: response });
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


  updateGroupStageMatch(leagueId, matchObj, userId, cb) {
    const match = Object.assign(new Match(), matchObj);
    const promise = db.user.getUser(dbClient, userId);
    promise.then(user => new Promise((resolve, reject) => {
      if (validator.validateMatch(match, user)) {
        resolve();
      }
      reject(new Error('Match not valid'));
    })).then(() => db.group.updateGroupStageMatch(dbClient, leagueId, match))
      .then((response) => {
        logger.info('[SUCCESS] updateGroupStageMatch', `Params: {leagueId: ${leagueId}, matchId: ${match.id}}`);
        cb(response);
      })
      .catch((error) => {
        cb(new Error(error));
      });
  },

  fixUndeterminedRankings(leagueId, group, id, cb) {
    const promise = transactionManager.startTransaction(dbClient);
    promise.then(() => isAdmin(id))
      .then(() => groupHandler.fixUndeterminedRankings(dbClient, leagueId, group))
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
  startQualifiers(leagueId, id, cb) {
    const rankedGroups = [];
    const promise = transactionManager.startTransaction(dbClient);
    promise.then(() => isAdmin(id))
      .then(() =>
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
            transactionManager.endTransaction(dbClient, false, cb);
          }));
  },

  startFinals(leagueId, players, id, cb) {
    const promise = transactionManager.startTransaction(dbClient);
    promise.then(() => isAdmin(id)).then(() => {
      const promises = [];
      const shuffledPlayers = _.shuffle(players.qualifiers);
      shuffledPlayers.forEach((player, idx) => {
        promises.push(finalsHandler.updateFinalsMatch(dbClient, leagueId, idx + 1, players.groupStage[idx], player));
      });
      return Promise.all(promises);
    })
      .then(() => db.league.updateLeagueStage(dbClient, leagueId, 'finals'))
      .then(() => {
        transactionManager.endTransaction(dbClient, true, cb);
      })
      .catch((error) => {
        logger.error(error);
        transactionManager.endTransaction(dbClient, false, cb, error);
      });
  },

  getQualifierMatches(leagueId, cb) {
    const promise = qualifierHandler.getMatches(dbClient, leagueId);
    promise.then((response) => {
      const matches = [];
      response.forEach((match) => {
        const m = new Match(match.id, match.match_key, match.winner_next_match_key, match.loser_next_match_key, match.player_one, match.player_two, match.walk_over, match.void);
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

  updateQualifierBracket(leagueId, matchObj, id, cb) {
    const match = Object.assign(new Match(), matchObj);
    const promise = transactionManager.startTransaction(dbClient);
    promise.then(() => userHandler.getUserById(id))
      .then(user => new Promise((resolve, reject) => {
        if (validator.validateMatch(match, user)) {
          resolve();
        }
        reject(new Error('Match invalid'));
      })).then(() => {
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
        const m = new Match(match.id, match.match_key, match.winner_next_match_key, match.loser_next_match_key, match.player_one, match.player_two, null, match.walk_over, match.void);
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

  updateEliminationBracket(leagueId, matchObj, id, cb) {
    const match = Object.assign(new Match(), matchObj);
    const promise = transactionManager.startTransaction(dbClient);
    promise.then(() => userHandler.getUserById(id))
      .then(user => new Promise((resolve, reject) => {
        if (validator.validateMatch(match, user)) {
          resolve();
        }
        reject(new Error('Match invalid'));
      })).then(() => {
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
        const m = new Match(match.id, match.match_key, match.winner_next_match_key, match.loser_next_match_key, match.player_one, match.player_two, null, match.walk_over, match.void);
        m.setScore(match.player_one_score, match.player_two_score);
        matches.push(m);
      });
      cb(matches);
    })
      .catch((error) => {
        logger.error(error);
        cb(new Error(error));
      });
  },

  updateFinalsBracket(leagueId, matchObj, id, cb) {
    const match = Object.assign(new Match(), matchObj);
    const promise = transactionManager.startTransaction(dbClient);
    promise.then(() => userHandler.getUserById(id))
      .then(user => new Promise((resolve, reject) => {
        if (validator.validateMatch(match, user)) {
          resolve();
        }
        reject(new Error('Match invalid'));
      })).then(() => {
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
