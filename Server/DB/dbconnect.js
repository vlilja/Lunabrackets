const Client = require('mariasql');

module.exports = {

  client: null,

  initConnection() {
    if (!this.client) {
      this.client = new Client({
        host: '127.0.0.1',
        user: 'root',
        password: 'r00t',
        db: 'lunabrackets',
      });
    }
    return this.client;
  },
};
