
module.exports = {
  getDoubleEliminationMatches: function(c, tournamentId, cb) {
    console.log('fetcing single elim');
    var queryString = 'SELECT id from double_elimination WHERE tournament_id = ' + tournamentId + ')';
    var matches = {
      winnerSide: '',
      loserSide: ''
    };
    var id;
    var promise = new Promise((resolve, reject) => {
      c.query(queryString, function(err, rows) {
        if (err) {
          reject(err)
        }
        id = rows;
        resolve(rows);
      })
    });
    promise.then(() => {
      return new Promise((resolve, reject) => {
        this.getDoubleEliminationWinnersideMatches(id, (data) => {
          if (data instanceof Error) {
            reject(data);
          } else {
            matches.winnerSide = data;
            resolve();
          }
        })
      })
    })
    .then(() => {
      this.getDoubleEliminationLosersideMatches(id, (data) => {
        if (data instanceof Error) {
          reject(data);
        } else {
          matches.loserSide = data;
          resolve();
        }
      })
    })
    .catch((error) => {
      console.log('Error while getting double elimination matches' + error);
      cb(error);
    })
  },

  getDoubleEliminationWinnersideMatches: function(c, deId, cb) {
    var queryString = 'SELECT * double_elimination WHERE tournament_id = ' + tournamentId + ')';
  },

  getDoubleEliminationLosersideMatches: function(c, deId, cb) {

  },

  createDoubleEliminationMatches: function(c, tournamentId, matches, cb) {
    var promise = new Promise((resolve, reject) => {
      c.query('SELECT id, raceTo FROM double_elimination WHERE tournament_id =' + tournamentId, function(err, rows) {
        if (err) {
          reject(err);
        } else {
          resolve(rows[0]);
        }
      })
    });
    promise.then((result) => {
        var deId = result.id;
        var raceTo = result.raceTo;
        var transaction = startTransaction();
        transaction.then((result) => {
          while (matches.winnerSide.length > 0) {
            var match = matches.winnerSide.pop();
            match.raceTo = raceTo;
            db.createDoubleEliminationWinnersideMatch(deId, match, function(result) {
              if (result instanceof Error) {
                throw result;
              }
            })
          }
          while (matches.loserSide.length > 0) {
            var match = matches.loserSide.pop();
            match.raceTo = raceTo;
            db.createDoubleEliminationLosersideMatch(deId, match, function(result) {
              if (result instanceof Error) {
                throw result;
              }
            })

          }
          this.updateTournamentStatus(tournamentId, 'started', function(res) {
            if (res instanceof Error) {
              endTransaction(false, cb);
            } else {
              endTransaction(true, cb);
            }
          });
        })
      })
      .catch((error) => {
        console.log(error);
        endTransaction(false, cb);
      });
  },

  createDoubleEliminationWinnersideMatch: function(c, deId, match, cb) {
    console.log(match.number);
    var queryString
    if (match.playerOne != null && match.playerTwo != null) {
      queryString = 'INSERT INTO de_matches_winnerside (de_id, number, playerOne, playerTwo, playerOneScore, playerTwoScore, nextMatch, raceTo)\
                      VALUES (' + deId + ',' + match.number + ',' + match.playerOne.id + ',' + match.playerTwo.id + ',' + 0 + ',' + 0 + ',' + match.nextMatch + ',' + match.raceTo + ')';
    } else {
      queryString = 'INSERT INTO de_matches_winnerside (de_id, number, playerOne, playerTwo, playerOneScore, playerTwoScore, nextMatch, raceTo)\
                                        VALUES (' + deId + ',' + match.number + ',' + null + ',' + null + ',' + 0 + ',' + 0 + ',' + match.nextMatch + ',' + match.raceTo + ')';
    }
    console.log(queryString);
    c.query(queryString, function(err, rows) {
      if (err) {
        console.log(err)
        cb(new Error('winnerside insertion failed'));
      } else {
        cb(rows);
      }
    })
  },

  createDoubleEliminationLosersideMatch: function(c, deId, match, cb) {
    var queryString = 'INSERT INTO de_matches_loserside (de_id, number, playerOne, playerTwo, playerOneScore, playerTwoScore, nextMatch, raceTo)\
                      VALUES (' + deId + ',' + match.number + ',' + null + ',' + null + ',' + 0 + ',' + 0 + ',' + match.nextMatch + ',' + match.raceTo + ')';
    c.query(queryString, function(err, rows) {
      if (err) {
        console.log(err)
        cb(new Error('loserside insertion failed'));
      } else {
        cb(rows);
      }
    })
  }
}
