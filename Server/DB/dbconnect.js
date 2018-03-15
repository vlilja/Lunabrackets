const Client = require('mariasql');
const fs = require('fs');

function readDbCredentials() {
  const contents = fs.readFileSync(`${__dirname}/../dbcredentials.txt`, 'utf8');
  const arr = contents.replace('\n', '').split(':');
  return { username: arr[0], password: arr[1] };
}

module.exports = {

  client: null,

  initConnection() {
    if (!this.client) {
      const credentials = readDbCredentials();
      let db;
      if (process.env.NODE_ENV === 'production') {
        db = 'lunabrackets-test';
      } else {
        db = 'lunabrackets-test';
      }
      this.client = new Client({
        host: '127.0.0.1',
        user: credentials.username,
        password: credentials.password,
        db,
      });
    }
    return this.client;
  },
};
