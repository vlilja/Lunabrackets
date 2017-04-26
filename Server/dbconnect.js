var Client = require('mariasql');


var c = new Client({
    host: '127.0.0.1',
    user: 'root',
    password: 'r00t',
    db: 'lunabrackets_db'
});

var db = function() {};

startTransaction = function() {
    return new Promise((resolve, reject) => {
        console.log('Starting transaction');
        c.query('START TRANSACTION', function(err, rows) {
            if (err) {
                reject(err);
            } else {
                resolve('Started transaction');
            }
        })
    })
};

endTransaction = function(success, cb) {
    console.log('Ending transaction');
    if (success) {
        console.log('Ended in success');
        c.query('COMMIT', function(err, rows) {
            if (err) {
                cb(err);
            }
            cb(rows);
        });
    }
    if (!success) {
        console.log('Ended in error');
        c.query('ROLLBACK', function(err, rows) {
            if (err) {
                cb(new Error('Rollback failed'));
            }
            cb(new Error('Tournament creation failed'));
        });
    }
}



db.getTournaments = function(cb) {
    c.query('SELECT * FROM tournament', function(err, rows) {
        if (err) {
            cb(err);
        }
        cb(rows);
    });
}

db.getParticipants = function(id, cb) {
    c.query('select users.id, users.firstName, users.lastName, users.handicap from tournament_participants inner join users on tournament_participants.player_id = users.id where tournament_id =' + id, function(err, rows) {
        if (err) {
            cb(err);
        } else {
            cb(rows);
        }
    })
}

db.getUsers = function(cb) {
    c.query('SELECT * FROM users', function(err, rows) {
        if (err) {
            cb(err);
        } else {
            cb(rows);
        }
    })
}

db.getRaceTo = function(id, cb) {
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
}

db.getSingleEliminationMatches = function(tournamentId, cb) {
    var queryString = 'SELECT * from se_matches WHERE se_id = (SELECT id from single_elimination WHERE tournament_id = ' + tournamentId + ')'
    c.query(queryString, function(err, rows) {
        if (err) {
            cb(err);
        }
        cb(rows);
    })
}

db.updateSingleEliminationMatch = function(matchId, playerOneId, playerTwoId, cb) {
    var queryString = 'UPDATE se_matches SET playerOne = ' + playerOneId + ', playerTwo = ' + playerTwoId + ' WHERE id = ' + matchId;
    c.query(queryString, function(err, rows) {
        if (err) {
            cb(err);
        } else {
            cb(rows);
        }
    })
}

db.createSingleEliminationMatches = function(tournamentId, matches, cb) {
    var promise = new Promise((resolve, reject) => {
        c.query('SELECT id FROM single_elimination WHERE tournament_id =' + tournamentId, function(err, rows) {
            if (err) {
                reject(err);
            } else {
                resolve(rows[0]);
            }
        })
    });
    promise.then((result) => {
            var seId = result.id;
            var transaction = startTransaction();
            transaction.then((result) => {
                while (matches.length > 0) {
                    var match = matches.pop();
                    db.createSingleEliminationMatch(seId, match, function(result) {
                        if (result instanceof Error) {
                            throw result;
                        }
                    })
                }
                endTransaction(true, cb);
            })
        })
        .catch((error) => {
            console.log(error);
            endTransaction(false, cb);
        });
}

db.createSingleEliminationMatch = function(seId, match, cb) {
    var queryString
    if (match.playerOne != null && match.playerTwo != null) {
        queryString = 'INSERT INTO se_matches (se_id, matchNumber, playerOne, playerTwo, playerOneScore, playerTwoScore, nextMatch)\
                      VALUES (' + seId + ',' + match.number + ',' + match.playerOne.id + ',' + match.playerTwo.id + ',' + 0 + ',' + 0 + ',' + match.nextMatch + ')';
    } else {
        var queryString = 'INSERT INTO se_matches (se_id, matchNumber, playerOne, playerTwo, playerOneScore, playerTwoScore, nextMatch)\
                                        VALUES (' + seId + ',' + match.number + ',' + null + ',' + null + ',' + 0 + ',' + 0 + ',' + match.nextMatch + ')';
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

db.createTournament = function(tournament, cb) {
    console.log(startTransaction);
    var promise = startTransaction();
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
                    'INSERT INTO double_elimination(tournament_id, raceTo, size) values (' + id + ',' + tournament.raceTo.single + ',' + tournament.size + ')';
            } else {
                var queryString =
                    'INSERT INTO single_elimination(tournament_id, raceTo, size) values (' + id + ',' + tournament.raceTo.single + ',' + tournament.cupSize + ')';
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
                    var queryString = 'INSERT INTO double_elimination(tournament_id, raceTo, size) values (' + id + ',' + tournament.raceTo.double + ',' + tournament.size + ')';
                    c.query(queryString,
                        function(err, rows) {
                            if (err) {
                                console.log(err);
                                endTransaction(false, cb);
                            } else {
                                console.log(rows);
                                endTransaction(true, cb);
                            }
                        });
                    break;
                case 'League':
                    console.log('Creating league');
                    var promise = new Promise((resolve, reject) => {
                        var queryString = 'INSERT INTO double_elimination(tournament_id, raceTo, size) values (' + id + ',' + tournament.raceTo.double + ',' + 16 + ')';
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
                            var queryString = 'INSERT INTO round_robin(tournament_id, raceTo, size) values (' + id + ',' + tournament.raceTo.roundrobin + ',' + 32 + ')';
                            c.query(queryString,
                                function(err, rows) {
                                    if (err) {
                                        console.log(err);
                                        endTransaction(false, cb);
                                    } else {
                                        endTransaction(true, cb);
                                    }
                                });
                        })
                        .catch(function(err) {
                            console.log(err);
                            reject(err);
                        })
                    break;
                default:
                    endTransaction(true, cb);
                    break;
            }
        })
        .catch((error) => {
            console.log(error);
            endTransaction(false, cb);
        });

}

db.addParticipant = function(tournamentId, participantId, cb) {
    var promise = startTransaction();
    promise.then((result) => {
            var queryString = 'INSERT INTO tournament_participants(tournament_id, player_id) VALUES(' + tournamentId + ',' + participantId + ')';
            c.query(queryString, function(err, rows) {
                if (err) {
                    endTransaction(false, cb);
                } else {
                    endTransaction(true, cb);
                }
            })
        })
        .catch((error) => {
            console.log(error);
            endTransaction(false, cb);
        });
}



module.exports = db;
