'use strict';

const db = require('./db');

const CREATE_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS contact_submissions (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NULL,
  subject VARCHAR(255) NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_email_created_at (email, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`;

/**
 * Ensure the contact_submissions table exists.
 */
async function ensureTable() {
  await db.query(CREATE_TABLE_SQL);
}

/**
 * Insert a contact submission.
 * @param {{name:string,email:string,message:string,phone?:string,subject?:string}} payload
 * @returns {Promise<{id:number}>}
 */
// PUBLIC_INTERFACE
async function saveContactSubmission(payload) {
  /** Persist a contact form submission into the database and return the created ID. */
  await ensureTable();
  const sql = `
    INSERT INTO contact_submissions (name, email, phone, subject, message)
    VALUES (?, ?, ?, ?, ?)
  `;
  const params = [
    payload.name.trim(),
    payload.email.trim(),
    payload.phone ? payload.phone.trim() : null,
    payload.subject ? payload.subject.trim() : null,
    payload.message.trim(),
  ];
  const result = await db.query(sql, params);
  return { id: result.insertId };
}

module.exports = {
  saveContactSubmission,
};
