
const express = require('express');
const leagueHandler = require('../handlers/leagueHandler');
const authHelper = require('../helpers/authorizationHelper');

const router = express.Router();

router.post('/', (req, res) => {
  const league = req.body;
  const auth = req.get('authorization');
  const [id] = Buffer.from(auth.split(' ').pop(), 'base64').toString('ascii').split(':');
  leagueHandler.createLeague(league, id, (response) => {
    if (response instanceof Error) {
      res.status(400).send('Error creating league');
    } else {
      res.json('League created successfully');
    }
  });
});

router.get('/', (req, res) => {
  leagueHandler.getLeagues((response) => {
    res.json(response);
  });
});

router.get('/:leagueId', (req, res) => {
  const leagueId = Number(req.params.leagueId);
  if (!Number.isNaN(leagueId)) {
    leagueHandler.getLeague(leagueId, (league) => {
      res.json(league);
    });
  } else {
    res.status(400).send('Bad request');
  }
});

router.post('/:leagueId/start', (req, res) => {
  const { leagueId } = req.params;
  const { players, groupNames, raceTo } = req.body;
  try {
    const userId = authHelper.readUserId(req);
    if (!Number.isNaN(leagueId) && players.length > 0 && Number(raceTo) > 1 && !Number.isNaN(userId)) {
      leagueHandler.startLeague(leagueId, players, groupNames, raceTo, userId, (response) => {
        if (response instanceof Error) {
          res.status(400).send('Error starting the league');
        } else {
          res.json(response);
        }
      });
    } else {
      res.status(400).send('Bad request');
    }
  } catch (e) {
    res.status(403).send(e.message);
  }
});

router.get('/:leagueId/finish', (req, res) => {
  const leagueId = Number(req.params.leagueId);
  try {
    const userId = authHelper.readUserId(req);
    if (!Number.isNaN(leagueId) && !Number.isNaN(userId)) {
      leagueHandler.finishLeague(leagueId, userId, (response) => {
        if (response instanceof Error) {
          res.status(400).send('Error finishing the league');
        } else {
          res.json('League finished');
        }
      });
    } else {
      res.status(400).send('Bad request');
    }
  } catch (e) {
    res.status(403).send(e.message);
  }
});

router.get('/:leagueId/start/qualifiers', (req, res) => {
  try {
    const leagueId = Number(req.params.leagueId);
    const userId = authHelper.readUserId(req);
    if (!Number.isNaN(leagueId) && !Number.isNaN(userId)) {
      leagueHandler.startQualifiers(req.params.leagueId, userId, (response) => {
        if (response instanceof Error) {
          res.status(400).send('Error starting qualifiers');
        } else {
          res.json('Qualifiers started successfully');
        }
      });
    } else {
      res.status(400).send('Bad request');
    }
  } catch (e) {
    res.status(403).send(e.message);
  }
});

router.post('/:leagueId/start/finals', (req, res) => {
  const { leagueId } = req.params;
  const { players } = req.body;
  try {
    const userId = authHelper.readUserId(req);
    if (!Number.isNaN(Number(leagueId)) && players.groupStage.length === 4 &&
  players.qualifiers.length === 4) {
      leagueHandler.startFinals(leagueId, players, userId, (response) => {
        if (response instanceof Error) {
          res.status(400).send('Error starting finals');
        } else {
          res.json('Finals started successfully');
        }
      });
    } else {
      res.status(400).send('Bad request');
    }
  } catch (e) {
    res.status(403).send(e.message);
  }
});

router.get('/:leagueId/results', (req, res) => {
  const leagueId = Number(req.params.leagueId);
  if (!Number.isNaN(leagueId)) {
    leagueHandler.getResults(leagueId, (response) => {
      if (response instanceof Error) {
        res.status(400).send('Error fetching results');
      }
      res.json(response);
    });
  } else {
    res.status(400).send('Bad request');
  }
});

router.get('/:leagueId/groups', (req, res) => {
  leagueHandler.getGroups(req.params.leagueId, (response) => {
    if (response instanceof Error) {
      res.status(400).send('Error fetching groups');
    } else {
      res.json(response);
    }
  });
});

router.get('/:leagueId/groups/undetermined', (req, res) => {
  leagueHandler.getUndetermined(req.params.leagueId, (response) => {
    if (response instanceof Error) {
      res.status(400).send('Error fetching undetermined');
    } else {
      res.json(response);
    }
  });
});

