const express = require('express');

const router = express.Router();
router.use('/api/players', require('./playerRoutes'));
router.use('/api/users', require('./userRoutes'));
router.use('/api/leagues', require('./leagueRoutes'));
router.use('/api/seasons', require('./seasonRoutes'));
router.use('/api/tournaments', require('./tournamentRoutes'));

router.get('/', (req, res) => {
  res.send('Hello LunabracketsAPI\n');
});


module.exports = router;
