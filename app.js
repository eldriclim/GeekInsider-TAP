require('./config/config.js');

const express = require('express');
const bodyParser = require('body-parser');
const apiRoute = require('./routes/api.route');
const herokuRoute = require('./routes/heroku.route');

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.use('/api', apiRoute);

// For deployment purposes only
if (process.env.CLEARDB_DATABASE_URL) {
  app.use('/heroku', herokuRoute);
}

app.listen(port, () => {
  console.log(`Server started on ${port}`);
});

module.exports = app;
