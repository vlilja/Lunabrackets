const express = require('express');

const userHandler = require('../handlers/userHandler');

const router = express.Router();


router.get('/fb/:id', (req, res) => {
  userHandler.getUserByFb(req.params.id, (response) => {
    res.json(response);
  });
});

router.post('/', (req, res) => {
  const { user } = req.body;
  userHandler.createUser(user, (response) => {
    if (response instanceof Error) {
      res.status(400).send('Error creating user');
    } else {
      res.json(response);
    }
  });
});


module.exports = router;
