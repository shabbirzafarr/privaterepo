// const mysql = require("mysql2");
// require("dotenv").config();

// const db = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASS,
//   database: process.env.DB_NAME,
//   port: 4000,
//   ssl: {
//     rejectUnauthorized: true
//   }
// });

// db.connect(err => {
//   if (err) throw err;
//   console.log("MySQL connected");
// });

// module.exports = db;
const mysql = require('mysql2');

const connection = mysql.createConnection({
  uri: 'mysql://6pMoRJeXQKbQ12E.root:K6i91JhhTC5Zqi7H@gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/test?ssl={"rejectUnauthorized":true}'
});

connection.connect((err) => {
  if (err) {
    console.error('❌ DB Connection Failed:', err.message);
  } else {
    console.log('✅ DB Connected Successfully!');
  }
});
module.exports = connection;
