const dotenv = require("dotenv").config();
const fs = require('fs');

import express from "express";
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const { Pool } = require("pg");
const app = express();
const pool = new Pool();
const PORT = 8000; //8000

const http = require('http');
const https = require('https');

app.use(cors());
app.use(bodyParser.json());
app.options("*", cors()); // include before other routes



const privateKey = fs.readFileSync('/home/pi/letsencrypt/live/berendswennenhuis.nl/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/home/pi/letsencrypt/live/berendswennenhuis.nl/cert.pem', 'utf8');
const ca = fs.readFileSync('/home/pi/letsencrypt/live/berendswennenhuis.nl/chain.pem', 'utf8');



const credentials = {
	key: privateKey,
	cert: certificate,
	ca: ca
};

const httpsServer = https.createServer(credentials, app);

httpsServer.listen(443, () => {
	console.log('HTTPS Server running on port 443');
});

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});


app.get("/", (req, res) => {
  // res.sendFile('./index.html')
  // res.sendFile(path.join(__dirname, "./../tetris/dist", "index.html"));

  res.send("hello world");
});

app.get("/scores", (req, res) => {
  pool.query(`SELECT * FROM scores`).then((scores) => {
    const output = [
      ...scores.rows.sort((a, b) => {
        return b.score - a.score || a.timestamp - b.timestamp;
      }),
    ];

    res.json(output);
  });
});

app.post("/score", (req, res) => {
  console.log(req.body);

  const { name, score, timestamp, v, mode } = req.body;
  const insertText =
    "INSERT INTO scores(name, score, timestamp, v, mode) VALUES ($1, $2, $3, $4, $5) RETURNING *";
  pool
    .query(insertText, [name, score, timestamp, v, mode])
    .then((submittedScore) => {
      res.json(submittedScore.rows[0]);
    });
});

// INSERT INTO score (name, score, timestamp, v, mode) VALUES ('brnd', 1, '2016-06-22 19:10:25-07', '1.0', 'singlePlayer');

