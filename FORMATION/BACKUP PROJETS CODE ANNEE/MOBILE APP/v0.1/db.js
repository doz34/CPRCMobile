const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'CyberpunkRedCompanion',
  password: '0000',
  port: 5432,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
