var db = require('../DB/dbOperations'),
  dbClient = require('../DB/dbconnect').initConnection(),
  _ = require('lodash'),
  transactionManager = require('../DB/transactionManager')
groupHandler = require('./groupHandler')
qualifierHandler = require('./qualifierHandler')
finalsHandler = require('./finalsHandler')
eliminationHandler = require('./eliminationHandler')


module.exports = {
  /*Start a league */
  startLeague: function(leagueId, participants, groupNames, raceTo) {
    var transaction = transactionManager.startTransaction(dbClient);
    transaction.then(() => {
        var promises = [];
        var promise = new Promise((resolve, reject) => {
          //validate stage
          db.league.getLeague(dbClient, leagueId, function(response) {
            if (response.stage !== 'ready') {
              reject(new Error('League is already started'));
            }
            resolve('ok');
          })
        })
        promises.push(promise);
        //set group names
        var keys = ['A', 'B', 'C', 'D']
        var key_idx = 0;
        for (var key in groupNames) {
          var promise = db.group.insertGroup(dbClient, leagueId, groupNames[key], keys[key_idx]);
          promises.push(promise);
          key_idx++;
        }
        //adjust handicaps
        participants.forEach((player, idx) => {
          promises.push(db.league.updatePlayerHandicap(dbClient, leagueId, player.player_id, player.handicap));
        });
        return Promise.all(promises);
      }).then((insertedGroups) => {
        //shuffle groups
        return new Promise((resolve, reject) => {
          var shuffledParticipants = _.shuffle(participants);
          var groupOne = {
              id: insertedGroups[1],
              players: []
            },
            groupTwo = {
              id: insertedGroups[2],
              players: []
            },
            groupThree = {
              id: insertedGroups[3],
              players: []
            },
            groupFour = {
              id: insertedGroups[4],
              players: []
            };
          var groups = [groupOne, groupTwo, groupThree, groupFour];
          for (var i = 0, k = 0; i < shuffledParticipants.length; i++) {
            groups[k].players.push(shuffledParticipants[i]);
            k++;
            if (k % 4 === 0) {
              k = 0;
            }
          }
          resolve(groups);
        })
      }).then((groups) => {
        //create group matches
        return new Promise((resolve, reject) => {
          try {
            groups.forEach((group, idx) => {
              var matches = [];
              for (var i = 0; i < group.players.length + 1; i++) {
                for (var k = i + 1; k < group.players.length; k++) {
                  var match = {
                    playerOne: group.players[i].player_id,
                    playerTwo: group.players[k].player_id
                  }
                  matches.push(match);
                }
              }
              group.matches = matches;
            })
          } catch (error) {
            reject(error);
          }
          resolve(groups);
        })
      })
      .then((groups) => {
        var promises = [];
        groups.forEach((group, idx) => {
          group.players.forEach((player, idx) => {
            promises.push(db.group.insertGroupMember(dbClient, group.id, player.player_id));
          })
          group.matches.forEach((match, idx) => {
            promises.push(db.group.insertGroupStageMatch(dbClient, group.id, match.playerOne, match.playerTwo));
          })
        })
        return Promise.all(promises);
      })
      .then((values) => {
        return db.league.updateLeagueStageAndRaceTo(dbClient, leagueId, 'group', raceTo);
      })
      .then((response) => {
        transactionManager.endTransaction(dbClient, true, function(value) {
          console.log(value);
        });
      })
      .catch((error) => {
        console.log(error);
        transactionManager.endTransaction(dbClient, false, function(value) {
          console.log(value);
        });
      })
  },

  getGroups: function(leagueId, cb) {
    var promise = db.group.getGroupsByLeagueId(dbClient, leagueId);
    var formattedGroups = [];
    promise.then((groups) => {
        var promises = [];
        groups.forEach((group, idx) => {
          formattedGroups.push(group);
          promises.push(db.group.getGroupMembersByGroupId(dbClient, group.id, leagueId));
        });
        return Promise.all(promises);
      })
      .then((response) => {
        for (var i = 0; i < formattedGroups.length; i++) {
          response.forEach((group, idx) => {
            if (group.id === formattedGroups[i].id) {
              formattedGroups[i].players = group.players;
            }
          })
        }
        cb(formattedGroups);
      })
      .catch((error) => {
        console.log(error);
        cb(new Error(error));
      })
  },

  getGroupMatches: function(leagueId, groupId, cb) {
    var promise = db.group.getGroupsByLeagueId(dbClient, leagueId);
    promise.then((response) => {
        var match = false;
        response.forEach((group) => {
          if (group.id === groupId) {
            match = true;
          }
        })
        if (match) {
          return db.group.getGroupMatches(dbClient, groupId);
        } else {
          throw 'No such group in this league';
        }
      })
      .then((response) => {
        cb(response);
      })
      .catch((error) => {
        console.log(error);
        cb(error);
      })

  },

  getGroupResults(groupId, cb) {
    var promise = db.group.getGroupResults(dbClient, groupId);
    promise.then((response) => {
        cb(response);
      })
      .catch((error) => {
        console.log(error);
        cb(error);
      })
  },

  getUndetermined(leagueId, cb) {
    var promise = groupHandler.getUndetermined(dbClient, leagueId);
    promise.then((response) => {
        cb(response);
      })
      .catch((error) => {
        console.log(error);
        cb(new Error(error));
      })
  },



  updateGroupStageMatch: function(match, leagueId, cb) {
    var promise = db.group.updateGroupStageMatch(dbClient, match, leagueId);
    promise.then((response) => {
        cb(response);
      })
      .catch((error) => {
        cb(new Error(error));
      })
  },

  fixUndeterminedRankings: function(leagueId, group, cb) {
    var promise = transactionManager.startTransaction(dbClient);
    promise.then((response) => {
        return groupHandler.fixUndeterminedRankings(dbClient, leagueId, group)
      })
      .then((response) => {
        //Get placements
        var promises = [];
        promises.push(db.finals.getPlacements(dbClient));
        promises.push(db.qualifier.getPlacements(dbClient));
        promises.push(db.elimination.getEliminationPlacements(dbClient));
        return Promise.all(promises);
      })
      .then((response) => {
        var placements = {
          finals: response[0],
          qualifiers: response[1],
          elimination: response[2]
        }
        var promises = placePlayersByRanking(dbClient, leagueId, group, placements);
        return Promise.all(promises);
      })
      .then((response) => {
        transactionManager.endTransaction(dbClient, true, cb);
      })
      .catch((error) => {
        console.log(error);
        transactionManager.endTransaction(dbClient, false, cb);
      })
  },

  //Qualifier stage
  startQualifiers: function(leagueId, cb) {
    var rankedGroups = [];
    var promise = transactionManager.startTransaction(dbClient);
    promise.then((response) => {
        //Create qualifier
        return qualifierHandler.createQualifier(dbClient, leagueId);
      })
      .then((response) => {
        return qualifierHandler.createQualifierMatches(dbClient, leagueId);
      })
      .then((response) => {
        //Create finals
        return finalsHandler.createFinals(dbClient, leagueId);
      })
      .then((response) => {
        return finalsHandler.createFinalsMatches(dbClient, leagueId);
      })
      .then((response) => {
        return eliminationHandler.createElimination(dbClient, leagueId);
      })
      .then((response) => {
        return eliminationHandler.createEliminationMatches(dbClient, leagueId);
      })
      .then((response) => {
        //Get groups
        return db.group.getGroupsByLeagueId(dbClient, leagueId);
      })
      .then((response) => {
        //Get group matches and players
        response.forEach((group) => {
          rankedGroups.push(group);
        });
        var promises = [];
        response.forEach((group) => {
          promises.push(db.group.getGroupMatches(dbClient, group.id));
          promises.push(db.group.getGroupMembersByGroupId(dbClient, group.id, leagueId));
        })
        return Promise.all(promises);
      })
      .then((response) => {
        //Count player wins
        return new Promise((resolve, reject) => {
          for (var i = 0; i < response.length; i = i + 2) {
            response[i].matches.forEach((match) => {
              if (match.player_one_score > match.player_two_score) {
                var player = response[i + 1].players.find((player) => {
                  return player.id === match.player_one;
                })
                if (!player.wins) {
                  player.wins = 0;
                }
                player.wins++;
              } else {
                var player = response[i + 1].players.find((player) => {
                  return player.id === match.player_two;
                })
                if (!player.wins) {
                  player.wins = 0;
                }
                player.wins++;
              }
            })
            var rankedGroup = determineGroupRankings(response[i + 1].players, response[i].matches);
            var group = rankedGroups.find((group) => {
              return group.id === response[i].id;
            });
            group.players = _.orderBy(rankedGroup, ['ranking'], ['asc'])
          }
          resolve(rankedGroups)
        })
      })
      .then((rankedGroups) => {
        var promises = [];
        rankedGroups.forEach((group) => {
          group.players.forEach((player) => {
            promises.push(db.group.updatePlayerGroupRanking(dbClient, player.id, group.id, player.ranking));
          })
        });
        return Promise.all(promises);
      })
      .then((response) => {
        var promises = [];
        //Get placements
        promises.push(db.finals.getPlacements(dbClient));
        promises.push(db.qualifier.getPlacements(dbClient));
        promises.push(db.elimination.getEliminationPlacements(dbClient));
        return Promise.all(promises);
      })
      .then((response) => {
        var finalsPlacements = response[0];
        var qualifierPlacements = response[1];
        var eliminationPlacements = response[2];
        rankedGroups.forEach((group) => {
          var groupedByRank = _.groupBy(group.players, 'ranking');
          group.placements = determinePlacements(groupedByRank);
        })
        var promises = [];
        //Groups by group keys
        var groupA = rankedGroups.find((group) => {
          return group.group_key === 'A';
        })
        var groupB = rankedGroups.find((group) => {
          return group.group_key === 'B';
        })
        var groupC = rankedGroups.find((group) => {
          return group.group_key === 'C';
        })
        var groupD = rankedGroups.find((group) => {
          return group.group_key === 'D';
        })
        //Set group winners to finals
        var finalsPromises = finalsHandler.updatePlayersToFinal(dbClient, leagueId, finalsPlacements, groupA.placements.toFinals, groupB.placements.toFinals, groupC.placements.toFinals, groupD.placements.toFinals);
        promises = promises.concat(finalsPromises);
        //Set players to qualifiers
        var qualifierPromises = qualifierHandler.updatePlayersToQualifier(dbClient, leagueId, qualifierPlacements, groupA.placements.toQualifiers, groupB.placements.toQualifiers, groupC.placements.toQualifiers, groupD.placements.toQualifiers);
        promises = promises.concat(qualifierPromises);
        //Set players to elimination
        var eliminationPromises = eliminationHandler.updatePlayersToElimination(dbClient, leagueId, eliminationPlacements, groupA.placements.toElimination, groupB.placements.toElimination, groupC.placements.toElimination, groupD.placements.toElimination);
        promises = promises.concat(eliminationPromises);
        //Set undetermined
        var undetermined = groupHandler.createUndetermined(dbClient, leagueId, groupA.placements.undetermined, groupB.placements.undetermined, groupC.placements.undetermined, groupD.placements.undetermined);
        promises = promises.concat(undetermined);
        return Promise.all(promises);
      })
      .then((response) => {
        transactionManager.endTransaction(dbClient, true, function(value) {
          console.log(value);
        });
      })
      .catch((error) => {
        console.log("ERROR: " + error);
        transactionManager.endTransaction(dbClient, false, function(value) {
          console.log(value);
        });
      })
  },

  startFinals: function(leagueId, cb) {
    var promise = transactionManager.startTransaction(dbClient);
    promise.then((response) => {
      return qualifierHandler.getMatches(dbClient, leagueId);
    })
    .then((matches) => {
      var players = [];
      matches.forEach((match) => {
        if(match.match_key === 'B1' || match.match_key === 'B2' || match.match_key === 'L11' || match.match_key === 'L12'){
          if(Number(match.player_one_score) > Number(match.player_two_score)) {
            players.push(match.player_one);
          }
          else {
            players.push(match.player_two);
          }
        }
      })
      var promises = [];
      players = _.shuffle(players);
      players.forEach((player, idx) =>  {
        promises.push(finalsHandler.updateFinalsMatch(dbClient, leagueId, idx+1, null, player));
      })
      if(promises.length !== 4){
        throw new Error('Error starting Finals, players missing');
      }
      return Promise.all(promises);
    })
    .then((response) => {
      transactionManager.endTransaction(dbClient, true, cb);
    })
    .catch((error) => {
      console.log(error);
      transactionManager.endTransaction(dbClient, false, cb, error);
    })
  },

  getQualifierMatches(leagueId, cb) {
    var promise = qualifierHandler.getMatches(dbClient, leagueId);
    promise.then((response) => {
        cb(response);
      })
      .catch((error) => {
        console.log(error);
        cb(new Error(error));
      })
  },

  updateQualifierBracket(leagueId, match, cb) {
    var promise = transactionManager.startTransaction(dbClient);
    promise.then((response) => {
      var promises = qualifierHandler.updateBracket(dbClient, leagueId, match);
      return Promise.all(promises);
    })
    .then((response) => {
      transactionManager.endTransaction(dbClient, true, cb, response);
    })
    .catch((error) => {
      console.log('ERROR: '+error);
      transactionManager.endTransaction(dbClient, false, cb);
    })
  },

  //ELIMINATION

  getEliminationMatches(leagueId, cb) {
    var promise = eliminationHandler.getEliminationMatches(dbClient, leagueId);
    promise.then((response) => {
      cb(response);
    })
    .catch((error) => {
      console.log(error);
      cb(new Error(error));
    })
  },

  updateEliminationBracket(leagueId, match, cb) {
    var promise = transactionManager.startTransaction(dbClient);
    promise.then((response) => {
      var promises = eliminationHandler.updateBracket(dbClient, leagueId, match);
      return Promise.all(promises);
    })
    .then((response) => {
      transactionManager.endTransaction(dbClient, true, cb, response);
    })
    .catch((error) => {
      console.log('ERROR: '+error);
      transactionManager.endTransaction(dbClient, false, cb);
    })
  },

  //FINALS
  getFinalsMatches(leagueId, cb) {
    var promise = finalsHandler.getFinalsMatches(dbClient, leagueId);
    promise.then((response) => {
      cb(response);
    })
    .catch((error) => {
      console.log(error);
      cb(new Error(error));
    })
  },

  updateFinalsBracket(leagueId, match, cb) {
    var promise = transactionManager.startTransaction(dbClient);
    promise.then((response) => {
      var promises = finalsHandler.updateBracket(dbClient, leagueId, match);
      return Promise.all(promises);
    })
    .then((response) => {
      transactionManager.endTransaction(dbClient, true, cb, response);
    })
    .catch((error) => {
      console.log('ERROR: '+error);
      transactionManager.endTransaction(dbClient, false, cb);
    })
  },


}

