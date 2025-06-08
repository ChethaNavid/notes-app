import mysql from 'mysql2/promise';
import 'dotenv/config';

let connection;

export const getConnection = async () => {
  if (!connection) {
    connection = await mysql.createConnection(process.env.CONNECTION_URL);
    console.log('Connected to MySQL');
  }
  return connection;
};
