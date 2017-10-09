var
  express = require('express'),
  router = express.Router(),
  db = require('../DB/dbOperations'),
  dbClient = require('../DB/dbconnect').initConnection(),
  leagueHandler = require('../handlers/leagueHandler');

router.post('/', function(req, res) {
  db.league.createLeague(dbClient, req.body, function(response, additional) {
    res.json(additional);
  });
});

router.get('/', function(req, res) {
  db.league.getAllLeagues(dbClient, function(response) {
    res.json(response);
  });
});

router.get('/:leagueId', function(req, res) {
  var leagueDetails = new Promise((resolve, reject) => {
    db.league.getLeague(dbClient, req.params.leagueId, function(response) {
      if (response instanceof Error) {
        reject(response);
      } else {
        resolve(response);
      }
    })
  })
  var participants = new Promise((resolve, reject) => {
    db.player.getPlayersByLeagueId(dbClient, req.params.leagueId, function(response) {
      if (response instanceof Error) {
        reject(response);
      } else {
        resolve(response);
      }
    })
  })
  Promise.all([leagueDetails, participants]).then((response) => {
      var league = response[0];
      league.participants = response[1];
      res.json(league);
    })
    .catch((error) => {
      console.log(error);
      res.json(error);
    })
})

router.post('/:leagueId/start', function(req, res) {
  leagueHandler.startLeague(req.params.leagueId, req.body.participants, req.body.groups);
  res.json('moi');
})

router.get('/:leagueId/groups', function(req, res) {
  leagueHandler.getGroups(req.params.leagueId, function(response) {
    if (response instanceof Error) {
      res.json('Error fetching groups');
    } else {
      res.json(response);
    }
  });
})

router.get('/:leagueId/groups/:groupId/matches', function(req, res) {
  leagueHandler.getGroupMatches(req.params.leagueId, req.params.groupId, function(response) {
    if (response instanceof Error) {
      res.json('Error fetching groups');
    } else {
      res.json(response);
    }
  });
})

module.exports = router;
