const express = require('express');
const fs = require('fs');

const app = express();
const path = require('path');

const https = require('https');

const privateKey = fs.readFileSync('/encryption/domain.key', 'utf8');
const certificate = fs.readFileSync('/encryption/domain.crt', 'utf8');

const credentials = { key: privateKey, cert: certificate };

app.use(express.static(`${__dirname}/dist`));

// viewed at http://localhost:8080
app.get('/*', (req, res) => {
  res.sendFile(path.join(`${__dirname}/dist/index.html`));
});


const httpsServer = https.createServer(credentials, app);

httpsServer.listen(8080);
