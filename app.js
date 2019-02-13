const express = require('express');
const bodyParser = require('body-parser');
const { db } = require('./db/mysql');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/', (req, res) => {});

/*

  db.query('SELECT * from Teachers', (error, results) => {
    if (error) throw error;
    console.log(results);
    
  });
*/

app.listen(port, () => {
  console.log(`Server started on ${port}`);
});
