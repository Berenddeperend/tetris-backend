#!/bin/bash

# first run 'chmod +x init.sh'

# todo: go to 'tetris' namespace

sudo -u postgres psql tetris -c 'CREATE TABLE IF NOT EXISTS scores (
  id BIGSERIAL NOT NULL PRIMARY KEY,
  name VARCHAR(6) NOT NULL,
  score int NOT NULL,
  timestamp TIMESTAMP NOT NULL
  v VARCHAR(20) NOT NULL,
  mode VARCHAR(20) NOT NULL,
);'