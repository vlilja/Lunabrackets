

//GET OPERATIONS
function getGroupsByLeagueId(c, leagueId) {
  return new Promise((resolve, reject) => {
    var queryString = "SELECT id, name FROM league_groups WHERE league_id = '"+leagueId+"'";
    c.query(queryString, function(error, rows) {
      if(error) {
        reject(error);
      }
      else {
        resolve(rows);
      }
    })
  })
}

function getGroupMembersByGroupId(c, groupId) {
  return new Promise((resolve,reject) => {
    var queryString = "SELECT player_id FROM group_members WHERE group_id = '"+groupId+"'";
    c.query(queryString, function(error, rows) {
      if(error) {
        reject(error);
      }
      else {
        resolve({id:groupId, players:rows});
      }
    })
  })
}

function getGroupMatches(c, groupId) {
    return new Promise((resolve,reject) => {
      var queryString = "SELECT * FROM group_stage_matches WHERE group_id = '"+groupId+"'";
      c.query(queryString, function(error, rows) {
        if(error) {
          reject(error);
        }
        else {
          resolve(rows);
        }
      })
    })
  }

//INSERT OPERATIONS
function insertGroup(c, leagueId, name) {
  return new Promise((resolve, reject) => {
  var queryString = "INSERT INTO league_groups(league_id, name) VALUE('"+leagueId+"','"+name+"')";
  c.query(queryString, function(error, rows) {
    if(error) {
      reject(error);
    }
    else {
      resolve(rows.info.insertId);
    }
  })
  })
}

function insertGroupMember(c, groupId, playerId) {
  return new Promise((resolve, reject) => {
    var queryString = "INSERT INTO group_members(group_id, player_id) VALUE('"+groupId+"', '"+playerId+"')";
    c.query(queryString, function(error, rows) {
      if(error) {
        reject(error);
      }
      else {
        resolve(rows);
      }
    })
  })
}

function insertGroupStageMatch(c, groupId, playerOneId, playerTwoId) {
  return new Promise((resolve, reject) => {
    var queryString = "INSERT INTO group_stage_matches(group_id, player_one, player_two) VALUES('"+groupId+"', '"+playerOneId+"', '"+playerTwoId+"')";
    c.query(queryString, function(error, rows) {
      if(error) {
        reject(error);
      }
      else {
        resolve(rows);
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
  getGroupMatches: getGroupMatches
}
