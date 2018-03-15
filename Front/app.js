const express = require('express');
const helmet = require('helmet');
const path = require('path');

const app = express();
const reroute = express();


app.use(helmet());
app.disable('x-powered-by');
app.set('trust proxy', 1); // trust first proxy

app.use(express.static(`${__dirname}/dist`));

// viewed at http://localhost:8080
app.get('/*', (req, res) => {
  res.sendFile(path.join(`${__dirname}/dist/index.html`));
});

reroute.get('*', (req, res) => {
  res.redirect('https://lunabrackets.com');
});

reroute.listen(8081);
app.listen(8080);
