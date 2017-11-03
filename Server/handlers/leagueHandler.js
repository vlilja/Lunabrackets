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

  updateGroupStageMatch: function(match, leagueId, cb) {
    var promise = db.group.updateGroupStageMatch(dbClient, match, leagueId);
    promise.then((response) => {
        cb(response);
      })
      .catch((error) => {
        cb(new Error(error));
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
        rankedGroups.forEach((group) => {
          var groupedByRank = _.groupBy(group.players, 'ranking');
          group.placements = determinePlacements(groupedByRank);
        })
        var promises = [];
        //Set group winners to finals
        for (var i = 0; i < rankedGroups.length; i++) {
          var placements = rankedGroups[i].placements;
          if (placements.toFinals) {
            promises.push(finalsHandler.updateGroupWinnerToFinal(dbClient, leagueId, placements.toFinals, i + 1));
          }
        }
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
        //Set players to qualifiers
        var matches = updatePlayersToQualifier(groupA.placements.toQualifiers, groupB.placements.toQualifiers, groupC.placements.toQualifiers, groupD.placements.toQualifiers);
        for (var key in matches) {
          promises.push(qualifierHandler.initializeMatch(dbClient, leagueId, key, matches[key]));
        }
        //Set players to elimination
        var eliminationMatches = updatePlayersToElimination(groupA.placements.toElimination, groupB.placements.toElimination, groupC.placements.toElimination, groupD.placements.toElimination);
        for (var key in eliminationMatches) {
          promises.push(eliminationHandler.initializeMatch(dbClient, leagueId, key, eliminationMatches[key]));
        }
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
  }

}

function updatePlayersToQualifier(groupA, groupB, groupC, groupD) {
  var groups = [groupA, groupB, groupC, groupD];
  var matches = {};
  for (var i = 1; i < 9; i++) {
    matches[i] = {
      playerOne: null,
      playerTwo: null
    };
  }
  //Helper function for iteration
  function nextPointer(pointer) {
    if (pointer === 3) {
      return 0;
    } else {
      return pointer++;
    }
  }
  //Place players to matches
  for (var i = 1, j = 0; i <= Object.keys(matches).length; i = i + 2, j++) {
    groupPointer = j;
    k = i + 1;
    matches[i].playerOne = groups[groupPointer].find((player) => {
      return player.ranking === 2;
    })
    groupPointer = nextPointer(groupPointer);
    matches[i].playerTwo = groups[groupPointer].find((player) => {
      return player.ranking === 5;
    })
    groupPointer = nextPointer(groupPointer);
    matches[k].playerOne = groups[groupPointer].find((player) => {
      return player.ranking === 4;
    })
    groupPointer = nextPointer(groupPointer);
    matches[k].playerTwo = groups[groupPointer].find((player) => {
      return player.ranking === 3;
    })
  }
  return matches;;
}

function updatePlayersToElimination(groupA, groupB, groupC, groupD) {
  var matches = {};
  var groups = [groupA, groupB, groupC, groupD];
  for (var i = 1; i <= 8; i++) {
    matches[i] = {
      playerOne: null,
      playerTwo: null
    };
  }
  //Set player ones
  for (var i = 0, match = 1, groupOne = 0, groupTwo = 2; i < 2; i++) {
    matches[match].playerOne = groups[groupOne].find((player) => {
      return player.ranking === 7;
    })
    match++;
    matches[match].playerOne = groups[groupTwo].find((player) => {
      return player.ranking === 7;
    })
    match++;
    groupOne++;
    groupTwo++;
  }
  //Set player two's
  for (var i = 0, match = 1, groupOne = 3, groupTwo = 1; i < 2; i++) {
    matches[match].playerTwo = groups[groupOne].find((player) => {
      return player.ranking === 8;
    })
    match++;
    matches[match].playerTwo = groups[groupTwo].find((player) => {
      return player.ranking === 8;
    })
    match++;
    groupOne--;
    groupTwo--;
  }
  //Set second round
  for (var i = 0, match = 5, groupIdx = 2; i < 2; i++) {
    matches[match].playerOne = groups[groupIdx].find((player) => {
      return player.ranking === 6;
    })
    match++;
    matches[match].playerOne = groups[(groupIdx + 1)].find((player) => {
      return player.ranking === 6;
    })
    match++;
    groupIdx = groupIdx - 2;
  }
  return matches;
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
