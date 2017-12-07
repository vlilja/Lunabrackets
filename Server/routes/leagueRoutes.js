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
  leagueHandler.getLeagues((response) => {
    res.json(response);
  })
});

router.get('/:leagueId', function(req, res) {
  var leagueId = Number(req.params.leagueId);
  if (!isNaN(leagueId)) {
    leagueHandler.getLeague(leagueId, (league) => {
      res.json(league);
    })
  } else {
    res.status(400).send('Bad request');
  }
})

router.post('/:leagueId/start', function(req, res) {
  leagueHandler.startLeague(req.params.leagueId, req.body.participants, req.body.groups, req.body.raceTo);
})

router.post('/:leagueId/start/qualifiers', function(req, res) {
  leagueHandler.startQualifiers(req.params.leagueId, function() {
    console.log('moi');
  });
  res.json('moi');
})

router.post('/:leagueId/start/finals', function(req, res) {
  leagueHandler.startFinals(req.params.leagueId, function() {
    console.log('moi');
  });
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

router.get('/:leagueId/groups/undetermined', function(req, res) {
  leagueHandler.getUndetermined(req.params.leagueId, function(response) {
    if (response instanceof Error) {
      res.json('Error fetching undetermined');
    } else {
      res.json(response);
    }
  });
})

router.post('/:leagueId/groups/undetermined/', function(req, res) {
  leagueHandler.fixUndeterminedRankings(req.params.leagueId, req.body.group, function(response) {
    if (response instanceof Error) {
      res.json('Error updating undetermined');
    } else {
      res.json(response);
    }
  })
})

router.get('/:leagueId/groups/:groupId/matches', function(req, res) {
  var leagueId = Number(req.params.leagueId);
  var groupId = Number(req.params.groupId);
  if (!isNaN(leagueId) && !isNaN(groupId)) {
    leagueHandler.getGroupMatches(leagueId, groupId, function(response) {
      if (response instanceof Error) {
        res.json('Error fetching groups');
      } else {
        res.json(response);
      }
    });
  } else {
    res.status(400).send('Bad request');
  }
})

router.post('/:leagueId/groups/:groupId/matches/:matchId', function(req, res) {
  var match = req.body.match;
  var leagueId = req.params.leagueId;
  if (!isNaN(leagueId) && typeof match === 'object') {
    leagueHandler.updateGroupStageMatch(leagueId, match, function(response) {
      if (response instanceof Error) {
        res.status(400).send(response.message);
      } else {
        res.json(response);
      }
    })
  } else {
    res.status(400).send('Bad request');
  }
})


router.get('/:leagueId/groups/:groupId/results', function(req, res) {
  leagueHandler.getGroupResults(req.params.groupId, function(response) {
    if (response instanceof Error) {
      res.json('Error fetching group results');
    } else {
      res.json(response);
    }
  });
})

router.get('/:leagueId/qualifiers/matches', function(req, res) {
  leagueHandler.getQualifierMatches(req.params.leagueId, function(response) {
    if (response instanceof Error) {
      res.json('Error fetching qualifier matches');
    } else {
      res.json(response);
    }
  })
})

router.get('/:leagueId/elimination/matches/', function(req, res) {
  leagueHandler.getEliminationMatches(req.params.leagueId, function(response) {
    if (response instanceof Error) {
      res.json('Error fetching elimination matches');
    } else {
      res.json(response);
    }
  })
})

router.post('/:leagueId/qualifiers/matches/:matchKey', function(req, res) {
  if (req.params.matchKey === req.body.match.match_key) {
    leagueHandler.updateQualifierBracket(req.params.leagueId, req.body.match, function(response) {
      if (response instanceof Error) {
        res.json('Error updating qualifiers match');
      } else {
        console.log(response);
        res.json('Success');
      }
    })
  } else {
    res.status(400).send('error');
  }
})

router.post('/:leagueId/elimination/matches/:matchKey', function(req, res) {
  if (req.params.matchKey === req.body.match.match_key) {
    leagueHandler.updateEliminationBracket(req.params.leagueId, req.body.match, function(response) {
      if (response instanceof Error) {
        res.json('Error updating elimination match');
      } else {
        console.log(response);
        res.json('Success');
      }
    })
  } else {
    res.status(400).send('error');
  }
})

router.post('/:leagueId/finals/matches/:matchKey', function(req, res) {
  if (req.params.matchKey === req.body.match.match_key) {
    leagueHandler.updateFinalsBracket(req.params.leagueId, req.body.match, function(response) {
      if (response instanceof Error) {
        res.json('Error updating elimination match');
      } else {
        console.log(response);
        res.json('Success');
      }
    })
  } else {
    res.status(400).send('error');
  }
})

router.get('/:leagueId/finals/matches/', function(req, res) {
  leagueHandler.getFinalsMatches(req.params.leagueId, function(response) {
    if (response instanceof Error) {
      res.json('Error fetching finals matches');
    } else {
      res.json(response);
    }
  })
})

module.exports = router;
