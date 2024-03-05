require('dotenv').config();

var server = require('./server/index');

server.listen(3333, function() {
    console.log('%s listening at %s', server.name, server.url);
});