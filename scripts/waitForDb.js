const mysql = require('mysql2/promise');

const config = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'dofus_items',
};

const maxAttempts = Number(process.env.DB_WAIT_ATTEMPTS || 30);
const delayMs = Number(process.env.DB_WAIT_DELAY_MS || 2000);

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function waitForDb() {
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const connection = await mysql.createConnection(config);
      await connection.query('SELECT 1');
      await connection.end();
      console.log(`DB ready after ${attempt} attempt(s).`);
      return;
    } catch (error) {
      const message = error && error.message ? error.message : String(error);
      console.log(`Waiting for DB (${attempt}/${maxAttempts})... ${message}`);
      if (attempt === maxAttempts) {
        throw new Error('DB is not reachable after maximum attempts.');
      }
      await sleep(delayMs);
    }
  }
}

waitForDb().catch(error => {
  console.error(error.message);
  process.exit(1);
});
