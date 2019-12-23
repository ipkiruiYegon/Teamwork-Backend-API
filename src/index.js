const config = require('config');

const debug = require('debug')('teamwork-backend-api:debug');

const app = require('./app');

const listen = app.listen(config.get('port'), () => {
  debug(
    `server is running on port ${config.get('port')} and in ${config.get(
      'name'
    )} mode`
  );
  console.log(
    `server is running on port ${config.get('port')} and in ${config.get(
      'name'
    )} mode`
  );
});

module.exports = app;
module.exports.port = listen.address().port;
