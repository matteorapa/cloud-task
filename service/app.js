'use strict';

const express = require('express');

const app = express();

//app.use(express.static("public"));

app.get('/generate', (req, res) => {
    const amountToGenerate = 100
    const max = 10000
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
      instance: 0,
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
