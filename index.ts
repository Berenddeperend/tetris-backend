const dotenv = require("dotenv").config();
const fs = require('fs');

import express from "express";
const cors = require("cors");
const bodyParser = require("body-parser");
const rateLimit = require("express-rate-limit");
const { Pool } = require("pg");
const app = express();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});
const PORT = 8000; //8000

app.use(cors());
app.use(bodyParser.json());

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});

app.get("/", rateLimit({ windowMs: 200, max: 1}), (req, res) => {
  res.send("working.");
});


app.get("/api/scores", rateLimit({ windowMs: 200, max: 1}), (req, res) => {
  pool.query(`SELECT * FROM scores`).then((scores) => {
    const output = [
      ...scores.rows.sort((a, b) => {
        return b.score - a.score || a.timestamp - b.timestamp;
      }),
    ];

    res.json(output);
  });
});

app.post("/api/score", rateLimit({ windowMs: 5000, max: 1}), (req, res) => {
  console.log(req.body);

  const timestamp = new Date().toISOString();

  const { name, score, v, mode } = req.body;
  const insertText =
    "INSERT INTO scores(name, score, timestamp, v, mode) VALUES ($1, $2, $3, $4, $5) RETURNING *";
  pool
    .query(insertText, [name.substring(0, 3), score, timestamp, v, mode])
    .then((submittedScore) => {
      res.json(submittedScore.rows[0]);
    });
});

// INSERT INTO score (name, score, timestamp, v, mode) VALUES ('brnd', 1, '2016-06-22 19:10:25-07', '1.0', 'singlePlayer');

