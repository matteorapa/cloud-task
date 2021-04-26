'use strict';

const express = require('express');

const app = express();

const createPostgresClient = () => {
  const Client = require('pg').Client
  const dbSocketPath = process.env.DB_SOCKET_PATH || '/cloudsql'

  return new Client({
    // specifying connection parameters from env file
    host: `${dbSocketPath}/${process.env.CLOUD_SQL_CONNECTION_NAME}`,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT
  })
}

app.get('/insert_test', (req, res)=>{
  obj = req.body;
  const connection = createPostgresClient.connect();
  connection.query('INSERT INTO generate (client_id, number, instance_id) VALUES (($1, $2, $3) )',
  ["client_id_352737n537", 23553, "instance_id_34vh5m7nv3y4573"], (err, results) => {
    if(err) res.status(400).end()
  });
  res.status(201).end();
})

app.get('/generate', (req, res) => {
    
    // Each instance will generate 1,000 random numbers
    const amountToGenerate = 1000

    // The maximum random number that can be generated is 100,000
    const max = 100000

    let numbers = []
    let largest = 0
    let smallest = max

    for (let index = 0; index < amountToGenerate; index++) {
        let num = Math.floor(Math.random() * (max))
        if(num > largest){
            largest = num
        }
        if(num < smallest){
            smallest = num
        }
        numbers.push(num)
    }
  res.status(200).json({
      instance: process.env.GAE_INSTANCE,
      largest: largest,
      smallest: smallest,
      numbers: numbers
  }).end();
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});


module.exports = app;
