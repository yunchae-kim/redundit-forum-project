require('dotenv').config();
const mysql = require('mysql2/promise');

const connect = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER_ADMIN,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    });
    return connection;
  } catch (err) {
    console.log(err);
    throw new Error('Error connecting to the database');
  }
};

module.exports = { connect };
