const service = require('../services/neo4j/index')

module.exports = {

    async index(req, res, next) {
        try {
            const {username} = req.headers;
            const result = await service.findAll(username);
            res.send(result);
        } catch (err) {
           res.send(err)
        }

        next()
    },

    async show(req, res, next) {
        try {
            const { id } = req.params;
            console.log(id)
            const result = await service.findOne(id);
            res.send(result);
        } catch (err) {
           res.send(err)
        }

        next()
    },

    async post(req, res, next) {
        try {
            const {username} = req.body;
            const result = await service.create(username);
            res.send(result);
        } catch (err) {
           res.send(err)
        }

        next()
    },

    async update (req, res, next) {
        try {
            const { id } = req.params;
            const {date, time} = req.body;
            const result = await service.update(id, date, time);
            res.send(result);
        } catch (err) {
           res.send(err)
        }

        next()
    },

    async delete (req, res, next) {
        try {
            const { id } = req.params;
            await service.delete(id);
            res.send('Removido com sucesso');
        } catch (err) {
           res.send(err)
        }

        next()
    }
}