const express = require('express');
const seasonHandler = require('../handlers/seasonHandler');

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
  if (season && typeof season === 'object') {
    seasonHandler.createSeason(season, (response) => {
      if (response instanceof Error) {
        res.status(400).send('Error creating season');
      } else {
        res.json(response);
      }
    });
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

router.post('/:seasonId/active', (req, res) => {
  const seasonId = Number(req.params.seasonId);
  if (!Number.isNaN(seasonId)) {
    seasonHandler.setActive(seasonId, (response) => {
      if (response instanceof Error) {
        res.status(400).send('Error activating season');
      } else {
        res.json(response);
      }
    });
  } else {
    res.status(400).send('Bad request');
  }
});

router.post('/:seasonId/inactive', (req, res) => {
  const seasonId = Number(req.params.seasonId);
  if (!Number.isNaN(seasonId)) {
    seasonHandler.setInactive(seasonId, (response) => {
      if (response instanceof Error) {
        res.status(400).send('Error inactivating season');
      } else {
        res.json(response);
      }
    });
  } else {
    res.status(400).send('Bad request');
  }
});

module.exports = router;
