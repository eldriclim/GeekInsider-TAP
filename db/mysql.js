const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'user',
  password: 'password',
  database: 'school',
  port: 3306
});

db.connect((err) => {
  if (err) {
    return console.log(err);
  }
  console.log('Established connect to MySQL');
});

module.exports = { db };
