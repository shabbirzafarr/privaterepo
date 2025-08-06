const mysql = require('mysql2');

const connection = mysql.createConnection({
  uri: 'mysql://6pMoRJeXQKbQ12E.root:K6i91JhhTC5Zqi7H@gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/test?ssl={"rejectUnauthorized":true}'
});
// const connection = mysql.createConnection({
//   host: 'localhost',    // Local host
//   user: 'root',         // MySQL user (default is 'root')
//   password: 'n3u3da!', // Replace with your MySQL password
//   database: 'test',     // Replace with your database name
//   ssl: false            // Disable SSL for local connection
// });

connection.connect((err) => {
  if (err) {
    console.error('❌ DB Connection Failed:', err.message);
  } else {
    console.log('✅ DB Connected Successfully!');
  }
});
module.exports = connection;