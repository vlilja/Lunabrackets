var db = require('../DB/dbOperations'),
  dbClient = require('../DB/dbconnect').initConnection(),
  _ = require('lodash'),
  transactionManager = require('../DB/transactionManager')

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
        for (var key in groupNames) {
          var promise = db.group.insertGroup(dbClient, leagueId, groupNames[key]);
          promises.push(promise);
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
    var toFinals = [];
    var toElimination = [];
    var toQualifiers = [];
    var promise = db.group.getGroupsByLeagueId(dbClient, leagueId);
    promise.then((response) => {
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
            //Get winner of the group
            var winner = determineGroupWinner(response[i + 1].players, response[i].matches);
            toFinals = toFinals.concat(_.remove(response[i + 1].players, (player) => {
              return player.id === winner;
            }));
          }
          if (toFinals.length === 4) {
            resolve(response);
          }
          else {
            reject(new Error('Could not determine winner for every group'));
          }
        })
      })
      .then((response) => {
        //Get losers
        return new Promise((resolve, reject) => {
          for (var i = 0; i < response.length; i = i + 2) {
            var notQualified = [];
            var players = response[i+1].players;
            for(var k = players.length-1; k > 0 && notQualified.length< 3; k--) {
              if(players[k].wins<players[k-1].wins){
                notQualified.push(players[k]);
              }
              else {
                notQualified.push(players[k]);
                for(var l = k-1; l > 0; l--) {
                  if(players[k].wins === players[l].wins) {
                    notQualified.push(players[l]);
                  }
                }
              }
            }
            if(notQualified.length > 3) {
              notQualified = determineGroupLosers(notQualified, response[i].matches);
            }
            var eliminated = [];
            notQualified.forEach((nqPlayer) => {
              eliminated = eliminated.concat(_.remove(response[i + 1].players, (player) => {
                return player.id === nqPlayer.id;
              }));
            });
            toElimination.push(eliminated);
          }
        })
      })
  }

}
//HELPERS
function determineGroupWinner(players, matches) {
  var sortedGroup = players.sort((a, b) => {
    if (b.wins && a.wins) {
      return b.wins - a.wins;
    } else {
      return 1;
    }
  })
  var winners = [];
  sortedGroup.forEach((player) => {
    if (sortedGroup[0].wins === player.wins) {
      winners.push(player);
    }
  })
  if (winners.length === 1) {
    return winners[0].id;
  } else {
    var mutualMatches = getMutualMatches(winners, matches);
    var mutualWins = getMutualWins(mutualMatches);
    var winner = {
      wins: 0
    };
    for (var key in mutualWins) {
      if (mutualWins[key].wins > winner.wins) {
        winner = {
          id: key,
          wins: mutualWins[key].wins
        };
      }
    }
    return winner.id;
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

function getMutualWins(mutualMatches) {
  var mutualWins = {};
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
  return mutualWins;
}

function determineGroupLosers(players, allGroupMatches) {
  var losers = [];
  var mutualMatches = getMutualMatches(players, allGroupMatches);
  var mutualWins = getMutualWins(mutualMatches);
  var groupedByWins = {};
  for(var key in mutualWins) {
    if(!groupedByWins[mutualWins[key].wins]) {
      groupedByWins[mutualWins[key].wins] = [{id:key}];
    }
    else {
      groupedByWins[mutualWins[key].wins].push({id:key});
    }
  }
  console.log(groupedByWins);
  for(var key in groupedByWins) {
    if(groupedByWins[key].length === 1) {
      losers.push[{8:groupedByWins[key][0]}];
    }
    else {
      var mutualMatches = getMutualMatches(groupedByWins[key], allGroupMatches);
      var mutualWins = getMutualWins(mutualMatches);
      console.log(mutualWins);
    }
  }
  console.log(losers);
  return losers;
}
