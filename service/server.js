const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors')

const app = express();
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)
app.use(cors())

const db = require('./queries')


app.get('/', (request, response) => {
  response.json({ info: 'Express API, and Postgres API' })
})


app.get('/numbers', db.getNumbers)

app.post('/generate', db.generateNumbers)

app.post('/maxmin', db.getMaxMin)

app.get('/clear', db.clearNumbers)


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});


module.exports = app;
