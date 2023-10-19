"use strict"

const express = require('express');
const bodyParser = require('body-parser');
const rho_deploy = require('./lib/rho_deploy.js');
const setter = require('./lib/setter.js');
const coder = require('./lib/coder.js');

// Parse command-line arguments
var host   = process.argv[2] ? process.argv[2] : "localhost"
var port   = process.argv[3] ? process.argv[3] : 40401
var uiPort = process.argv[4] ? process.argv[4] : 8080

// Configure the express app and RNode connection
var app = express();
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));



// Start the express app
app.listen(uiPort, () => {
  console.log("Nth Caller Dapp server started.")
  console.log(`Connected to RNode at ${host}:${port}.`)
  console.log(`started on ${uiPort}`)
});

app.get('/', (req,res) => {
  res.sendFile(__dirname + '/public/hello.html');
});


app.post('/get', (req, res) => {
  setter.getter(req.body.name).then(
    (ret) => {
      res.end("\"" + ret + "\"");
      console.log("get: " + req.body.name + " " + ret + "\n");
    }
  );
});

app.post('/set', (req, res) => {

  setter.setter(req.body.name, req.body.value).then(
    () => {
      res.end("\"" + "Set();" + "\"");
      console.log("set: " + req.body.name + " " + req.body.value + "\n");
    }
  );
});

app.post('/new', (req, res) => {

  setter.new_deploy("A");
  setter.new_deploy("B");
});
