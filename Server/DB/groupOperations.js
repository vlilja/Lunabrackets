//GET OPERATIONS
function getGroupsByLeagueId(c, leagueId) {
  return new Promise((resolve, reject) => {
    var queryString = "SELECT id, name FROM league_groups WHERE league_id = '" + leagueId + "'";
    c.query(queryString, function(error, rows) {
      if (error) {
        reject(error);
      } else {
        resolve(rows);
      }
    })
  })
}

function getGroupMembersByGroupId(c, groupId, leagueId) {
  return new Promise((resolve, reject) => {
    var queryString = "SELECT players.id, firstName, lastName, nickName, league_participants.handicap FROM\
    ((group_members INNER JOIN league_participants ON group_members.player_id = league_participants.player_id)\
    INNER JOIN players ON league_participants.player_id = players.id) WHERE group_id = '" + groupId + "' AND league_id = '" + leagueId + "'";
    c.query(queryString, function(error, rows) {
      if (error) {
        reject(error);
      } else {
        resolve({
          id: groupId,
          players: rows
        });
      }
    })
  })
}

function getGroupMatches(c, groupId) {
  return new Promise((resolve, reject) => {
    var queryString = "SELECT id AS match_id, player_one_score, player_two_score, player_one, player_two FROM group_stage_matches WHERE group_id = '" + groupId + "'";
    c.query(queryString, function(error, rows) {
      if (error) {
        reject(error);
      } else {
        resolve({
          id: groupId,
          matches: rows
        });
      }
    })
  })
}


//INSERT OPERATIONS
function insertGroup(c, leagueId, name) {
  return new Promise((resolve, reject) => {
    var queryString = "INSERT INTO league_groups(league_id, name) VALUE('" + leagueId + "','" + name + "')";
    c.query(queryString, function(error, rows) {
      if (error) {
        reject(error);
      } else {
        resolve(rows.info.insertId);
      }
    })
  })
}

function insertGroupMember(c, groupId, playerId) {
  return new Promise((resolve, reject) => {
    var queryString = "INSERT INTO group_members(group_id, player_id) VALUE('" + groupId + "', '" + playerId + "')";
    c.query(queryString, function(error, rows) {
      if (error) {
        reject(error);
      } else {
        resolve(rows);
      }
    })
  })
}

function insertGroupStageMatch(c, groupId, playerOneId, playerTwoId) {
  return new Promise((resolve, reject) => {
    var queryString = "INSERT INTO group_stage_matches(group_id, player_one, player_two) VALUES('" + groupId + "', '" + playerOneId + "', '" + playerTwoId + "')";
    c.query(queryString, function(error, rows) {
      if (error) {
        reject(error);
      } else {
        resolve(rows);
      }
    });
  })
}

function updateGroupStageMatch(c, match, leagueId) {
  return new Promise((resolve, reject) => {
    var queryString = "UPDATE group_stage_matches INNER JOIN league_groups ON group_stage_matches.group_id = league_groups.id\
     SET player_one_score = '" + match.player_one_score +"', player_two_score = '" + match.player_two_score + "'\
     WHERE group_stage_matches.id='" + match.match_id + "' AND league_groups.league_id='" + leagueId + "';"
    c.query(queryString, function(error, rows) {
      if (error) {
        reject(error);
      }
      else if(rows.info.affectedRows === '0') {
        reject('No match found with match id: '+match.match_id+", league id: "+leagueId);
      }
      else {
        resolve('Match updated successfully');
      }
    });
  })
}

module.exports = {
  insertGroup: insertGroup,
  insertGroupStageMatch: insertGroupStageMatch,
  insertGroupMember: insertGroupMember,
  getGroupsByLeagueId: getGroupsByLeagueId,
  getGroupMembersByGroupId: getGroupMembersByGroupId,
  getGroupMatches: getGroupMatches,
  updateGroupStageMatch: updateGroupStageMatch
}
