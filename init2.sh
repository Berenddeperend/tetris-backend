#!/bin/bash

# first run 'chmod +x init.sh'

# todo: go to 'tetris' namespace

`CREATE DATABASE yourdbname;
CREATE USER youruser WITH ENCRYPTED PASSWORD 'yourpass';
GRANT ALL PRIVILEGES ON DATABASE yourdbname TO youruser;
`

psql -U berend -c 'CREATE TABLE IF NOT EXISTS scores (
  id BIGSERIAL NOT NULL PRIMARY KEY,
  name VARCHAR(6) NOT NULL,
  score int NOT NULL,
  timestamp TIMESTAMP NOT NULL,
  v VARCHAR(20) NOT NULL,
  mode VARCHAR(20) NOT NULL
);'



