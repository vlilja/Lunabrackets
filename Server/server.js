var express = require('express');
var app = express();

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');

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

app.get('/', function(req, res) {
  res.send('Hello Lunabrackets\n');
});

app.get('/getUsers', function(req, res) {
  res.send([{"id":1,"first_name":"Amy","last_name":"Payne","email":"apayne0@moonfruit.com","gender":"Female","ip_address":"192.249.79.105"},
{"id":2,"first_name":"Phyllis","last_name":"Wright","email":"pwright1@tamu.edu","gender":"Female","ip_address":"208.8.207.2"},
{"id":3,"first_name":"Anna","last_name":"Greene","email":"agreene2@apple.com","gender":"Female","ip_address":"148.251.33.74"},
{"id":4,"first_name":"Craig","last_name":"Knight","email":"cknight3@twitter.com","gender":"Male","ip_address":"110.13.238.153"},
{"id":5,"first_name":"Michelle","last_name":"Wells","email":"mwells4@intel.com","gender":"Female","ip_address":"62.170.167.199"}]);
});
app.listen(3001);
console.log('Listening on port 3001...');
