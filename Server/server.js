const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const fs = require('fs');
const https = require('https');
const axios = require('axios');
const userHandler = require('./handlers/userHandler');

const privateKey = fs.readFileSync('/encryption/domain.key', 'utf8');
const certificate = fs.readFileSync('/encryption/domain.crt', 'utf8');
const appSecret = fs.readFileSync(`${__dirname}/appsecret.txt`, 'utf-8').replace('\n', '');


const credentials = { key: privateKey, cert: certificate };

const app = express();

app.use(helmet());

app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(bodyParser.json());

let corsUrl = 'https://localhost:8080';
const fbGraphApi = 'https://graph.facebook.com/debug_token';

if (process.env.NODE_ENV === 'production') {
  corsUrl = 'https://lunabrackets.com';
}

app.use((req, res, next) => {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', corsUrl);

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


app.use((req, res, next) => {
  const auth = req.get('authorization');
  if (!req.headers['access-control-request-method'] && auth) {
    const token = Buffer.from(auth.split(' ').pop(), 'base64').toString('ascii').split(':').pop();
    axios.get(fbGraphApi, { params: { input_token: token, access_token: appSecret } })
      .then((response) => {
        const { data } = response.data;
        const expiry = new Date(Number(data.expires_at) * 1000);
        const now = new Date().getTime();
        const diff = expiry - now;
        if (data.application === 'lunabrackets' && Number(diff) > 0) {
          userHandler.getUserByFb(data.user_id, (user) => {
            if (user[0] && user[0].id) {
              [req.user] = user;
              next();
            } else {
              res.json('No user profile');
            }
          });
        }
      })
      .catch((e) => {
        console.log(e.response.data);
        res.status(403).send('Unauthorized');
      });
  } else if (req.headers['access-control-request-method'] || req.path === '/api/users/') {
    next();
  } else {
    res.status(403).send('Unauthorized');
  }
});


app.use(require('./routes'));

const httpsServer = https.createServer(credentials, app);

httpsServer.listen(3001);
console.log('Listening on port 3001...');