//HELPERS
function placePlayersByRanking(dbClient, leagueId, group, placements) {
  var promises = [];
  for (var id in group.players) {
    var ranking = Number(group.players[id].ranking);
    if (ranking === 1) {
      var seed = group.key + '1';
      var match = placements.finals.find((match) => {
        if (match.player_one === seed) {
          return match;
        }
      })
      promises.push(finalsHandler.updateFinalsMatch(dbClient, leagueId, match.match_key, id))
    }
    if (ranking > 1 && ranking <= 5) {
      var seed = group.key + group.players[id].ranking;
      placements.qualifiers.forEach((match) => {
        if(match.player_one === seed) {
          promises.push(qualifierHandler.updateQualifiersMatch(dbClient, leagueId, match.match_key, id, null));
        }
        if(match.player_two === seed) {
          promises.push(qualifierHandler.updateQualifiersMatch(dbClient, leagueId, match.match_key, null, id));
        }
      })
    }
    if(ranking > 5) {
      var seed = group.key + group.players[id].ranking;
      placements.elimination.forEach((match) => {
        if(match.player_one === seed) {
          promises.push(eliminationHandler.updateEliminationMatch(dbClient, leagueId, match.match_key, id, null));
        }
        if(match.player_two === seed) {
          promises.push(eliminationHandler.updateEliminationMatch(dbClient, leagueId, match.match_key, null, id));
        }
      })
    }
  }
  return promises;
}

