const { Client } = require('pg');

module.exports = function(user, password) {
    return new Client({
      user: user,
      host: 'localhost',
      database: 'urbanexplorer',
      password: password,
      port: 5432,
    })
}

