
const { Pool } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL || process.env.DIRECT_URL;

console.log('Testing connection to:', connectionString.split('@')[1]);

const pool = new Pool({
  connectionString,
  connectionTimeoutMillis: 5000,
});

async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('Successfully connected to the database');
    const res = await client.query('SELECT NOW()');
    console.log('Query result:', res.rows[0]);
    client.release();
  } catch (err) {
    console.error('Connection error:', err.message);
    if (err.stack) {
      console.error(err.stack);
    }
  } finally {
    await pool.end();
  }
}

testConnection();
