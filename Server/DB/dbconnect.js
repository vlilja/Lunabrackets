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
    const credentials = readDbCredentials();
    if (!this.client) {
      this.client = new Client({
        host: '127.0.0.1',
        user: credentials.username,
        password: credentials.password,
        db: 'lunabrackets',
      });
    }
    return this.client;
  },
};
