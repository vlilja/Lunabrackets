var transactionManager = require('./transactionManager');
var singleElimination = require('./singleEliminationOperations');
var doubleElimination = require('./doubleEliminationOperations');

module.exports = {

  singleElimination:singleElimination,
  doubleElimination:doubleElimination,

  getTournaments: function(c, cb) {
    c.query('SELECT * FROM tournament', function(err, rows) {
      if (err) {
        cb(err);
      }
      cb(rows);
    });
  },

  addParticipant: function(c, tournamentId, participantId, cb) {
    var promise = transactionManager.startTransaction(c);
    promise.then((result) => {
        var queryString = 'INSERT INTO tournament_participants(tournament_id, player_id) VALUES(' + tournamentId + ',' + participantId + ')';
        c.query(queryString, function(err, rows) {
          if (err) {
            transactionManager.endTransaction(c, false, cb);
          } else {
            transactionManager.endTransaction(c, true, cb);
          }
        })
      })
      .catch((error) => {
        console.log(error);
        transactionManager.endTransaction(c, false, cb);
      });
  },

  getParticipants: function(c, id, cb) {
    c.query('select users.id, users.firstName, users.lastName, users.handicap from tournament_participants inner join users on tournament_participants.player_id = users.id where tournament_id =' + id, function(err, rows) {
      if (err) {
        cb(err);
      } else {
        cb(rows);
      }
    })
  },

  getRaceTo: function(c, id, cb) {
    var queryString = "select single_elimination.raceTo as 'single', double_elimination.raceTo as 'double', round_robin.raceTo as 'roundrobin' from single_elimination\
                         left join double_elimination on single_elimination.tournament_id = double_elimination.tournament_id\
                         left join round_robin on single_elimination.tournament_id = round_robin.tournament_id\
                         where single_elimination.tournament_id =" + id;
    c.query(queryString, function(err, rows) {
      if (err) {
        cb(err);
      }
      cb(rows[0]);
    });
  },

  updateTournamentStatus: function(c, tournamentId, status, cb) {
    console.log('updating');
    var queryString = "UPDATE tournament SET status ='" + status + "' WHERE id = " + tournamentId;
    c.query(queryString, function(err, rows) {
      if (err) {
        console.log(err);
        cb(new Error('Update failed'));
      } else {
        cb(rows);
      }
    })
  },

  createTournament: function(c, tournament, cb) {
    var promise = transactionManager.startTransaction(c);
    promise.then((result) => {
        console.log(result);
        console.log('Creating tournament');
        var variables = '"' + tournament.name + '","' + tournament.type + '",' + tournament.size + ',"' +
          tournament.gameType + '",' + (tournament.handicap ? '"Y"' : '"N"') + ', @id';
        return new Promise((resolve, reject) => {
          c.query('CALL insert_tournament(' + variables + ')', function(err, rows) {
            if (err) {
              reject(err);
            } else {
              resolve(rows);
            }
          })
        });
      })
      .then((result) => {
        console.log('Getting id');
        return new Promise((resolve, reject) => {
          c.query('SELECT @id', function(err, rows) {
            if (err) {
              reject(err);
            } else {
              resolve(rows[0]);
            }
          })
        })
      })
      .then((result) => {
        console.log('Creating single or double');
        console.log(tournament.type);
        var id = result['@id'];
        if (tournament.type === 'DoubleWithoutCup') {
          var queryString =
            'INSERT INTO double_elimination(tournament_id, raceTo, size) values \
                      (' + id + ',' + tournament.raceTo.single + ',' + tournament.size + ')';
        } else {
          var queryString =
            'INSERT INTO single_elimination(tournament_id, raceTo, size) values \
                      (' + id + ',' + tournament.raceTo.single + ',' + tournament.cupSize + ')';
        }
        return new Promise((resolve, reject) => {
          c.query(queryString,
            function(err, rows) {
              if (err) {
                reject(err);
              } else {
                resolve(id);
              }
            });
        });
      })
      .then((id) => {
        switch (tournament.type) {
          case "DoubleWithCup":
            console.log('Creating double with cup')
            var queryString = 'INSERT INTO double_elimination(tournament_id, raceTo, size) values \
                      (' + id + ',' + tournament.raceTo.double + ',' + tournament.size + ')';
            c.query(queryString,
              function(err, rows) {
                if (err) {
                  console.log(err);
                  transactionManager.endTransaction(c, false, cb);
                } else {
                  console.log(rows);
                  transactionManager.endTransaction(c, true, cb);
                }
              });
            break;
          case 'League':
            console.log('Creating league');
            var promise = new Promise((resolve, reject) => {
              var queryString = 'INSERT INTO double_elimination(tournament_id, raceTo, size) values \
                          (' + id + ',' + tournament.raceTo.double + ',' + 16 + ')';
              c.query(queryString,
                function(err, rows) {
                  if (err) {
                    console.log(err);
                    reject(err);
                  } else {
                    resolve(rows);
                  }
                });
            });
            promise.then((result) => {
                var queryString = 'INSERT INTO round_robin(tournament_id, raceTo, size) values \
                              (' + id + ',' + tournament.raceTo.roundrobin + ',' + 32 + ')';
                c.query(queryString,
                  function(err, rows) {
                    if (err) {
                      console.log(err);
                      transactionManager.endTransaction(c, false, cb);
                    } else {
                      transactionManager.endTransaction(c, true, cb);
                    }
                  });
              })
              .catch(function(err) {
                console.log(err);
                reject(err);
              })
            break;
          default:
            transactionManager.endTransaction(c, true, cb);
            break;
        }
      })
      .catch((error) => {
        console.log(error);
        transactionManager.endTransaction(c, false, cb);
      });

  }





}