function determinePlacements(groupByRank) {
  var toFinals = '';
  var toQualifiers = [];
  var toElimination = [];
  var undetermined = [];
  for (var key in groupByRank) {
    if (key === '1') {
      if (groupByRank[key].length === 1) {
        toFinals = groupByRank[key][0];
      } else {
        undetermined.push(groupByRank[key]);
      }
    } else if (key > 1 && key < 6) {
      if (groupByRank[key].length === 1) {
        toQualifiers.push(groupByRank[key][0]);
      } else {
        undetermined.push(groupByRank[key]);
      }
    } else if (key > 5) {
      if (groupByRank[key].length === 1) {
        toElimination.push(groupByRank[key][0]);
      } else {
        undetermined.push(groupByRank[key]);
      }
    }
  }
  return {
    toFinals: toFinals,
    toQualifiers: toQualifiers,
    toElimination: toElimination,
    undetermined: undetermined
  }
}

function determineGroupRankings(players, matches) {
  var groups = _.groupBy(players, 'wins');
  var rankedGroup = [];
  var rank = players.length;
  for (var key in groups) {
    if (groups[key].length === 1) {
      groups[key][0].ranking = rank;
      rankedGroup.push(groups[key][0]);
    } else {
      rankedGroup = rankedGroup.concat(determineSubGroupRankings(groups[key], matches, rank, []));
    }
    rank = players.length - rankedGroup.length;
  }
  return rankedGroup;
}

