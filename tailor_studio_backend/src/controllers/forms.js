'use strict';

const { validateContact, validateSubscription } = require('../utils/validators');
const contactService = require('../services/contact');
const newsletterService = require('../services/newsletter');

class FormsController {
  /**
   * Handle contact form submission.
   * Body params:
   *  - name (string, required)
   *  - email (string, required, email)
   *  - message (string, required)
   *  - phone (string, optional)
   *  - subject (string, optional)
   */
  // PUBLIC_INTERFACE
  async submitContact(req, res, next) {
    /** Express handler to accept and persist contact form submissions. Returns JSON with created id. */
    try {
      const { valid, errors } = validateContact(req.body || {});
      if (!valid) {
        return res.status(400).json({ status: 'error', errors });
      }
      const created = await contactService.saveContactSubmission(req.body);
      return res.status(201).json({
        status: 'success',
        data: { id: created.id },
        message: 'Contact submission received',
      });
    } catch (err) {
      return next(err);
    }
  }

  /**
   * Handle newsletter subscribe.
   * Body params:
   *  - email (string, required, email)
   */
  // PUBLIC_INTERFACE
  async subscribe(req, res, next) {
    /** Express handler to subscribe an email to the newsletter. Idempotent on duplicates. */
    try {
      const { valid, errors } = validateSubscription(req.body || {});
      if (!valid) {
        return res.status(400).json({ status: 'error', errors });
      }
      const result = await newsletterService.subscribeEmail(req.body);
      const statusCode = result.created ? 201 : 200;
      return res.status(statusCode).json({
        status: 'success',
        data: { id: result.id, created: result.created },
        message: result.created ? 'Subscribed successfully' : 'Already subscribed',
      });
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = new FormsController();
