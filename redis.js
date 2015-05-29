var config = require('./package.json'),
    Redis = require('redis'),
    Url = require('url');

exports.client = function() {
  var client;
  if(config.redis_url){
    var url = Url.parse(config.redis_url);
    client = Redis.createClient(url.port, url.hostname);
  }else{
    client = Redis.createClient();
  }
  client.subscribe(config.namespace);
  return client;
}
