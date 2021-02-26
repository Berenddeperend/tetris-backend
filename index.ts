require('dotenv').config()
import express from 'express';
const cors = require("cors")
var bodyParser = require('body-parser')



const { Pool } = require('pg')
// rest of the code remains same
const app = express();
const pool = new Pool()
const PORT = 8000;

app.use(cors());
app.use(bodyParser.json());

console.log("=======================================")

app.get('/scores', (req, res) => {
  const scores = pool.query(`SELECT * FROM score`).then(scores => {
    res.json(scores)
  });
});

app.post('/score', (req, res) => {
  console.log(req.body)

  const {name, score, timestamp} = req.body;

  const insertText = 'INSERT INTO score(name, score, timestamp) VALUES ($1, $2, $3)'
  pool.query(insertText, [name, score, timestamp]).then(scores => {
    return pool.query(`SELECT * FROM score`);
  }).then(scores => {
    res.json(scores);
  });

})

// INSERT INTO score (name, score, timestamp) VALUES ('brnd', 1, '2016-06-22 19:10:25-07')


//   // pool.query('SELECT NOW()', (err, res) => {
//   //   console.log(err, res)
//   //   pool.end()
//   // })
// });
app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});


// pool.end(); 


  // pool.query(`
  // INSERT INTO score (name, score, timestamp) VALUES ('brnd', 1, ${date});
  // `);




// `
// CREATE TABLE score (
//   id BIGSERIAL NOT NULL PRIMARY KEY,
//   name VARCHAR(6) NOT NULL,
//   score int NOT NULL,
//   timestamp TIMESTAMP NOT NULL
// );
// `