function determineSubGroupRankings(players, matches, rank, rankedArray) {
  var mutualMatches = getMutualMatches(players, matches);
  var mutualWins = getMutualWins(players, mutualMatches);
  mutualWins = _.groupBy(mutualWins, 'wins');
  var keys = Object.keys(mutualWins);
  //Three people tied
  if (keys.length === 1) {
    mutualWins[keys[0]].forEach((item) => {
      var player = _.remove(players, (player) => {
        return player.id === item.id;
      })
      player[0].ranking = rank;
      rankedArray.push(player[0]);
    });
    return rankedArray;
  } else {
    for (var key in mutualWins) {
      if (mutualWins[key].length === 1) {
        //one player over the others in mutual matches
        var player = _.remove(players, (player) => {
          return player.id === mutualWins[key][0].id;
        })
        player[0].ranking = rank;
        rank--;
        rankedArray.push(player[0]);
      } else if (mutualWins[key].length === 2) {
        //two people tied, check their mutual match
        var twoPlayers = [];
        mutualWins[key].forEach((item) => {
          var player = _.remove(players, (p) => {
            return p.id === item.id;
          })
          twoPlayers.push(player[0]);
        })
        determineSubGroupRankings(twoPlayers, matches, rank, rankedArray);
        rank = rank - 2;
      } else {
        rank = rank - mutualWins[key].length;
      }
    }
    if (players.length === 0) {
      return rankedArray;
    } else {
      //Check remaining players tied
      return determineSubGroupRankings(players, matches, rank + rankedArray.length, rankedArray);
    }
  }
}

