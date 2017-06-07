var Client = require('mariasql');

module.exports = {
  initConnection: function(){
    return new Client({
      host: '127.0.0.1',
      user: 'root',
      password: 'r00t',
      db: 'lunabrackets_db'
    });
  }
}
