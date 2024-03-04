var restify = require('restify');
const routes = require('../http/router');
const cors = require('./cors')
//const jwtMiddleware = require('./jwtMiddleware')

var server = restify.createServer();

server.pre(cors.preflight)
server.use(cors.actual)
server.use(restify.plugins.bodyParser())
// server.use(jwtMiddleware({ exclusions }))

routes(server);

module.exports = server
