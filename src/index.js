require('dotenv').config();

var server = require('./server/index');

server.listen(8080, function() {
    console.log('%s listening at %s', server.name, server.url);
});