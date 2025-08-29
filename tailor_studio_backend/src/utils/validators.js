'use strict';

/**
 * Lightweight input validators for API payloads.
 */

const EMAIL_REGEX =
  // Basic email regex suitable for validation without being overly strict
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validate contact form payload.
 * @param {object} body
 * @returns {{valid:boolean, errors:Record<string,string>}}
 */
// PUBLIC_INTERFACE
function validateContact(body) {
  /** Validate name, email, message (and optional phone, subject) for contact form submissions. */
  const errors = {};

  const name = (body.name || '').toString().trim();
  const email = (body.email || '').toString().trim();
  const message = (body.message || '').toString().trim();
  const phone = (body.phone || '').toString().trim();
  const subject = (body.subject || '').toString().trim();

  if (!name) errors.name = 'Name is required';
  if (!email) errors.email = 'Email is required';
  if (email && !EMAIL_REGEX.test(email)) errors.email = 'Email is invalid';
  if (!message) errors.message = 'Message is required';
  if (message && message.length > 4000) errors.message = 'Message too long (max 4000 chars)';
  if (phone && phone.length > 50) errors.phone = 'Phone too long';
  if (subject && subject.length > 255) errors.subject = 'Subject too long';

  return { valid: Object.keys(errors).length === 0, errors };
}

/**
 * Validate newsletter subscription payload.
 * @param {object} body
 * @returns {{valid:boolean, errors:Record<string,string>}}
 */
// PUBLIC_INTERFACE
function validateSubscription(body) {
  /** Validate email for newsletter subscription requests. */
  const errors = {};
  const email = (body.email || '').toString().trim();
  if (!email) errors.email = 'Email is required';
  if (email && !EMAIL_REGEX.test(email)) errors.email = 'Email is invalid';
  return { valid: Object.keys(errors).length === 0, errors };
}

module.exports = {
  validateContact,
  validateSubscription,
};
