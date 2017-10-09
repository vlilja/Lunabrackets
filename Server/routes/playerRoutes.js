
var
  express = require('express'),
  router = express.Router();
  db = require('../DB/dbOperations');
  dbClient = require('../DB/dbconnect').initConnection();

router.get('/', function(req, res) {
  var playerName = req.query.playerName
  if(playerName) {
    playerName.trim();
    db.player.searchPlayers(dbClient, playerName, function(players) {
        res.json(players);
    });
  }
  else {
    db.player.getAllPlayers(dbClient, function(players) {
        res.json(players);
    });
  }

});

router.get('/:id' , function(req, res) {
  db.player.getPlayerById(dbClient, req.params.id, function(player) {
    res.json(player);
  })
});

module.exports = router;
