module.exports = function redisHooks(sails) {
  return {
    initialize: initialize
  };

  function initialize(cb) {
    client = require('redis').createClient();

    client.subscribe(sails.config.redis.namespace);

    client.on('message', function(channel, message){
      data = JSON.parse(message);

      sails.io.emit(data.action, data.task);
    });

    sails.config.redis = client;

    return cb();
  }
}
