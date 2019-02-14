require('./config/config.js');

const express = require('express');
const bodyParser = require('body-parser');
const apiRoute = require('./routes/api.route');

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.use('/api', apiRoute);

app.listen(port, () => {
  console.log(`Server started on ${port}`);
});
