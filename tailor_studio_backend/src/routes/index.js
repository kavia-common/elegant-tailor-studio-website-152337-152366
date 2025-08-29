const express = require('express');
const healthController = require('../controllers/health');
const formsController = require('../controllers/forms');

const router = express.Router();
// Health endpoint

/**
 * @swagger
 * /:
 *   get:
 *     summary: Health endpoint
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: Service health check passed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 message:
 *                   type: string
 *                   example: Service is healthy
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 environment:
 *                   type: string
 *                   example: development
 */
router.get('/', healthController.check.bind(healthController));

/**
 * @swagger
 * components:
 *   schemas:
 *     ContactRequest:
 *       type: object
 *       required: [name, email, message]
 *       properties:
 *         name:
 *           type: string
 *           description: Sender's full name
 *           example: Jane Doe
 *         email:
 *           type: string
 *           format: email
 *           description: Sender's email address
 *           example: jane@example.com
 *         phone:
 *           type: string
 *           description: Optional phone number
 *           example: "+1 555 123 4567"
 *         subject:
 *           type: string
 *           description: Optional subject line
 *           example: Custom suit inquiry
 *         message:
 *           type: string
 *           description: Message body
 *           example: I would like to discuss a bespoke suit.
 *     SubscribeRequest:
 *       type: object
 *       required: [email]
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: subscriber@example.com
 */

/**
 * @swagger
 * /api/contact:
 *   post:
 *     summary: Submit contact form
 *     description: Accepts contact form details and stores them in the database.
 *     tags:
 *       - Forms
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ContactRequest'
 *     responses:
 *       201:
 *         description: Contact submission created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                 message:
 *                   type: string
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal Server Error
 */
router.post('/api/contact', formsController.submitContact.bind(formsController));

/**
 * @swagger
 * /api/newsletter/subscribe:
 *   post:
 *     summary: Subscribe to newsletter
 *     description: Subscribes an email to the newsletter list. Idempotent if already subscribed.
 *     tags:
 *       - Forms
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SubscribeRequest'
 *     responses:
 *       201:
 *         description: Successfully subscribed
 *       200:
 *         description: Already subscribed
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal Server Error
 */
router.post('/api/newsletter/subscribe', formsController.subscribe.bind(formsController));

module.exports = router;
