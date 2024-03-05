var neo4j = require('neo4j-driver');
require('dotenv').config()
let driver

module.exports = {

  async findAll(username) {

    try {
      driver = neo4j.driver(process.env.URI, neo4j.auth.basic(process.env.USER, process.env.PASSWORD))
      const session = driver.session()
      //const serverInfo = await driver.getServerInfo()
      //console.log('Connection established')
      //console.log(serverInfo)

      const result = await session.run(`MATCH (a:Assignment) WHERE a.username = '${username}' RETURN a ORDER BY a.id`).then(response => {

        var objData = new Date(),
          numAno = objData.getFullYear(),
          numMes = (("0" + (objData.getMonth() + 1)).slice(-2)),
          numDias = new Date(numAno, numMes, 0).getDate();

        let arrayDb = response.records.map(record => {
          let props = record.get("a").properties;
          return {
            id: props.id,
            date: props.date,
            time: props.time,
          };
        });



        let arrayFormat = []


        for (i = 1; i <= numDias; i++) {
          const day = ('0' + i).slice(-2);
          const dateSearch = (day + '/' + numMes + '/' + numAno);

          let timesDay = {
            day,
            idOpen: null,
            open: null,
            idInterval1: null,
            interval1: null,
            idInterval2: null,
            interval2: null,
            idExit: null,
            exit: null,
          }


          const arrayTimes = arrayDb.filter(function (item) {
            return item.date === dateSearch;
          });

          let idOpen = 0;
          let open = 0;
          let idInterval1 = 0;
          let interval1 = 0;
          let idInterval2 = 0;
          let interval2 = 0;
          let idExit = 0;
          let exit = 0;

          switch (arrayTimes.length) {
            case 0:
              break;
            case 1:
              idOpen = arrayTimes[0].id;
              open = arrayTimes[0].time;
              break;
            case 2:
              idOpen = arrayTimes[0].id;
              open = arrayTimes[0].time;
              idInterval1 = arrayTimes[1].id;
              interval1 = arrayTimes[1].time;
              break;
            case 3:
              idOpen = arrayTimes[0].id;
              open = arrayTimes[0].time;
              idInterval1 = arrayTimes[1].id;
              interval1 = arrayTimes[1].time;
              idInterval2 = arrayTimes[2].id;
              interval2 = arrayTimes[2].time;
              break;
            case 4:
              idOpen = arrayTimes[0].id;
              open = arrayTimes[0].time;
              idInterval1 = arrayTimes[1].id;
              interval1 = arrayTimes[1].time;
              idInterval2 = arrayTimes[2].id;
              interval2 = arrayTimes[2].time;
              idExit = arrayTimes[3].id;
              exit = arrayTimes[3].time;
              break;
          }

          timesDay = {
            day,
            idOpen,
            open,
            idInterval1,
            interval1,
            idInterval2,
            interval2,
            idExit,
            exit

          }

          arrayFormat.push(timesDay)


        }

        return arrayFormat;

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

      driver = neo4j.driver(process.env.URI, neo4j.auth.basic(process.env.USER, process.env.PASSWORD))
      const session = driver.session()

      const getSearchID = await session.run(`MATCH (a:Assignment) WHERE a.id = ${id} RETURN a`).then(response => {
        return response.records.map(record => {
          let props = record.get("a").properties;
          return {
            date: props.date,
          };
        });
      });

      const result = await session.run(`MATCH (a:Assignment) WHERE a.date = $date RETURN a`, { date: getSearchID[0].date }).then(response => {
        return response.records.map(record => {
          let props = record.get("a").properties;
          const dayArray = props.date.split('/')
          return {
            id: props.id,
            day: dayArray[0],
            time: props.time
          };
        });
      });

      let idOpen = 0;
      let open = 0;
      let idInterval1 = 0;
      let interval1 = 0;
      let idInterval2 = 0;
      let interval2 = 0;
      let idExit = 0;
      let exit = 0;

      switch (result.length) {
        case 0:
          break;
        case 1:
          idOpen = result[0].id;
          open = result[0].time;
          break;
        case 2:
          idOpen = result[0].id;
          open = result[0].time;
          idInterval1 = result[1].id;
          interval1 = result[1].time;
          break;
        case 3:
          idOpen = result[0].id;
          open = result[0].time;
          idInterval1 = result[1].id;
          interval1 = result[1].time;
          idInterval2 = result[2].id;
          interval2 = result[2].time;
          break;
        case 4:
          idOpen = result[0].id;
          open = result[0].time;
          idInterval1 = result[1].id;
          interval1 = result[1].time;
          idInterval2 = result[2].id;
          interval2 = result[2].time;
          idExit = result[3].id;
          exit = result[3].time;
          break;
      }

      const abstractFormat = {
        day: result[0].day,
        idOpen,
        open,
        idInterval1,
        interval1,
        idInterval2,
        interval2,
        idExit,
        exit

      }



      await session.close()

      return abstractFormat


    } catch (err) {
      console.log(`Connection error\n${err}\nCause: ${err.cause}`)
    } finally {
      await driver.close()
    }

  },

  async create(username) {

    try {

      driver = neo4j.driver(process.env.URI, neo4j.auth.basic(process.env.USER, process.env.PASSWORD))
      const session = driver.session()

      const dateTime = new Date();

      const padL = (nr, len = 2, chr = `0`) => `${nr}`.padStart(2, chr);

      const dateFormat = `${padL(dateTime.getDate())}/${padL(dateTime.getMonth() + 1)}/${dateTime.getFullYear()}`

      const timeFormat = `${padL(dateTime.getHours())}:${padL(dateTime.getMinutes())}:${padL(dateTime.getSeconds())}`

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

  async update(id, time) {

    try {

      driver = neo4j.driver(process.env.URI, neo4j.auth.basic(process.env.USER, process.env.PASSWORD))
      const session = driver.session()

      const result = await session.run(
        `MATCH (n:Assignment {id: ${id}}) SET n.time =  $time RETURN n`,
        { time: time }
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

      driver = neo4j.driver(process.env.URI, neo4j.auth.basic(process.env.USER, process.env.PASSWORD))
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


