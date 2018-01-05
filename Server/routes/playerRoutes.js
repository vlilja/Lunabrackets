

const express = require('express');
const db = require('../DB/dbOperations');
const dbClient = require('../DB/dbconnect').initConnection();
const Player = require('../../Datamodel/Player');

const router = express.Router();

router.get('/', (req, res) => {
  const { playerName } = req.query;
  if (playerName) {
    playerName.trim();
    db.player.searchPlayers(dbClient, playerName, (players) => {
      const converted = [];
      players.forEach((player) => {
        converted.push(Object.assign(new Player(), player));
      });
      res.json(converted);
    });
  } else {
    db.player.getAllPlayers(dbClient, (players) => {
      const converted = [];
      players.forEach((player) => {
        converted.push(Object.assign(new Player(), player));
      });
      res.json(converted);
    });
  }
});

router.get('/:id', (req, res) => {
  db.player.getPlayerById(dbClient, req.params.id, (player) => {
    res.json(player);
  });
});

module.exports = router;
