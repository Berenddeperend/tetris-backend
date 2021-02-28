const dotenv = require("dotenv").config();
import express from "express";
const cors = require("cors");
const bodyParser = require("body-parser");

const { Pool } = require("pg");
const app = express();
const pool = new Pool();
const PORT = 8000;
app.use(cors());
app.options("*", cors()); // include before other routes
app.use(bodyParser.json());
console.log("=======================================");

app.get("/", (req, res) => {
  // res.sendFile('./index.html')
  res.send("hello world");
});

app.get("/scores", (req, res) => {
  pool.query(`SELECT * FROM scores`).then((scores) => {
    res.json(scores);
  });
});

app.post("/score", (req, res) => {
  console.log(req.body);
  const { name, score, date, v, mode } = req.body;
  const insertText =
    "INSERT INTO scores(name, score, timestamp, v, mode) VALUES ($1, $2, $3, $4, $5) RETURNING *";
  pool
    .query(insertText, [name, score, date, v, mode])
    .then((scores) => {
      return pool.query(`SELECT * FROM scores`);
    })
    .then((scores) => {
      res.json(scores);
    });
});

// INSERT INTO score (name, score, timestamp, v, mode) VALUES ('brnd', 1, '2016-06-22 19:10:25-07', '1.0', 'singlePlayer');

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});