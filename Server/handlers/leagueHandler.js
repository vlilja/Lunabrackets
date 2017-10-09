var db = require('../DB/dbOperations'),
  dbClient = require('../DB/dbconnect').initConnection(),
  _ = require('lodash'),
  transactionManager = require('../DB/transactionManager')

module.exports = {
  /*Start a league */
  startLeague: function(leagueId, participants, groupNames) {
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
          var groupOne = {id:insertedGroups[1], players:[]},
            groupTwo = {id:insertedGroups[2], players:[]},
            groupThree = {id:insertedGroups[3], players:[]},
            groupFour = {id:insertedGroups[4], players:[]};
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
              group.matches=matches;
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
        return db.league.updateLeagueStage(dbClient, leagueId, 'group');
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
        promises.push(db.group.getGroupMembersByGroupId(dbClient, group.id));
      });
      return Promise.all(promises);
    })
    .then((response) => {
      for(var i = 0; i < formattedGroups.length; i++){
        response.forEach((group, idx) => {
          if(group.id === formattedGroups[i].id){
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
        if(group.id === groupId){
          match = true;
        }
      })
      if(match) {
      return db.group.getGroupMatches(dbClient, groupId);
      }
      else {
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

  }

}
