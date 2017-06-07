var transactionManager = require('./transactionManager');

module.exports = {

  getSingleEliminationMatches: function(c, tournamentId, cb) {
    console.log('fetcing single elim');
    var queryString = 'SELECT * from se_matches WHERE se_id = (SELECT id from single_elimination WHERE tournament_id = ' + tournamentId + ') ORDER BY number ASC'
    c.query(queryString, function(err, rows) {
      if (err) {
        console.log(err);
        cb(err);
      }
      console.log(rows);
      cb(rows);
    })
  },

  updateSingleEliminationMatch: function(c, match, cb) {
    var playerOne = match.playerOne != null ? 'playerOne = "' + match.playerOne + '",' : '';
    var playerTwo = match.playerTwo != null ? 'playerTwo = "' + match.playerTwo + '",' : '';
    var queryString = 'UPDATE se_matches SET ' + playerOne + ' ' + playerTwo + ' \
      playerOneScore = "' + match.playerOneScore + '", playerTwoScore = "' + match.playerTwoScore + '", complete = "' + match.complete + '"  WHERE id = ' + match.id;
    console.log(queryString);
    c.query(queryString, function(err, rows) {
      if (err) {
        cb(err);
      } else {
        cb(rows);
      }
    })
  },


  createSingleEliminationMatches: function(c, tournamentId, matches, cb) {
    var promise = new Promise((resolve, reject) => {
      c.query('SELECT id, raceTo FROM single_elimination WHERE tournament_id =' + tournamentId, function(err, rows) {
        if (err) {
          reject(err);
        } else {
          resolve(rows[0]);
        }
      })
    });
    promise.then((result) => {
        var seId = result.id;
        var raceTo = result.raceTo;
        var transaction = transactionManager.startTransaction(c);
        transaction.then((result) => {
          while (matches.length > 0) {
            var match = matches.pop();
            match.raceTo = raceTo;
            db.createSingleEliminationMatch(seId, match, function(result) {
              if (result instanceof Error) {
                throw result;
              }
            })
          }
          this.updateTournamentStatus(tournamentId, 'started', function(res) {
            console.log(res);
            if (res instanceof Error) {
              transactionManager.endTransaction(c, false, cb);
            } else {
              transactionManager.endTransaction(c, true, cb);
            }
          });
        })
      })
      .catch((error) => {
        console.log(error);
        transactionManager.endTransaction(c, false, cb);
      });
  },

  createSingleEliminationMatch: function(c, seId, match, cb) {
    var queryString;
    console.log(match);
    if (match.playerOne != null && match.playerTwo != null) {
      queryString = 'INSERT INTO se_matches (se_id, number, playerOne, playerTwo, playerOneScore, playerTwoScore, nextMatch, raceTo)\
                        VALUES (' + seId + ',' + match.number + ',' + match.playerOne.id + ',' + match.playerTwo.id + ',' + 0 + ',' + 0 + ',' + match.nextMatch + ',' + match.raceTo + ')';
    } else {
      queryString = 'INSERT INTO se_matches (se_id, number, playerOne, playerTwo, playerOneScore, playerTwoScore, nextMatch, raceTo)\
                                          VALUES (' + seId + ',' + match.number + ',' + null + ',' + null + ',' + 0 + ',' + 0 + ',' + match.nextMatch + ',' + match.raceTo + ')';
    }
    c.query(queryString, function(err, rows) {
      if (err) {
        console.log(err)
        cb(new Error('insertion failed'));
      } else {
        cb(rows);
      }
    })
  }

}
