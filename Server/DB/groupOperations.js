// GET OPERATIONS
function getGroupsByLeagueId(c, leagueId) {
  return new Promise((resolve, reject) => {
    const queryString = `SELECT id, name, group_key FROM league_groups WHERE league_id = '${leagueId}';`;
    c.query(queryString, (error, rows) => {
      if (error) {
        reject(new Error(`[ERROR] getGroupsByLeagueId${error}`));
      } else {
        resolve(rows);
      }
    });
  });
}

function getGroupByGroupId(c, groupId) {
  return new Promise((resolve, reject) => {
    const queryString = `SELECT id, name, group_key FROM league_groups WHERE id ='${groupId}';`;
    c.query(queryString, (error, rows) => {
      if (error) {
        reject(new Error(`[ERROR] getGroupByGroupId${error}`));
      } else {
        resolve(rows);
      }
    });
  });
}

function getGroupMembersByGroupId(c, groupId, leagueId) {
  return new Promise((resolve, reject) => {
    const queryString = `SELECT players.id, firstName, lastName, nickName, place, league_participants.handicap FROM\
    ((group_members INNER JOIN league_participants ON group_members.player_id = league_participants.player_id)\
    INNER JOIN players ON league_participants.player_id = players.id) WHERE group_id = '${groupId}' AND league_id = '${leagueId}'`;
    c.query(queryString, (error, rows) => {
      if (error) {
        reject(new Error(`[ERROR] getGroupMembersByGroupId${error}`));
      } else {
        resolve(rows);
      }
    });
  });
}

function getGroupMatches(c, groupId) {
  return new Promise((resolve, reject) => {
    const queryString = `SELECT id, player_one_score, player_two_score, player_one, player_two FROM group_stage_matches WHERE group_id = '${groupId}'`;
    c.query(queryString, (error, rows) => {
      if (error) {
        reject(new Error(`[ERROR] getGroupMatches${error}`));
      } else {
        resolve(rows);
      }
    });
  });
}

function getGroupResults(c, groupId) {
  return new Promise((resolve, reject) => {
    const queryString = `SELECT player_id, place FROM group_members WHERE group_id = '${groupId}'`;
    c.query(queryString, (error, rows) => {
      if (error) {
        reject(new Error(`[ERROR] getGroupResults${error}`));
      } else {
        resolve(rows);
      }
    });
  });
}

function getUndetermined(c, leagueId) {
  return new Promise((resolve, reject) => {
    const queryString = `SELECT * FROM undetermined_group_rankings WHERE league_id = ${leagueId}`;
    c.query(queryString, (error, rows) => {
      if (error) {
        reject(new Error(`[ERROR] getUndetermined${error}`));
      } else {
        resolve(rows);
      }
    });
  });
}

// INSERT OPERATIONS
function insertGroup(c, leagueId, name, key) {
  return new Promise((resolve, reject) => {
    const queryString = `INSERT INTO league_groups(league_id, name, group_key) VALUE('${leagueId}','${name}','${key}')`;
    c.query(queryString, (error, rows) => {
      if (error) {
        reject(new Error(`[ERROR] insertGroup${error}`));
      } else {
        resolve(rows.info.insertId);
      }
    });
  });
}


function insertGroupMember(c, groupId, playerId) {
  return new Promise((resolve, reject) => {
    const queryString = `INSERT INTO group_members(group_id, player_id) VALUE('${groupId}', '${playerId}')`;
    console.log(queryString);
    c.query(queryString, (error, rows) => {
      if (error) {
        reject(new Error(`[ERROR] insertGroupMember${error}`));
      } else {
        resolve(rows);
      }
    });
  });
}

function insertGroupStageMatch(c, groupId, playerOneId, playerTwoId) {
  return new Promise((resolve, reject) => {
    const queryString = `INSERT INTO group_stage_matches(group_id, player_one, player_two) VALUES('${groupId}', '${playerOneId}', '${playerTwoId}')`;
    c.query(queryString, (error, rows) => {
      if (error) {
        reject(new Error(`[ERROR] insertGroupStageMatch${error}`));
      } else {
        resolve(rows);
      }
    });
  });
}

function updateGroupStageMatch(c, leagueId, match) {
  return new Promise((resolve, reject) => {
    const queryString = `UPDATE group_stage_matches INNER JOIN league_groups ON group_stage_matches.group_id = league_groups.id \
     SET player_one_score = ${match.playerOne.score}, player_two_score = ${match.playerTwo.score}\
      WHERE group_stage_matches.id = ${match.id} AND league_id = ${leagueId}`;
    c.query(queryString, (error, rows) => {
      if (error) {
        reject(new Error(`[ERROR] updateGroupStageMatch${error}`));
      } else if (rows.info.affectedRows === '0') {
        reject(new Error(`No match found with match id: ${match.id}`));
      } else {
        resolve('Match updated successfully');
      }
    });
  });
}

function updatePlayerGroupRanking(c, playerId, groupId, ranking) {
  return new Promise((resolve, reject) => {
    const queryString = `UPDATE group_members SET place = '${ranking}' WHERE player_id = '${playerId}' AND group_id = '${groupId}';`;
    c.query(queryString, (error, rows) => {
      if (error) {
        reject(new Error(`[ERROR] updatePlayerGroupRanking${error}`));
      } else if (rows.info.affectedRows === '0') {
        reject(new Error(`Error updating player, id: ${playerId}`));
      } else {
        resolve('Player ranking updated successfully');
      }
    });
  });
}

function insertToUndetermined(c, leagueId, groupKey, players, ranking) {
  return new Promise((resolve, reject) => {
    const queryString = `INSERT INTO undetermined_group_rankings(league_id, players, ranking, group_key)\
     VALUES (${leagueId}, '${players}', ${ranking}, '${groupKey}')`;
    c.query(queryString, (error, rows) => {
      if (error) {
        reject(new Error(`[ERROR] insertToUndetermined${error}`));
      } else {
        resolve(rows.info);
      }
    });
  });
}

function updateUndeterminedRanking(c, leagueId, groupKey, playerId, ranking) {
  return new Promise((resolve, reject) => {
    const queryString = `UPDATE group_members INNER JOIN league_groups ON group_members.group_id = league_groups.id \
    SET place = ${ranking}\
    WHERE league_id = ${leagueId} AND group_key = '${groupKey}' AND player_id = ${playerId};`;
    c.query(queryString, (error, rows) => {
      if (error) {
        reject(new Error(`[ERROR] updateUndeterminedRanking ${error}`));
      } else {
        resolve(rows.info);
      }
    });
  });
}

function deleteUndeterminedRanking(c, leagueId, groupKey) {
  return new Promise((resolve, reject) => {
    const queryString = `DELETE FROM undetermined_group_rankings WHERE league_id = ${leagueId} AND group_key = '${groupKey}'`;
    c.query(queryString, (error, rows) => {
      if (error) {
        reject(new Error(`[ERROR] deleteUndeterminedRanking ${error}`));
      } else {
        resolve(rows.info);
      }
    });
  });
}

module.exports = {
  insertGroup,
  insertGroupStageMatch,
  insertGroupMember,
  getGroupsByLeagueId,
  getGroupByGroupId,
  getGroupMembersByGroupId,
  getGroupMatches,
  getGroupResults,
  updateGroupStageMatch,
  updatePlayerGroupRanking,
  insertToUndetermined,
  getUndetermined,
  updateUndeterminedRanking,
  deleteUndeterminedRanking,
};
