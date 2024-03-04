var neo4j = require('neo4j-driver');
require('dotenv').config()
const URI = 'neo4j+s://3ea8112c.databases.neo4j.io'
const USER = 'neo4j'
const PASSWORD = 'IcDxKAUVpATEpjV201XGejDhQcW5zVcNkqM3BkEEn5c'
let driver

module.exports = {

  async findAll(username) {

    try {

      driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD))
      // console.log('uri: ' + process.env.URI);
      // let driver = neo4j.driver(process.env.URI, neo4j.auth.basic(process.env.USER, process.env.PASSWORD))
      const session = driver.session()
      const serverInfo = await driver.getServerInfo()
      console.log('Connection established')
      console.log(serverInfo)

      const result = await session.run(`MATCH (a:Assignment) WHERE a.username = '${username}' RETURN a`).then(response => {
        return response.records.map(record => {
          let props = record.get("a").properties;
          return {
            id: props.id,
            date: props.date,
            time: props.time,
            username: props.username
          };
        });
      });
      await session.close()

      return result



    } catch (err) {
      console.log(`Connection error\n${err}\nCause: ${err.cause}`)
    } finally {
      await driver.close()
    }

  },

  async findOne(id) {

    try {

      driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD))
      // console.log('uri: ' + process.env.URI);
      // let driver = neo4j.driver(process.env.URI, neo4j.auth.basic(process.env.USER, process.env.PASSWORD))
      const session = driver.session()

      const result = await session.run(`MATCH (a:Assignment) WHERE a.id = ${id} RETURN a`).then(response => {
        return response.records.map(record => {
          let props = record.get("a").properties;
          return {
            id: props.id,
            date: props.date,
            time: props.time,
            username: props.username
          };
        });
      });
      await session.close()

      return result



    } catch (err) {
      console.log(`Connection error\n${err}\nCause: ${err.cause}`)
    } finally {
      await driver.close()
    }

  },

  async create(username) {

    try {

      driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD))
      // console.log('uri: ' + process.env.URI);
      // let driver = neo4j.driver(process.env.URI, neo4j.auth.basic(process.env.USER, process.env.PASSWORD))
      const session = driver.session()

      const dateTime = new Date();

      const padL = (nr, len = 2, chr = `0`) => `${nr}`.padStart(2, chr);

      const dateFormat = `${padL(dateTime.getDate())}/${padL(dateTime.getMonth() + 1)}/${dateTime.getFullYear()}`

      const timeFormat = `${padL(dateTime.getHours())}%${padL(dateTime.getMinutes())}%${padL(dateTime.getSeconds())}`

      const id = Date.now();

      const result = await session.run(
        'CREATE (a:Assignment {id: $id, date: $date, time: $time, username: $username}) RETURN a',
        { id: id, date: dateFormat, time: timeFormat, username: username }
      )

      const singleRecord = result.records[0]
      const node = singleRecord.get(0)
      await session.close()

      return node



    } catch (err) {
      console.log(`Connection error\n${err}\nCause: ${err.cause}`)
    } finally {
      await driver.close()
    }

  },

  async update(id, date, time) {

    try {

      driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD))
      // console.log('uri: ' + process.env.URI);
      // let driver = neo4j.driver(process.env.URI, neo4j.auth.basic(process.env.USER, process.env.PASSWORD))
      const session = driver.session()

      const result = await session.run(
        `MATCH (n:Assignment {id: ${id}}) SET n.date =  $date, n.time =  $time RETURN n`,
        { date: date, time: time }
      )

      const singleRecord = result.records[0]
      const node = singleRecord.get(0)
      await session.close()

      return node

    } catch (err) {
      console.log(`Connection error\n${err}\nCause: ${err.cause}`)
    } finally {
      await driver.close()
    }
  },

  async delete(id) {

    try {

      driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD))
      // console.log('uri: ' + process.env.URI);
      // let driver = neo4j.driver(process.env.URI, neo4j.auth.basic(process.env.USER, process.env.PASSWORD))
      const session = driver.session()

      const result = await session.run(
        `MATCH (a:Assignment) WHERE a.id = ${id} DELETE a`
      )

      const singleRecord = result.records[0]
      const node = singleRecord.get(0)
      await session.close()

      return node

    } catch (err) {
      console.log(`Connection error\n${err}\nCause: ${err.cause}`)
    } finally {
      await driver.close()
    }
  }
}