function getMutualMatches(players, allGroupMatches) {
  var mutualMatches = [];
  for (var i = 0; i < players.length; i++) {
    for (var k = i + 1; k < players.length; k++) {
      mutualMatches.push(allGroupMatches.find((match) => {
        return ((players[i].id === match.player_one && players[k].id === match.player_two) ||
          (players[i].id === match.player_two && players[k].id === match.player_one))
      }))
    }
  }
  return mutualMatches;
}

function getMutualWins(players, mutualMatches) {
  var mutualWins = [];
  mutualMatches.forEach((match) => {
    if (!mutualWins[match.player_one]) {
      mutualWins[match.player_one] = {
        wins: 0
      }
    }
    if (!mutualWins[match.player_two]) {
      mutualWins[match.player_two] = {
        wins: 0
      }
    }
    if (match.player_one_score > match.player_two_score) {
      mutualWins[match.player_one].wins = mutualWins[match.player_one].wins + 1;
    } else {
      mutualWins[match.player_two].wins = mutualWins[match.player_two].wins + 1;
    }
  })
  var playerWins = [];
  for (var key in mutualWins) {
    var player = players.find((player) => {
      return key === player.id;
    })
    playerWins.push({
      id: key,
      player: player,
      wins: mutualWins[key].wins
    });
  }
  return playerWins;
}
