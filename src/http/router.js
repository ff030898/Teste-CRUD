const assignmentsController = require('../controller/assignmentsController')

const routes = (server) => {
    server.get('/assignments', assignmentsController.index);
    server.get('/assignments/:id', assignmentsController.show);
    server.post('/assignments', assignmentsController.post);
    server.put('/assignments/:id', assignmentsController.update);
    server.post('/assignments/:id', assignmentsController.delete);
}

module.exports = routes