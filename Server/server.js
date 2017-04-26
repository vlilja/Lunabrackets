var express = require('express');
var bodyParser = require('body-parser');
var db = require('./dbconnect');
var app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
var router = express.Router();
app.use(function(req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use('/api', router);

router.get('/', function(req, res) {
    res.send('Hello LunabracketsAPI\n');
});

router.route('/user/login').post(function(req, res) {
    var name = req.body.name;
    var password = req.body.password;
    if (name === 'test' && password === 'test') {
        res.json({
            message: 'User verified',
            id: 1,
            name: 'test'
        });
    } else {
        res.json({
            message: 'Invalid user or password'
        });
    }
})

router.get('/tournaments', function(req, res) {
    db.getTournaments(function(tournaments) {
        res.json(tournaments);
    });
});

router.post('/tournaments', function(req, res) {
    var tournament = req.body;
    var promise = new Promise((resolve, reject) => {
        console.log('Calling create tournament');
        db.createTournament(tournament, function(response) {
            console.log(response);
            if (response instanceof Error) {
                console.log('response is errored')
                reject(response);
            } else {
                resolve(response);
            }
        })
    });
    promise.then((response) => {
            res.json('Success');
        })
        .catch(reason => {
            console.log(reason);
            res.status(500).send(reason);
        })

});

router.get('/tournaments/:tournament_id/participants', function(req, res) {
    db.getParticipants(req.params.tournament_id, function(response) {
        res.json(response);
    })
});

router.post('/tournaments/:tournament_id/participants/:participant_id', function(req, res) {
    db.addParticipant(req.params.tournament_id, req.params.participant_id, function(response) {
        res.json(response);
    })
});

router.get('/tournaments/:tournament_id/raceto/', function(req, res) {
    db.getRaceTo(req.params.tournament_id, function(response) {
        res.json(response);
    })
});

router.get('/tournaments/:tournament_id/single-elimination', function(req, res) {
    db.getSingleEliminationMatches(req.params.tournament_id, function(response) {
        res.json(response);
    })
});

router.post('/tournaments/:tournament_id/single-elimination', function(req, res) {
    db.createSingleEliminationMatches(req.params.tournament_id, req.body.matches, function(response) {
        console.log(response);
    });
});

router.post('/tournaments/:tournament_id/single-elimination/:match_id', function(req, res) {
    db.updateSingleEliminationMatch(req.params.match_id, req.body.playerOneId, req.body.playerTwoId, function(response) {
        res.json(response);
    });
})

router.get('/users', function(req, res) {
    db.getUsers(function(result) {
        res.json(result);
    })
});

app.listen(3001);
console.log('Listening on port 3001...');
