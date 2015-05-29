var config = require('./package.json'),
    server = require('./server.js').create(handler);
    io = require('socket.io')(server),
    redis = require('./redis.js').client();

server.listen(config.port);

function handler(req, res){
  res.writeHead(200);
  console.log({'server': 'success!'});
}

io.set('authorization', function(data, accept) {
  var headers = data.headers,
      cookies = headers.cookie,
      http = require('http'),
      remoteHost = url.parse(headers['origin']),
      options = {
        host: remoteHost.hostname,
        port: remoteHost.port,
        path: '/',
        method: 'GET',
        headers: { 'Cookie': cookies }
      };

  if(cookies){
    request = http.request(options, function(response) {
      status = response.statusCode;
      if(status != 200)
        return accept('Invalid session', false);
    });

    request.on('error', function(e){
      //console.log(e);
    });

    request.end();
  }else{
    console.log('invalid cookie');
    return accept('Invalid session', false);
  }

  accept(null, true);
});

io.on('connection', function(socket){
  redis.on('message', function(channel, message){
    data = JSON.parse(message);
    socket.emit(data.action, data.obj)
  });
});

