const Pool = require('pg').Pool
const dbSocketPath = process.env.DB_SOCKET_PATH || '/cloudsql'

const pool = new Pool({
  user: process.env.DB_USER,
  //host: '34.76.139.69',
  host: `${dbSocketPath}/${process.env.CLOUD_SQL_CONNECTION_NAME}`,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
})

const getNumbers = (req, res) => {
  pool.query('SELECT * FROM generated', (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows).end()
  })
}

const getMaxMin = (req, res) => {

    pool.query('SELECT MAX(generated_number) AS max_number, instance_id FROM generated WHERE client_id=$1 GROUP BY instance_id', [req.body.client_id], (err, results) => {
        if(err) res.status(400).end()
            max = results.rows[0]['max_number']
            max_instance = results.rows[0]['instance_id']
    
        
        pool.query('SELECT MIN(generated_number) AS min_number, instance_id FROM generated WHERE client_id=$1 GROUP BY instance_id', [req.body.client_id], (err, min_results) => {
          if(err) res.status(400).end()
            res.status(200).json({
            max: max, 
            max_instance: max_instance,
            min: min_results.rows[0]['min_number'],
            min_instance: min_results.rows[0]['instance_id']
          })
        })
      })
}

const generateNumbers = (req, res) => {

    const {client_id}= req.body
    const amountToGenerate = 1000
    const maximum = 100000
    
    let numbers = []
    let largest = 0
    let smallest = 100000

    for (let index = 0; index < amountToGenerate; index++) {
        let num = Math.floor(Math.random() * (maximum))
        if(num > largest){
            largest = num
        }
        if(num < smallest){
          smallest = num
        }
        numbers.push(num)
    }

    pool.query('INSERT INTO public.generated (instance_id, client_id, generated_number) VALUES ($1, $2, $3)',
    [process.env.GAE_INSTANCE, client_id, largest], (err, results) => {
        if(err) throw err
      
    });

    pool.query('INSERT INTO public.generated (instance_id, client_id, generated_number) VALUES ($1, $2, $3)',
    [process.env.GAE_INSTANCE, client_id, smallest], (err, results) => {
        if(err) throw err
    });

    // Returning all generated numbers by instance
    res.status(200).json({
        client: req.body.client_id,
        instance: process.env.GAE_INSTANCE,
        numbers: numbers
    }).end();
}

const clearNumbers = (req, res) => {
    pool.query('TRUNCATE TABLE generated', (err, response) => {
        if (err) throw err
    })
    res.status(200).send("Cleared all rows from generated table.")
}

module.exports = {
  getNumbers,
  generateNumbers,
  getMaxMin,
  clearNumbers
}












