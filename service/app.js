'use strict';

const express = require('express');

const app = express();

//app.use(express.static("public"));

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
