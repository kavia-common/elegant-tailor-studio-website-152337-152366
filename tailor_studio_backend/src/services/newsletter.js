'use strict';

const db = require('./db');

const CREATE_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL,
  subscribed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uniq_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`;

/**
 * Ensure the newsletter_subscribers table exists.
 */
async function ensureTable() {
  await db.query(CREATE_TABLE_SQL);
}

/**
 * Subscribe an email to the newsletter. Idempotent on email.
 * @param {{email:string}} payload
 * @returns {Promise<{id:number, created:boolean}>}
 */
// PUBLIC_INTERFACE
async function subscribeEmail(payload) {
  /** Insert a newsletter subscriber if not already present; returns id and created flag. */
  await ensureTable();

  // Try insert; if duplicate, fetch existing id
  const insertSql = `
    INSERT INTO newsletter_subscribers (email)
    VALUES (?)
  `;
  try {
    const result = await db.query(insertSql, [payload.email.trim()]);
    return { id: result.insertId, created: true };
  } catch (err) {
    // ER_DUP_ENTRY code for MySQL duplicate key
    if (err && err.code === 'ER_DUP_ENTRY') {
      const rows = await db.query(
        'SELECT id FROM newsletter_subscribers WHERE email = ? LIMIT 1',
        [payload.email.trim()]
      );
      const existing = Array.isArray(rows) && rows[0] ? rows[0] : null;
      return { id: existing ? existing.id : 0, created: false };
    }
    throw err;
  }
}

module.exports = {
  subscribeEmail,
};
