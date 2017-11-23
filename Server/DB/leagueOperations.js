var transactionManager = require('./transactionManager');


//GET OPERATIONS
function getAllLeagues(c, cb) {
  var queryString = "SELECT * FROM leagues";
  c.query(queryString, function(err, rows) {
    if(err){
      cb(err);
    }
    else {
      cb(rows);
    }
  })
}

function getLeague(c, leagueId, cb) {
  var queryString = "SELECT * FROM leagues WHERE id='"+leagueId+"';"
  c.query(queryString, function(err, rows) {
    if(err){
      cb(err);
    }
    else {
      cb(rows[0]);
    }
  })
}

///INSERT OPERATIONS
function createLeague(c, league, cb) {
  var promise = transactionManager.startTransaction(c);
  //Insert league
  promise.then((response) => {
      return insertLeague(c, league);
    })
    .then((response) => {
      return insertParticipants(c, response.insertId, league);
    })
    .then(() => {
      transactionManager.endTransaction(c, true, cb);
    })
    .catch((error) => {
      console.log('NOT CALLED'+ error);
      transactionManager.endTransaction(c, false, cb);
    })
}

function insertParticipants(c, leagueId, league) {
  return new Promise((resolve, reject) => {
    var error = false;
    var promises = [];
    while(league.participants.length > 0) {
      var participant = league.participants.pop();
      promises.push(insertPlayerToLeague(c, leagueId, participant.id, participant.handicap));
    }
    console.log(promises);
    Promise.all(promises).then(values => {
      resolve();
    })
    .catch((error) => {
      reject(error);
    });
  });
}

function insertPlayerToLeague(c, leagueId, playerId, playerHandicap) {
  return new Promise((resolve, reject) => {
    var queryString = "INSERT INTO league_participants(league_id, player_id, handicap) VALUES (" + leagueId + "," + playerId + "," + playerHandicap + ")";
    c.query(queryString, function(err, rows) {
      if (err) {
        console.log('error');
        reject(err);
      }
      else {
        console.log(rows);
        resolve();
      }
    })
  })
}

function insertLeague(c, league) {
  return new Promise((resolve, reject) => {
    var queryString = "INSERT INTO leagues(name, game) VALUES('" + league.name + "'," + league.game + ")";
    c.query(queryString, function(err, rows) {
      if (err) {
        reject(err);
      } else {
        resolve(rows.info);
      }
    })
  })
}

//UPDATE OPERATIONS
function updateLeagueStageAndRaceTo(c, leagueId, stage, raceTo) {
  return new Promise((resolve, reject) => {
    var queryString = "UPDATE leagues SET stage='"+stage+"', raceTo = '"+raceTo+"' WHERE id = '"+leagueId+"';"
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

function updatePlayerHandicap(c, leagueId, playerId, handicap) {
  return new Promise((resolve, reject) => {
    var queryString = "UPDATE league_participants SET handicap = '"+handicap+"' WHERE league_id = '"+leagueId+"' AND player_id = '"+playerId+"'";
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

module.exports = {
  getAllLeagues: getAllLeagues,
  createLeague: createLeague,
  getLeague: getLeague,
  updateLeagueStageAndRaceTo: updateLeagueStageAndRaceTo,
  updatePlayerHandicap: updatePlayerHandicap
}