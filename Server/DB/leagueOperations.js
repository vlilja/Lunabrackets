var transactionManager = require('./transactionManager');

module.exports = {

//GET OPERATIONS
getAllLeagues: function(c) {
  return new Promise((resolve, reject) => {
    var queryString = "SELECT * FROM leagues";
    c.query(queryString, function(error, rows) {
      if(error){
        reject('[ERROR] getAllLeagues' + error);
      }
      else {
        resolve(rows);
      }
    })
  })

},

getLeague: function(c, leagueId) {
  return new Promise((resolve, reject) => {
    var queryString = "SELECT * FROM leagues WHERE id = '"+leagueId+"'";
    c.query(queryString, function(error, rows) {
      if(error){
        reject('[ERROR] getLeague' + error);
      }
      else {
        resolve(rows);
      }
    })
  })
},

getLeagueParticipants: function (c, leagueId) {
  return new Promise((resolve, reject) => {
    var queryString = "SELECT * FROM league_participants INNER JOIN players ON league_participants.player_id = players.id WHERE league_id ='"+leagueId+"'";
    c.query(queryString, function(error, rows) {
      if(error){
        reject('[ERROR] getLeagueParticipants' + error);
      }
      else {
        resolve(rows);
      }
    })
  })
},

///INSERT OPERATIONS
createLeague: function(c, league, cb) {
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
},

insertParticipants: function (c, leagueId, league) {
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
},

insertPlayerToLeague: function (c, leagueId, playerId, playerHandicap) {
  return new Promise((resolve, reject) => {
    var queryString = "INSERT INTO league_participants(league_id, player_id, handicap) VALUES (" + leagueId + "," + playerId + "," + playerHandicap + ")";
    c.query(queryString, function(error, rows) {
      if (error) {
        reject('[ERROR] insertPlayerToLeague' + error);
      }
      else {
        console.log(rows);
        resolve();
      }
    })
  })
},

insertLeague: function (c, league) {
  return new Promise((resolve, reject) => {
    var queryString = "INSERT INTO leagues(name, game) VALUES('" + league.name + "'," + league.game + ")";
    c.query(queryString, function(error, rows) {
      if (error) {
        reject('[ERROR] insertLeague' + error);
      } else {
        resolve(rows.info);
      }
    })
  })
},

//UPDATE OPERATIONS
updateLeagueStageAndRaceTo: function (c, leagueId, stage, raceTo) {
  return new Promise((resolve, reject) => {
    var queryString = "UPDATE leagues SET stage='"+stage+"', raceTo = '"+raceTo+"' WHERE id = '"+leagueId+"';"
    c.query(queryString, function(error, rows) {
      if(error) {
        reject('[ERROR] updateLeagueStageAndRaceTo' + error);
      }
      else {
        resolve(rows);
      }
    })
  })
},

updateLeagueStage: function (c, leagueId, stage) {
  return new Promise((resolve, reject) => {
    var queryString = "UPDATE leagues SET stage='"+stage+"' WHERE id = '"+leagueId+"';"
    c.query(queryString, function(error, rows) {
      if(error) {
        reject('[ERROR] updateLeagueStage' + error);
      }
      else {
        resolve(rows);
      }
    })
  })
},

updatePlayerHandicap: function (c, leagueId, playerId, handicap) {
  return new Promise((resolve, reject) => {
    var queryString = "UPDATE league_participants SET handicap = '"+handicap+"' WHERE league_id = '"+leagueId+"' AND player_id = '"+playerId+"'";
    c.query(queryString, function(error, rows) {
      if(error) {
        reject('[ERROR] updatePlayerHandicap' + error);
      }
      else {
        resolve(rows);
      }
    })
  })
},



}
