var
  express = require('express'),
  router = express.Router();
  db = require('../DB/dbOperations');
  dbClient = require('../DB/dbconnect').initConnection();
router.use('/api/players', require('./playerRoutes'));
router.use('/api/leagues', require('./leagueRoutes'));

router.get('/', function(req, res) {
    res.send('Hello LunabracketsAPI\n');
});

router.route('/user/login').post(function(req, res) {
    var name = req.body.name;
    var password = req.body.password;
    if (name === 'test' && password === 'test') {
        res.json({
            message: 'User verified',
            id: 1,
            name: 'test'
        });
    } else {
        res.json({
            message: 'Invalid user or password'
        });
    }
})

router.get('/tournaments', function(req, res) {
    db.tournament.getTournaments(dbClient, function(tournaments) {
        res.json(tournaments);
    });
});

router.post('/tournaments', function(req, res) {
    var tournament = req.body;
    var promise = new Promise((resolve, reject) => {
        console.log('Calling create tournament');
        db.tournament.createTournament(dbClient, tournament, function(response) {
            console.log(response);
            if (response instanceof Error) {
                console.log('response is errored')
                reject(response);
            } else {
                resolve(response);
            }
        })
    });
    promise.then((response) => {
            res.json('Success');
        })
        .catch(reason => {
            console.log(reason);
            res.status(500).send(reason);
        })

});

router.get('/tournaments/:tournament_id/participants', function(req, res) {
    db.tournament.getParticipants(dbClient, req.params.tournament_id, function(response) {
        res.json(response);
    })
});

router.post('/tournaments/:tournament_id/participants/:participant_id', function(req, res) {
    db.tournament.addParticipant(dbClient, req.params.tournament_id, req.params.participant_id, function(response) {
        res.json(response);
    })
});

router.get('/tournaments/:tournament_id/raceto/', function(req, res) {
    db.tournament.getRaceTo(dbClient, req.params.tournament_id, function(response) {
        res.json(response);
    })
});

router.get('/tournaments/:tournament_id/single-elimination', function(req, res) {
    db.tournament.singleElimination.getSingleEliminationMatches(dbClient, req.params.tournament_id, function(response) {
        res.json(response);
    })
});

router.post('/tournaments/:tournament_id/single-elimination', function(req, res) {
    var promise = new Promise((resolve,reject) => {
      db.tournament.singleElimination.createSingleEliminationMatches(dbClient, req.params.tournament_id, req.body.matches, function(response) {
          if(response instanceof Error){
            reject(response);
          }
          else {
            resolve(response);
          }
      });
    });
    promise.then((result) => {
      res.json('Single elimination tournament started successfully');
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send(reason);
    })

});

router.get('/tournaments/:tournament_id/double-elimination', function(req, res){

})

router.post('/tournaments/:tournament_id/double-elimination', function(req, res) {
  var promise = new Promise((resolve,reject) => {
    db.tournament.doubleElimination.createDoubleEliminationMatches(req.params.tournament_id, req.body.matches, function(response) {
        if(response instanceof Error){
          reject(response);
        }
        else {
          resolve(response);
        }
    });
  });
  promise.then((result) => {
    res.json('Single elimination tournament started successfully');
  })
  .catch((error) => {
    console.log(error);
    res.status(500).send(reason);
  })
});

router.post('/tournaments/:tournament_id/single-elimination/matches/:match_id', function(req, res) {
    var match = req.body.match;
    var promise = new Promise((resolve, reject) => {
      db.tournament.singleElimination.updateSingleEliminationMatch(dbClient, match, function(result){
        if(result instanceof Error){
          console.log(result);
          reject(result)
        }
        else {
          resolve(result);
        }
      });
    });
    promise.then((result) => {
      res.json('Single elimination match updated successfully');
    })
    .catch((error) =>{
      console.log(error);
      res.status(500).send(error);
    })


})

router.get('/users', function(req, res) {
    db.user.getUsers(dbClient, function(result) {
        res.json(result);
    })
});

module.exports = router;
