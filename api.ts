import express from "express";
const rateLimit = require("express-rate-limit");
const { Pool } = require("pg");
const pool = new Pool();
const app = express();

export const getScores = app.get("/scores", rateLimit({ windowMs: 200, max: 1}), (req, res) => {
    pool.query(`SELECT * FROM scores`).then((scores) => {
      const output = [
        ...scores.rows.sort((a, b) => {
          return b.score - a.score || a.timestamp - b.timestamp;
        }),
      ];
  
      res.json(output);
    });
  });
  
export const postScore = app.post("/score", rateLimit({ windowMs: 5000, max: 1}), (req, res) => {
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