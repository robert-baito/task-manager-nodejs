var config = require('./package.json');

exports.create = function (handler){
  var server;

  if(config.ssl){
    var fs = require('fs'),
      options = {
        key: fs.readFileSync(config.ssl.key),
        cert: fs.readFileSync(config.ssl.cert)
      };

    server = require('https').createServer(options, handler);
  }else{
    server = require('http').createServer(handler);
  }

  return server;
}
