'use strict';

const mysql = require('mysql2/promise');

/**
 * Database module that creates a MySQL connection pool using environment variables.
 * Required env vars:
 *  - MYSQL_URL (optional, full URL e.g., mysql://user:pass@host:port/db?ssl=true)
 *  - MYSQL_USER
 *  - MYSQL_PASSWORD
 *  - MYSQL_DB
 *  - MYSQL_PORT
 *  - MYSQL_HOST (optional if MYSQL_URL used)
 */

let pool;

/**
 * Build pool config from either MYSQL_URL or discrete env variables.
 */
function buildConfigFromEnv() {
  const {
    MYSQL_URL,
    MYSQL_USER,
    MYSQL_PASSWORD,
    MYSQL_DB,
    MYSQL_PORT,
    MYSQL_HOST,
  } = process.env;

  if (MYSQL_URL) {
    return {
      uri: MYSQL_URL,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    };
  }

  if (!MYSQL_USER || !MYSQL_PASSWORD || !MYSQL_DB) {
    throw new Error(
      'Database configuration missing. Provide either MYSQL_URL or MYSQL_USER, MYSQL_PASSWORD, MYSQL_DB (and optionally MYSQL_HOST, MYSQL_PORT).'
    );
  }

  return {
    host: MYSQL_HOST || '127.0.0.1',
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DB,
    port: Number(MYSQL_PORT || 3306),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  };
}

/**
 * Initialize connection pool lazily.
 */
function getPool() {
  if (!pool) {
    const cfg = buildConfigFromEnv();
    pool = cfg.uri ? mysql.createPool(cfg.uri) : mysql.createPool(cfg);
  }
  return pool;
}

/**
 * Execute a query with values using the pool.
 * @param {string} sql SQL query with placeholders
 * @param {Array<any>} params parameter values
 * @returns {Promise<import('mysql2/promise').RowDataPacket[]|import('mysql2/promise').OkPacket>}
 */
// PUBLIC_INTERFACE
async function query(sql, params = []) {
  /** Execute a SQL query against the configured MySQL DB using a shared pool. */
  const [rows] = await getPool().execute(sql, params);
  return rows;
}

/**
 * Gracefully end the pool (for tests or shutdown).
 */
// PUBLIC_INTERFACE
async function close() {
  /** Close the MySQL pool if it exists. */
  if (pool) {
    await pool.end();
    pool = undefined;
  }
}

module.exports = {
  query,
  close,
};
