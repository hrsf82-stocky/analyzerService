const express = require('express');
const bodyParser = require('body-parser');
const db = require('../database/index.js');

const app = express();
const PORT = 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
