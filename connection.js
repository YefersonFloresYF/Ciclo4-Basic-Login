const sqlite3 = require('sqlite3').verbose();

// open database in memory
let db = new sqlite3.Database('./db/web_database.db', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to SQlite database.');
});

// close the database connection
db.close((err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Close the database connection.');
});