router.post('/:leagueId/groups/undetermined/', (req, res) => {
  const { leagueId } = req.params;
  const { group } = req.body;
  try {
    const userId = authHelper.readUserId(req);
    if (!Number.isNaN(Number(leagueId))) {
      leagueHandler.fixUndeterminedRankings(leagueId, group, userId, (reows, response) => {
        if (response instanceof Error) {
          res.status(400).send('Error updating undetermined');
        } else {
          res.json(response);
        }
      });
    } else {
      res.status(400).send('Bad request');
    }
  } catch (e) {
    res.status(403).send(e.message);
  }
});

router.get('/:leagueId/groups/:groupId/matches', (req, res) => {
  const leagueId = Number(req.params.leagueId);
  const groupId = Number(req.params.groupId);
  if (!Number.isNaN(leagueId) && !Number.isNaN(groupId)) {
    leagueHandler.getGroupMatches(leagueId, groupId, (response) => {
      if (response instanceof Error) {
        res.status(400).send('Error fetching groups');
      } else {
        res.json(response);
      }
    });
  } else {
    res.status(400).send('Bad request');
  }
});

router.post('/:leagueId/groups/:groupId/matches/:matchId', (req, res) => {
  const { match } = req.body;
  const { leagueId } = req.params;
  try {
    const userId = authHelper.readUserId(req);
    if (!Number.isNaN(leagueId) && typeof match === 'object' && !Number.isNaN(userId)) {
      leagueHandler.updateGroupStageMatch(leagueId, match, userId, (response) => {
        if (response instanceof Error) {
          res.status(400).send(response.message);
        } else {
          res.json(response);
        }
      });
    } else {
      res.status(400).send('Bad request');
    }
  } catch (e) {
    res.status(403).send(e.message);
  }
});


router.get('/:leagueId/groups/:groupId/results', (req, res) => {
  leagueHandler.getGroupResults(req.params.groupId, (response) => {
    if (response instanceof Error) {
      res.json('Error fetching group results');
    } else {
      res.json(response);
    }
  });
});

router.get('/:leagueId/qualifiers/matches', (req, res) => {
  leagueHandler.getQualifierMatches(req.params.leagueId, (response) => {
    if (response instanceof Error) {
      res.json('Error fetching qualifier matches');
    } else {
      res.json(response);
    }
  });
});

router.get('/:leagueId/elimination/matches/', (req, res) => {
  leagueHandler.getEliminationMatches(req.params.leagueId, (response) => {
    if (response instanceof Error) {
      res.json('Error fetching elimination matches');
    } else {
      res.json(response);
    }
  });
});

router.post('/:leagueId/qualifiers/matches/:matchId', (req, res) => {
  const { match } = req.body;
  const { leagueId } = req.params;
  try {
    const userId = authHelper.readUserId(req);
    if (!Number.isNaN(leagueId) && typeof match === 'object' && !Number.isNaN(userId)) {
      leagueHandler.updateQualifierBracket(leagueId, match, userId, (response) => {
        if (response instanceof Error) {
          res.status(400).send(response.message);
        } else {
          res.json(response);
        }
      });
    } else {
      res.status(400).send('Bad request');
    }
  } catch (e) {
    res.status(403).send(e.message);
  }
});

router.post('/:leagueId/elimination/matches/:matchId', (req, res) => {
  const { match } = req.body;
  const { leagueId } = req.params;
  try {
    const userId = authHelper.readUserId(req);
    if (!Number.isNaN(leagueId) && typeof match === 'object') {
      leagueHandler.updateEliminationBracket(leagueId, match, userId, (response) => {
        if (response instanceof Error) {
          res.status(400).send('Error updating elimination match');
        } else {
          res.json('Success');
        }
      });
    } else {
      res.status(400).send('Bad request');
    }
  } catch (e) {
    res.status(403).send(e.message);
  }
});

router.post('/:leagueId/finals/matches/:matchId', (req, res) => {
  const { match } = req.body;
  const { leagueId } = req.params;
  try {
    const userId = authHelper.readUserId(req);
    if (!Number.isNaN(leagueId) && typeof match === 'object') {
      leagueHandler.updateFinalsBracket(leagueId, match, userId, (response) => {
        if (response instanceof Error) {
          res.status(400).send('Error updating finals match');
        } else {
          res.json('Success');
        }
      });
    } else {
      res.status(400).send('Bad request');
    }
  } catch (e) {
    res.status(403).send(e.message);
  }
});

router.get('/:leagueId/finals/matches/', (req, res) => {
  leagueHandler.getFinalsMatches(req.params.leagueId, (response) => {
    if (response instanceof Error) {
      res.json('Error fetching finals matches');
    } else {
      res.json(response);
    }
  });
});

module.exports = router;
