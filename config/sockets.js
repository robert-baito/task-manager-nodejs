module.exports.sockets = {
  transports: ["polling", "websocket"],

  beforeConnect: function(handshake, cb) {
    var request, url, options;

    if(!handshake.headers.origin)
      return false;

    if(!handshake.headers.cookie)
      return false;

    url = require('url').parse(handshake.headers.origin);

    if(!url || !url.protocol)
      return false;

    options = {
      url: url.href,
      method: 'GET',
      headers: { 'Cookie': handshake.headers.cookie }
    };

    request = require('request');
    request.get(options, function (error, response, body) {
      if(error)
        return cb(error);

      if(response.statusCode == 200) {
        return cb(null, true);
      } else {
        return cb('Invalid', false);
      }
    });
  }
};
