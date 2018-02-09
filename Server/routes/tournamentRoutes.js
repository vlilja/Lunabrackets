const express = require('express');
const tournamentHandler = require('../handlers/tournamentHandler');

const router = express.Router();

router.get('/', (req, res) => {
  tournamentHandler.getAllTournaments((response) => {
    if (response instanceof Error) {
      res.status(400).send('Error fetching tournaments');
    } else {
      res.json(response);
    }
  });
});

router.post('/', (req, res) => {
  const { tournament } = req.body;
  console.log(req.headers);
  if (tournament && tournament.name && tournament.game && tournament.season) {
    tournamentHandler.createTournament(tournament, (response) => {
      if (response instanceof Error) {
        res.status(400).send('Error creating tournament');
      } else {
        res.json(response);
      }
    });
  } else {
    res.status(400).send('Bad request');
  }
});

router.get('/:id', (req, res) => {
  const tournamentId = req.params.id;
  if (!Number.isNaN(tournamentId)) {
    tournamentHandler.getTournament(tournamentId, (response) => {
      if (response instanceof Error) {
        res.status(400).send('Error fetching tournament');
      } else {
        res.json(response);
      }
    });
  } else {
    res.status(400).send('Bad request');
  }
});

router.get('/:id/results', (req, res) => {
  const tournamentId = req.params.id;
  if (!Number.isNaN(tournamentId)) {
    tournamentHandler.getResults(tournamentId, (response) => {
      if (response instanceof Error) {
        res.status(400).send('Error fetching tournament results');
      } else {
        res.json(response);
      }
    });
  } else {
    res.status(400).send('Bad request');
  }
});

router.post('/:id/results', (req, res) => {
  const tournamentId = req.params.id;
  const { results } = req.body;
  if (!Number.isNaN(tournamentId)) {
    tournamentHandler.completeTournament(tournamentId, results, (response) => {
      if (response instanceof Error) {
        res.status(400).send('Error creating tournament results');
      } else {
        res.json(response);
      }
    });
  } else {
    res.status(400).send('Bad request');
  }
});


module.exports = router;
