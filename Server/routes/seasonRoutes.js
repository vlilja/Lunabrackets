const express = require('express');
const seasonHandler = require('../handlers/seasonHandler');
const authHelper = require('../helpers/authorizationHelper');

const router = express.Router();


router.get('/', (req, res) => {
  seasonHandler.getAllSeasons((response) => {
    if (response instanceof Error) {
      res.status(400).send('Error fetching seasons');
    } else {
      res.json(response);
    }
  });
});

router.post('/', (req, res) => {
  const { season } = req.body;
  if (req.user.admin === '1') {
    try {
      if (season && typeof season === 'object') {
        seasonHandler.createSeason(season, req.user.id, (response) => {
          if (response instanceof Error) {
            res.status(400).send('Error creating season');
          } else {
            res.json(response);
          }
        });
      }
    } catch (e) {
      res.status(403).send(e.message);
    }
  } else {
    res.status(403).send('Unauthorized');
  }
});

router.get('/:seasonId', (req, res) => {
  const seasonId = Number(req.params.seasonId);
  if (!Number.isNaN(seasonId)) {
    seasonHandler.getSeason(seasonId, (response) => {
      if (response instanceof Error) {
        res.status(400).send('Error fetching season');
      } else {
        res.json(response);
      }
    });
  } else {
    res.status(400).send('Bad request');
  }
});

router.get('/:seasonId/activate', (req, res) => {
  const seasonId = Number(req.params.seasonId);
  try {
    const userId = authHelper.readUserId(req);
    if (!Number.isNaN(seasonId)) {
      seasonHandler.setActive(seasonId, userId, (response) => {
        if (response instanceof Error) {
          res.status(400).send('Error activating season');
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

router.get('/:seasonId/inactivate', (req, res) => {
  const seasonId = Number(req.params.seasonId);
  try {
    const userId = authHelper.readUserId(req);
    if (!Number.isNaN(seasonId)) {
      seasonHandler.setInactive(seasonId, userId, (response) => {
        if (response instanceof Error) {
          res.status(400).send('Error inactivating season');
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

module.exports = router;
