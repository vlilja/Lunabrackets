const db = require('../DB/dbOperations');
const { Match } = require('lunabrackets-datamodel');

function createPlayerString(players) {
  let listedPlayers = '';
  players.forEach((player) => {
    listedPlayers = `${listedPlayers + player.id},`;
  });
  listedPlayers = listedPlayers.slice(0, listedPlayers.length - 1);
  return listedPlayers;
}

module.exports = {

  insertGroups(dbClient, leagueId, groupNames) {
    const promises = [];
    const groupNameKeys = Object.keys(groupNames);
    groupNameKeys.forEach((key) => {
      const promise = db.group.insertGroup(dbClient, leagueId, groupNames[key], key);
      promises.push(promise);
    });
    return Promise.all(promises);
  },

  addGroupMembers(dbClient, groupId, players) {
    const promises = [];
    players.forEach((player) => {
      promises.push(db.group.insertGroupMember(dbClient, groupId, player.id));
    });
    return promises;
  },

  getGroups(dbClient, leagueId) {
    return db.group.getGroupsByLeagueId(dbClient, leagueId);
  },

  getGroupMembers(dbClient, groupId, leagueId) {
    return db.group.getGroupMembersByGroupId(dbClient, groupId, leagueId);
  },

  getGroupMatches(dbClient, groupId) {
    return new Promise((resolve, reject) => {
      const promise = db.group.getGroupMatches(dbClient, groupId);
      const matches = [];
      promise.then((matchesArray) => {
        matchesArray.forEach((match) => {
          const m = new Match(match.id, null, null, null, match.player_one, match.player_two);
          m.setScore(match.player_one_score, match.player_two_score);
          matches.push(m);
        });
        resolve(matches);
      }).catch((error) => {
        console.log(error);
        reject(new Error('Error fetching group matches'));
      });
    });
  },

  getUndetermined(dbClient, leagueId) {
    return db.group.getUndetermined(dbClient, leagueId);
  },

  createGroupMatches(dbClient, groupId, players) {
    const matches = [];
    const promises = [];
    for (let i = 0; i < players.length + 1; i += 1) {
      for (let k = i + 1; k < players.length; k += 1) {
        const match = {
          playerOne: players[i].id,
          playerTwo: players[k].id,
        };
        matches.push(match);
      }
    }
    matches.forEach((match) => {
      promises.push(db.group.insertGroupStageMatch(dbClient, groupId, match.playerOne, match.playerTwo));
    });
    return promises;
  },

  createUndetermined(dbClient, leagueId, groupA, groupB, groupC, groupD) {
    const promises = [];
    if (groupA) {
      groupA.forEach((players) => {
        const playerString = createPlayerString(players);
        promises.push(db.group.insertToUndetermined(dbClient, leagueId, 'A', playerString, players[0].ranking));
      });
    }
    if (groupB) {
      groupB.forEach((players) => {
        const playerString = createPlayerString(players);
        promises.push(db.group.insertToUndetermined(dbClient, leagueId, 'B', playerString, players[0].ranking));
      });
    }
    if (groupC) {
      groupC.forEach((players) => {
        const playerString = createPlayerString(players);
        promises.push(db.group.insertToUndetermined(dbClient, leagueId, 'C', playerString, players[0].ranking));
      });
    }
    if (groupD) {
      groupD.forEach((players) => {
        const playerString = createPlayerString(players);
        promises.push(db.group.insertToUndetermined(dbClient, leagueId, 'D', playerString, players[0].ranking));
      });
    }
    return promises;
  },

  fixUndeterminedRankings(dbClient, leagueId, group) {
    const promises = [];
    group.players.forEach((player) => {
      promises.push(db.group.updateUndeterminedRanking(dbClient, leagueId, group.key, player.details.id, player.ranking));
    });
    promises.push(db.group.deleteUndeterminedRanking(dbClient, group.id));
    return Promise.all(promises);
  },

  updatePlayerGroupRankings(dbClient, group) {
    const promises = [];
    group.players.forEach((player) => {
      promises.push(db.group.updatePlayerGroupRanking(dbClient, player.id, group.id, player.ranking));
    });
    return promises;
  },

};
