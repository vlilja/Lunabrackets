const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const https = require('https');

const privateKey = fs.readFileSync('/encryption/domain.key', 'utf8');
const certificate = fs.readFileSync('/encryption/domain.crt', 'utf8');

const credentials = { key: privateKey, cert: certificate };

const app = express();

app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(bodyParser.json());

app.use((req, res, next) => {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'https://localhost:8080');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);
  // Pass to next layer of middleware
  next();
});

app.use(require('./routes'));

const httpsServer = https.createServer(credentials, app);

httpsServer.listen(3001);
console.log('Listening on port 3001...');
